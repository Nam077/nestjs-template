import { FindOneOptionsCustom } from './find-one.interface';

/**
 * CRUD Interface
 * @template ENTITY - is the entity type
 * @template CREATE_DTO - is the data transfer object for creating a new entity
 * @template UPDATE_DTO - is the data transfer object for updating an existing entity
 * @template RESPONSE_DATA - is the data transfer object for returning a response
 * @template FIND_ALL_DTO - is the data transfer object for finding all entities
 */
export interface CRUDInterface<ENTITY, CREATE_DTO, UPDATE_DTO, RESPONSE_DATA, FIND_ALL_DTO> {
    createHandler: (createDTO: CREATE_DTO) => Promise<ENTITY>;
    create: (createDTO: CREATE_DTO) => Promise<RESPONSE_DATA>;

    findAllHandler: (findAllDTO: FIND_ALL_DTO) => Promise<ENTITY[]>;
    findAll: (findAllDTO: FIND_ALL_DTO) => Promise<RESPONSE_DATA>;

    findOneHandler: (id: string, options?: FindOneOptionsCustom<ENTITY>) => Promise<ENTITY>;
    findOne: (id: string) => Promise<RESPONSE_DATA>;
    findOneOrFail: (id: string, options?: FindOneOptionsCustom<ENTITY>) => Promise<ENTITY>;

    updateHandler: (id: string, updateDTO: UPDATE_DTO) => Promise<ENTITY>;
    update: (id: string, updateDTO: UPDATE_DTO) => Promise<RESPONSE_DATA>;

    removeHandler: (id: string) => Promise<ENTITY>;
    remove: (id: string) => Promise<RESPONSE_DATA>;

    restoreHandler: (id: string) => Promise<ENTITY>;
    restore: (id: string) => Promise<RESPONSE_DATA>;

    deleteHandler: (id: string, force?: boolean) => Promise<ENTITY>;
    delete: (id: string, force?: boolean) => Promise<RESPONSE_DATA>;
}
