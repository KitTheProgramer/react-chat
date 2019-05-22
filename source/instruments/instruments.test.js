import { sum, delay, getUniqueID, getFullApiUrl } from './';

describe('helper:', () => {
    test('sum function should be a function', () => {
        expect(sum).toBeInstanceOf(Function);
    });

    test('should throw if call with non number', () => {
        expect(() => sum('hi', 'no')).toThrow();
    });

    test('result should be of 3', () => {
        expect(sum(1, 2)).toBe(3);
        expect(sum(2, 2)).toBe(4);
    });

    test('delay function should return a resolved promise', async() => {
        await expect(delay(10)).resolves.toBe('success');
    });

    test('should throw if not number argument', () => {
        expect(() => getUniqueID('3')).toThrow();
    });

    test('should throw if not string argument', () => {
        expect(() => getFullApiUrl(1, 3)).toThrow();
    });

    test('should get two unique strings', () => {
        const expected = getUniqueID();

        expect(getUniqueID()).toEqual(expect.not.stringMatching(expected));
    });

    test('should get correct URL', () => {
        const api = 'someApi';
        const groupId = 'someId';

        expect(getFullApiUrl(api, groupId)).toBe(`${api}/${groupId}`);
    });
});
