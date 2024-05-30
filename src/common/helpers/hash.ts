import * as bcrypt from 'bcrypt';

const saltRounds = 10;

/**
 * @class BcryptService
 * @description Service for hashing and comparing passwords
 */
class BcryptService {
    private static instance: BcryptService;

    /**
     * @description Create an instance of the BcryptService
     */
    private constructor() {}

    /**
     * @description Get the instance of the BcryptService
     * @returns {BcryptService} - The instance of the BcryptService
     * @static
     */
    public static getInstance(): BcryptService {
        if (!BcryptService.instance) {
            BcryptService.instance = new BcryptService();
        }

        return BcryptService.instance;
    }

    /**
     * @description Hash a password
     * @param {string} password - The password to hash
     * @returns {string} - The hashed password
     */
    hash(password: string): string {
        return bcrypt.hashSync(password, saltRounds);
    }

    /**
     * @description Compare a password with a hash
     * @param {string} password - The password to compare
     * @param {string} hash - The hash to compare
     * @returns {boolean} - Whether the password and hash match
     */
    compare(password: string, hash: string): boolean {
        return bcrypt.compareSync(password, hash);
    }
}

export const BcryptServiceInstance = BcryptService.getInstance();
