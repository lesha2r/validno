import { describe, expect, test } from '@jest/globals';
import { Schema } from '../Schema';
import _errors from '../utils/errors';
describe('Тестирование обработки пропущенных свойста', () => {
    test('Отсутствующий ключ правильно отображается в результате', () => {
        const missedKey = 'testKey';
        const missedKey2 = 'testKey2';
        const okKey = 'okKey';
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
        });
        const obj = {
            [okKey]: 'string'
        };
        const result = scheme.validate(obj);
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
                [missedKey]: [_errors.getMissingError(missedKey)],
                [missedKey2]: [_errors.getMissingError(missedKey2)]
            }
        });
    });
    test('Присутствующий ключ правильно отображается в результате', () => {
        const key = 'testKey';
        const key2 = 'testKey2';
        const scheme = new Schema({
            [key]: {
                required: true,
                type: String
            },
            [key2]: {
                required: true,
                type: String
            }
        });
        const obj = {
            [key]: 'string',
            [key2]: 'string'
        };
        const result = scheme.validate(obj);
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
            errorsByKeys: {}
        });
    });
    test('Отсутствующий необязательный ключ правильно отображается в результах', () => {
        const key = 'testKey';
        const key2 = 'testKey2';
        const scheme = new Schema({
            [key]: {
                required: false,
                type: String
            },
            [key2]: {
                required: true,
                type: String
            }
        });
        const obj = {
            [key2]: 'string'
        };
        const result = scheme.validate(obj);
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
            errorsByKeys: {}
        });
    });
    test('Отсутствующие ключи в deep объекте корректно отображаются в результате', () => {
        const scheme = new Schema({
            parent: {
                childA: {
                    childA1: {
                        type: String,
                        required: true
                    },
                    childA2: {
                        type: String,
                        required: true
                    }
                },
                childB: {
                    type: String,
                    required: true
                }
            },
            parentBMissing: {
                type: String,
                required: true
            },
            keyOk: {
                type: String,
                required: true
            },
            notRequired: {
                type: String,
                required: false
            }
        });
        const obj = {
            parent: {
                childB: 'str'
            },
            keyOk: 'x'
        };
        const result = scheme.validate(obj);
        result.failed.sort();
        result.missed.sort();
        result.errors.sort();
        result.passed.sort();
        expect(result).toEqual({
            ok: false,
            failed: ['parent', 'parent.childA', 'parent.childA.childA1', 'parent.childA.childA2', 'parentBMissing'].sort(),
            missed: ['parent.childA.childA1', 'parent.childA.childA2', 'parentBMissing'].sort(),
            errors: [
                "Missing value for 'parent.childA.childA1'",
                "Missing value for 'parent.childA.childA2'",
                "Missing value for 'parentBMissing'",
            ].sort(),
            passed: ['parent.childB', 'keyOk', 'notRequired'].sort(),
            byKeys: {
                parent: false,
                'parent.childA': false,
                'parent.childA.childA1': false,
                'parent.childA.childA2': false,
                'parent.childB': true,
                parentBMissing: false,
                keyOk: true,
                notRequired: true
            },
            errorsByKeys: {
                'parent.childA.childA1': ["Missing value for 'parent.childA.childA1'"],
                'parent.childA.childA2': ["Missing value for 'parent.childA.childA2'"],
                parentBMissing: ["Missing value for 'parentBMissing'"]
            }
        });
    });
});
describe('Свойство required по умолчанию равно true', () => {
    test('Свойство required по умолчанию равно true', () => {
        const scheme = new Schema({
            testKey: {
                type: String
            }
        });
        const obj = {};
        const result = scheme.validate(obj);
        expect(result).toEqual({
            ok: false,
            failed: ['testKey'],
            missed: ['testKey'],
            errors: ["Missing value for 'testKey'"],
            passed: [],
            byKeys: {
                testKey: false
            },
            errorsByKeys: {
                testKey: ["Missing value for 'testKey'"]
            }
        });
    });
    test('Свойство required=true корректно обрабатывается', () => {
        const scheme = new Schema({
            testKey: {
                type: String,
                required: true
            }
        });
        const obj = {};
        const result = scheme.validate(obj);
        expect(result).toEqual({
            ok: false,
            failed: ['testKey'],
            missed: ['testKey'],
            errors: ["Missing value for 'testKey'"],
            passed: [],
            byKeys: {
                testKey: false
            },
            errorsByKeys: {
                testKey: ["Missing value for 'testKey'"]
            }
        });
    });
});
