import { omit } from 'lodash';

/**
 * Loại bỏ các khóa không được chấp nhận từ một đối tượng.
 * @template T - Kiểu của đối tượng
 * @param {T} obj - The object to remove the keys
 * @param {string[]} keys - The keys to remove
 * @returns {T} - The object with the keys removed
 */
export const removeKeyNotAccepted = <T extends object>(obj: T, keys: string[]): T => {
    // Sử dụng lodash `omit` để loại bỏ các khóa không được chấp nhận
    return omit(obj, keys) as T;
};
