import { describe, expect, test } from '@jest/globals';
import { Schema } from '../Schema';
describe('Тестирование функции joinErrors', () => {
    const keys = ['ops1', 'ops2', 'miss'];
    const schema = new Schema({
        [keys[0]]: {
            type: Number,
            required: true,
            title: 'titl',
        },
        [keys[1]]: {
            type: String,
            required: true,
            title: 'titl',
        },
        [keys[2]]: {
            type: String,
            required: true,
            title: 'titl',
        }
    });
    const schema2 = new Schema({});
    test('Пустая строка при отсутствии ошибок', () => {
        const objOk = {
            [keys[0]]: 222,
            [keys[1]]: 'str',
            [keys[2]]: 'here'
        };
        const res = schema.validate(objOk);
        expect(res.ok).toBe(true);
        expect(res.joinErrors()).toBe("");
    });
    test('Пустая строка при отсутствии ошибок и пустой схеме', () => {
        const objOk = {
            [keys[0]]: 222,
            [keys[1]]: 'str',
            [keys[2]]: 'here'
        };
        const res = schema2.validate(objOk);
        expect(res.ok).toBe(true);
        expect(res.joinErrors()).toBe("");
    });
    test('Корректная строка при наличии ошибок', () => {
        const unexpectedKey = 'unexpectedKey';
        const objOk = {
            [keys[0]]: '222',
            [keys[1]]: 1,
            [unexpectedKey]: 'not supposed to be here)'
        };
        const res = schema.validate(objOk);
        const errorsStr = res.joinErrors();
        const stringHasAllKeys = [
            errorsStr.includes(keys[0]),
            errorsStr.includes(keys[1]),
            errorsStr.includes(keys[2]),
            !errorsStr.includes(unexpectedKey)
        ].every(k => k === true);
        expect(res.ok).toBe(false);
        expect(errorsStr.length).toBeGreaterThan(5);
        expect(stringHasAllKeys).toBe(true);
    });
});
