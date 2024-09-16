import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';

import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';

import { FindAllDtoAbstract } from '../classes';

interface FindAllDtoWithSearchFields extends FindAllDtoAbstract {
    sortField?: string;
}
interface PaginationData<T> {
    items: T[]; // Array of items
    total: number; // Total number of items
    page: number; // Current page number
    limit: number; // Number of items per page
    totalPages: number; // Total number of pages
    nextPage: number | null; // Next page number, null if no more pages
    prevPage: number | null; // Previous page number, null if no more pages
}

export interface SearchField {
    tableName: string;
    fields: string[];
}

export interface CustomCondition {
    field: string;
    value: any;
    operator?: 'EQUAL' | 'LIKE' | 'LT' | 'GT' | 'BETWEEN' | 'IN' | 'NOT_IN';
}

/**
 * Applies additional custom conditions to the query builder.
 * @template T - The entity type.
 * @param {SelectQueryBuilder<T>} queryBuilder - The TypeORM query builder.
 * @param {CustomCondition[]} conditions - Array of custom conditions to apply.
 */
const applyAdditionalConditions = <T>(queryBuilder: SelectQueryBuilder<T>, conditions: CustomCondition[]): void => {
    conditions.forEach(({ field, value, operator = 'EQUAL' }, index) => {
        const paramName = `${field}${index}`;
        const conditionString = field.includes('.') ? field : `${queryBuilder.alias}.${field}`;

        switch (operator) {
            case 'LIKE':
                queryBuilder.andWhere(`${conditionString} LIKE :${paramName}`, { [paramName]: `%${value}%` });
                break;
            case 'LT':
                queryBuilder.andWhere(`${conditionString} < :${paramName}`, { [paramName]: value });
                break;
            case 'GT':
                queryBuilder.andWhere(`${conditionString} > :${paramName}`, { [paramName]: value });
                break;
            case 'BETWEEN':
                const { start, end } = value as { start: any; end: any };

                queryBuilder.andWhere(`${conditionString} BETWEEN :start AND :end`, { start, end });
                break;
            case 'IN':
                queryBuilder.andWhere(`${conditionString} IN (:...${paramName})`, { [paramName]: value });
                break;
            case 'NOT_IN':
                queryBuilder.andWhere(`${conditionString} NOT IN (:...${paramName})`, { [paramName]: value });
                break;
            default:
                queryBuilder.andWhere(`${conditionString} = :${paramName}`, { [paramName]: value });
                break;
        }
    });
};

/**
 * Adds relations to the query builder for eager loading.
 * @template T - The entity type.
 * @param {SelectQueryBuilder<T>} queryBuilder - The TypeORM query builder.
 * @param {string} tableName - The name of the primary table.
 * @param {string[]} [relations] - Array of relations to include.
 */
const addRelationsToQueryBuilder = <T>(
    queryBuilder: SelectQueryBuilder<T>,
    tableName: string,
    relations?: string[],
): void => {
    if (relations) {
        relations = relations.filter((relation) => relation !== '' && relation !== null);
        relations.forEach((relation) => {
            let entityAlias: string;
            let relationName: string;

            if (!relation.includes('.')) {
                entityAlias = tableName;
                relationName = relation;
            } else {
                [entityAlias, relationName] = relation.split('.');
            }

            queryBuilder.leftJoinAndSelect(`${entityAlias}.${relationName}`, relationName);
        });
    }
};

/**
 * Validates whether all required relations for searching in related fields are included.
 * @param {SearchField[]} searchFieldsInRelations - Fields in relations to search in.
 * @param {string[]} [relations] - Relations included in the query.
 * @returns {boolean} - Returns true if all required relations are included, false otherwise.
 */
const validateRelations = (searchFieldsInRelations: SearchField[], relations?: string[]): boolean => {
    if (searchFieldsInRelations.length > 0) {
        const requiredRelations = searchFieldsInRelations.map((sf) => sf.tableName);

        return requiredRelations.every((rr) => relations?.includes(rr));
    }

    return true;
};

