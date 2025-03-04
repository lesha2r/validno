import {describe, expect, test} from '@jest/globals';
import { Schema } from '../dist/Schema.js';

describe('Параметр onlyKeys возвращает корректный результат валидации объекта', () => {
    const schema = new Schema({
        str: {
            type: String,
            required: true,
        },
        numb: {
            type: Number,
            required: true
        },
        obj: {
            deep1: {
                type: Boolean,
                required: true
            },
            deep2: {
                type: Boolean,
                required: false
            }
        }
    })
    test('Проверяются все ключи, если !onlyKeys', () => {
        const obj = {
            str: 'string',
            numb: 1,
            obj: {
                deep1: true,
                deep2: true
            }
        }

        const result = schema.validate(obj)
        expect(result.ok).toBe(true)
        expect(result.passed.length).toBe(5)
    })

    test('Проверяются только необходимые ключи, если представлен onlyKeys (string)', () => {
        const obj = {
            str: 'string',
            numb: 1,
            obj: {
                deep1: true,
                deep2: true
            }
        }

        const keyToCheck = 'str'

        const result = schema.validate(obj, keyToCheck)

        expect(result.ok).toBe(true)
        expect(result.passed.length).toBe(1)
        expect(result.passed.includes(keyToCheck)).toBe(true)

        expect(result.missed.length).toBe(0)
        expect(result.failed.length).toBe(0)
        expect(result.errors.length).toBe(0)
    })

    test('Проверяются только необходимые ключи, если представлен onlyKeys (string[])', () => {
        const obj = {
            str: 'string',
            numb: 1,
            obj: {
                deep1: true,
                deep2: true
            }
        }

        const keyToCheck = ['str', 'obj']

        const result = schema.validate(obj, keyToCheck)

        expect(result.ok).toBe(true)
        expect(result.passed.length).toBe(4)
        expect(result.passed.includes(keyToCheck[0])).toBe(true)
        expect(result.passed.includes(keyToCheck[1])).toBe(true)

        expect(result.missed.length).toBe(0)
        expect(result.failed.length).toBe(0)
        expect(result.errors.length).toBe(0)
    })
})