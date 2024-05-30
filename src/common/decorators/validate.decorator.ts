import { ValidateIf, ValidationOptions } from 'class-validator';
import { has } from 'lodash';

/**
 *
 * @param {ValidationOptions} options - Validation options
 * @returns {PropertyDecorator} - Property decorator
 */
export const IsOptionalCustom = (options?: ValidationOptions): PropertyDecorator => {
    return (prototype: object, propertyKey: string | symbol): void => {
        ValidateIf((object) => object != null && has(object, propertyKey), options)(prototype, propertyKey);
    };
};
