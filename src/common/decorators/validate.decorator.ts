import {
    registerDecorator,
    ValidateIf,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { get, has } from 'lodash';

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

/**
 *
 */
@ValidatorConstraint({ async: false })
export class MatchConstraint implements ValidatorConstraintInterface {
    /**
     *
     * @param {any} value - The value to validate
     * @param {ValidationArguments} args - The validation arguments
     */
    validate(value: any, args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = get(args.object, relatedPropertyName);

        return value === relatedValue;
    }

    /**
     *
     * @param {ValidationArguments} args - The validation arguments to use
     */
    defaultMessage(args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;

        return `${relatedPropertyName} and ${args.property} do not match`;
    }
}

/**
 *
 * @param {string} property - The property to match
 * @param {ValidationOptions} validationOptions - The validation options
 */
export function Match(property: string, validationOptions?: ValidationOptions) {
    return (object: NonNullable<unknown>, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: MatchConstraint,
        });
    };
}