/**
 * Performs a paginated and searchable query on the provided repository.
 * @template T - The entity type.
 * @param {Repository<T>} repository - The TypeORM repository of the entity.
 * @param {FindAllDtoWithSearchFields} findAllDto - Data transfer object containing pagination and search parameters.
 * @param {Array<keyof T>} fields - Fields of the entity to search in.
 * @param {boolean} [isWithDeleted] - Whether to include soft-deleted records in the results.
 * @param {string[]} relations - Relations to include in the query.
 * @param {SearchField[]} [searchFieldsInRelations] - Fields in related entities to search in.
 * @param {CustomCondition[]} [additionalConditions] - Additional custom conditions to apply to the query.
 * @returns {Promise<PaginationData<T>>} - Returns a paginated response of the entity type.
 * @throws {HttpException} - Throws an HTTP exception if required relations for the specified search fields are missing.
 * @throws {BadRequestException} - Throws a BadRequestException if there is an error executing the query.
 */
export const findWithPaginationAndSearch = async <T>(
    repository: Repository<T>,
    findAllDto: FindAllDtoWithSearchFields,
    fields: Array<keyof T>,
    isWithDeleted: boolean = false,
    relations: string[],
    searchFieldsInRelations: SearchField[] = [],
    additionalConditions: CustomCondition[] = [],
): Promise<PaginationData<T>> => {
    if (!validateRelations(searchFieldsInRelations, relations)) {
        throw new HttpException(
            'Missing required relations for the specified search fields in relations.',
            HttpStatus.BAD_REQUEST,
        );
    }

    const nameTable = repository.metadata.tableName;
    const { query, page = 1, limit, sort, sortField, withDeleted } = findAllDto;

    const queryBuilder = repository.createQueryBuilder(nameTable);

    if (query) {
        const lowercaseQuery = `%${query.toLowerCase()}%`;

        queryBuilder.andWhere(
            new Brackets((qb) => {
                fields.forEach((field, index) => {
                    const method = index === 0 ? 'where' : 'orWhere';

                    // eslint-disable-next-line security/detect-object-injection
                    qb[method](`LOWER(${nameTable}.${field as string}) LIKE :query`, { query: lowercaseQuery });
                });

                if (searchFieldsInRelations) {
                    searchFieldsInRelations.forEach(({ tableName, fields }) => {
                        fields.forEach((field) => {
                            qb.orWhere(`LOWER(${tableName}.${field}) LIKE :query`, { query: lowercaseQuery });
                        });
                    });
                }
            }),
        );
    }

    addRelationsToQueryBuilder(queryBuilder, nameTable, relations);

    if (additionalConditions.length > 0) {
        applyAdditionalConditions(queryBuilder, additionalConditions);
    }

    const pageNew = Math.max(page, 1);
    let limitNew = limit > 0 ? limit : 10;

    if (limitNew > 100) {
        limitNew = 100;
    }

    queryBuilder.skip((pageNew - 1) * limitNew).take(limitNew);

    queryBuilder.orderBy(`${nameTable}.createdAt`, 'DESC');

    if (sort && sortField) {
        queryBuilder.orderBy(`${nameTable}.${sortField}`, sort);
    }

    if ((isWithDeleted && withDeleted === 'TRUE') || (isWithDeleted && !withDeleted)) {
        queryBuilder.withDeleted();
    }

    try {
        const [data, total] = await queryBuilder.getManyAndCount();

        return {
            page: Number(pageNew),
            items: data,
            limit: Number(limitNew),
            total,
            totalPages: Math.ceil(total / limitNew),
            nextPage: pageNew * limitNew < total ? pageNew + 1 : undefined,
            prevPage: pageNew > 1 ? pageNew - 1 : undefined,
        };
    } catch (error) {
        throw new BadRequestException(error.message);
    }
};
