/* eslint-disable @typescript-eslint/method-signature-style */
import { FindOneOptionsCustom } from './find-one.interface';

/**
 * CRUD Interface
 * @template ENTITY - The entity type
 * @template CREATE_DTO - Data Transfer Object for creating a new entity
 * @template UPDATE_DTO - Data Transfer Object for updating an existing entity
 * @template RESPONSE_DATA - Data Transfer Object for returning a response
 * @template FIND_ALL_DTO - Data Transfer Object for finding all entities
 * @template PAGINATION_DATA - Data Transfer Object for pagination results
 * @template CURRENT_USER - The type representing the current user
 */
export interface CRUDInterface<
    ENTITY,
    CREATE_DTO,
    UPDATE_DTO,
    RESPONSE_DATA,
    FIND_ALL_DTO,
    PAGINATION_DATA,
    CURRENT_USER,
> {
    /**
     * Core method for creating a new entity
     * @param createDTO - The DTO for creating a new entity
     * @returns The created entity
     */
    createEntity(createDTO: CREATE_DTO): Promise<ENTITY>;

    /**
     * Creates a new entity with the current user context
     * @param createDTO - The DTO for creating a new entity
     * @param currentUser - The current user performing the operation
     * @returns The response data
     */
    create(createDTO: CREATE_DTO, currentUser: CURRENT_USER): Promise<RESPONSE_DATA>;

    /**
     * Core method for finding all entities
     * @param findAllDTO - The DTO for finding all entities
     * @param includeDeleted - Include soft-deleted records if true
     * @returns The pagination data
     */
    findAllEntities(findAllDTO: FIND_ALL_DTO, includeDeleted?: boolean): Promise<PAGINATION_DATA>;

    /**
     * Finds all entities with the current user context
     * @param findAllDTO - The DTO for finding all entities
     * @param currentUser - The current user performing the operation
     * @returns The response data
     */
    findAll(findAllDTO: FIND_ALL_DTO, currentUser: CURRENT_USER): Promise<RESPONSE_DATA>;

    /**
     * Core method for finding one entity by ID
     * @param id - The ID of the entity
     * @param options - Additional options for finding the entity
     * @param includeDeleted - Include soft-deleted record if true
     * @returns The found entity
     */
    findEntityById(id: string, options?: FindOneOptionsCustom<ENTITY>, includeDeleted?: boolean): Promise<ENTITY>;

    /**
     * Finds one entity by ID with the current user context
     * @param id - The ID of the entity
     * @param currentUser - The current user performing the operation
     * @returns The response data
     */
    findOne(id: string, currentUser: CURRENT_USER): Promise<RESPONSE_DATA>;

    /**
     * Finds one entity by ID or throws an error if not found
     * @param id - The ID of the entity
     * @param includeDeleted - Include soft-deleted record if true
     * @param options - Additional options for finding the entity
     * @param currentUser - The current user performing the operation
     * @returns The found entity
     */
    findOneOrFail(
        id: string,
        options?: FindOneOptionsCustom<ENTITY>,
        includeDeleted?: boolean,
        currentUser?: CURRENT_USER,
    ): Promise<ENTITY>;

    /**
     * Core method for updating an entity
     * @param id - The ID of the entity
     * @param updateDTO - The DTO for updating the entity
     * @returns The updated entity
     */
    updateEntity(id: string, updateDTO: UPDATE_DTO): Promise<ENTITY>;

    /**
     * Updates an entity with the current user context
     * @param id - The ID of the entity
     * @param updateDTO - The DTO for updating the entity
     * @param currentUser - The current user performing the operation
     * @returns The response data
     */
    update(id: string, updateDTO: UPDATE_DTO, currentUser: CURRENT_USER): Promise<RESPONSE_DATA>;

    /**
     * Core method for soft-deleting an entity
     * @param id - The ID of the entity
     * @returns The soft-deleted entity
     */
    softDeleteEntity(id: string): Promise<ENTITY>;

    /**
     * Soft-deletes an entity with the current user context
     * @param id - The ID of the entity
     * @param currentUser - The current user performing the operation
     * @returns The response data
     */
    remove(id: string, currentUser: CURRENT_USER): Promise<RESPONSE_DATA>;

    /**
     * Core method for restoring a soft-deleted entity
     * @param id - The ID of the entity
     * @returns The restored entity
     */
    restoreEntity(id: string): Promise<ENTITY>;

    /**
     * Restores a soft-deleted entity with the current user context
     * @param id - The ID of the entity
     * @param currentUser - The current user performing the operation
     * @returns The response data
     */
    restore(id: string, currentUser: CURRENT_USER): Promise<RESPONSE_DATA>;

    /**
     * Core method for permanently deleting an entity
     * @param id - The ID of the entity
     * @param force - Force deletion if true
     * @returns The deleted entity
     */
    deleteEntity(id: string, force?: boolean): Promise<ENTITY>;

    /**
     * Permanently deletes an entity with the current user context
     * @param id - The ID of the entity
     * @param currentUser - The current user performing the operation
     * @param force - Force deletion if true
     * @returns The response data
     */
    delete(id: string, currentUser: CURRENT_USER, force?: boolean): Promise<RESPONSE_DATA>;
}
