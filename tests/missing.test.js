import {describe, expect, test} from '@jest/globals';
import { Schema } from '../dist/Schema.js';
import _errors from '../dist/utils/errors.js';

describe('Тестирование обработки пропущенных свойста', () => {
    test('Отсутствующий ключ правильно отображается в результате', () => {
        const missedKey = 'testKey'
        const missedKey2 = 'testKey2'

        const okKey = 'okKey'

        const scheme = new Schema({
            [missedKey]: {
                required: true,
                type: String
            },
            [missedKey2]: {
                required: true,
                type: String
            },
            [okKey]: {
                required: true,
                type: String
            }
        })

        const obj = {
            [okKey]: 'string'
        }

        const result = scheme.validate(obj)

        expect(result).toEqual({
            ok: false,
            failed: [missedKey, missedKey2],
            missed: [missedKey, missedKey2],
            errors: [
                _errors.getMissingError(missedKey),
                _errors.getMissingError(missedKey2)
            ],
            passed: [okKey],
            byKeys: {
                [missedKey]: false,
                [missedKey2]: false,
                [okKey]: true
            },
            errorsByKeys: {
                [okKey]: [],
                [missedKey]: [_errors.getMissingError(missedKey)],
                [missedKey2]: [_errors.getMissingError(missedKey2)]
            }
        })
    })

    test('Присутствующий ключ правильно отображается в результате', () => {
        const key = 'testKey'
        const key2 = 'testKey2'

        const scheme = new Schema({
            [key]: {
                required: true,
                type: String
            },
            [key2]: {
                required: true,
                type: String
            }
        })

        const obj = {
            [key]: 'string',
            [key2]: 'string'
        }

        const result = scheme.validate(obj)
        
        expect(result).toEqual({
            ok: true,
            failed: [],
            missed: [],
            errors: [],
            passed: [key, key2],
            byKeys: {
                [key]: true,
                [key2]: true
            },
            errorsByKeys: {
                [key]: [],
                [key2]: []
            }
        })
    })

    test('Отсутствующий необязательный ключ правильно отображается в результах', () => {
        const key = 'testKey'
        const key2 = 'testKey2'

        const scheme = new Schema({
            [key]: {
                required: false,
                type: String
            },
            [key2]: {
                required: true,
                type: String
            }
        })

        const obj = {
            [key2]: 'string'
        }

        const result = scheme.validate(obj)
        
        expect(result).toEqual({
            ok: true,
            failed: [],
            missed: [],
            errors: [],
            passed: [key, key2],
            byKeys: {
                [key]: true,
                [key2]: true
            },
            errorsByKeys: {
                [key]: [],
                [key2]: []
            }
        })
    })
})