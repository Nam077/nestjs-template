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
     * Validate the value
     * @param {any} value - The value to validate
     * @param {ValidationArguments} args - The validation arguments
     * @returns {boolean} - True if the value is valid, false otherwise
     */
    validate(value: any, args: ValidationArguments): boolean {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = get(args.object, relatedPropertyName);

        return value === relatedValue;
    }

    /**
     * Get the default message
     * @param {ValidationArguments} args - The validation arguments to use
     * @returns {string} - The default message
     */
    defaultMessage(args: ValidationArguments): string {
        const [relatedPropertyName] = args.constraints;

        return `${relatedPropertyName} and ${args.property} do not match`;
    }
}

/**
 *
 * @param {string} property - The property to match
 * @param {ValidationOptions} validationOptions - The validation options
 * @returns {PropertyDecorator} - The property decorator
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
