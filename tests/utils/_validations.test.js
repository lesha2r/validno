import {describe, expect, test} from '@jest/globals';
import _validations from '../../dist/utils/validations.js';

class TypesAndValues {
    constructor() {
    }

   static list = {
        boolean: true,
        null: null,
        undefined:  undefined,
        string: 'string',
        number: 12345,
        array: ['a','b'],
        object: {key: 'value'},
        date: new Date(),
        regexp: new RegExp(/start.*end/),
        hex: '#fbec84',
    }

    static getValues = (types = []) => {
        let output = []

        for (const key of types) {
            if (key in this.list) output.push(this.list[key])
        }

        return output
    }

    static getValuesExcept = (except = []) => {
        const output = {
            ...this.list
        }
    
        except.forEach(key => delete output[key])
    
        return Object.values(output)
    }
}

const checkEveryValue = (values, func, expected = true) => {
    const results = {}

    for (const v of values) {
        const isChecked = func(v)
        
        results[v] = isChecked
    }

    return Object.values(results).every(e => e === expected)
}

describe('Тест _validations.isString', () => {
    test('Некорректные значения не проходят проверку', () => {
        const values = TypesAndValues.getValuesExcept(['string', 'hex'])
        const isEveryFalse = checkEveryValue(values, _validations.isString, false)

        expect(isEveryFalse).toBe(true)
    })

    test('Корректные значения проходят проверку', () => {
        const values = TypesAndValues.getValues(['string', 'hex'])
        const isEveryTrue = checkEveryValue(values, _validations.isString, true)

        expect(isEveryTrue).toBe(true)
    })
});

describe('Тест _validations.isNumber', () => {
    test('Некорректные значения не проходят проверку', () => {
        const values = TypesAndValues.getValuesExcept(['number'])
        const isEveryFalse = checkEveryValue(values, _validations.isNumber, false)

        expect(isEveryFalse).toBe(true)
    })

    test('Корректные значения проходят проверку', () => {
        const values = TypesAndValues.getValues(['number'])
        const isEveryTrue = checkEveryValue(values, _validations.isNumber, true)

        expect(isEveryTrue).toBe(true)
    })
});

describe('Тест _validations.isArray', () => {
    test('Некорректные значения не проходят проверку', () => {
        const values = TypesAndValues.getValuesExcept(['array'])
        const isEveryFalse = checkEveryValue(values, _validations.isArray, false)

        expect(isEveryFalse).toBe(true)
    })

    test('Корректные значения проходят проверку', () => {
        const values = TypesAndValues.getValues(['array'])
        const isEveryTrue = checkEveryValue(values, _validations.isArray, true)

        expect(isEveryTrue).toBe(true)
    })
});

describe('Тест _validations.isObject', () => {
    test('Некорректные значения не проходят проверку', () => {
        const values = TypesAndValues.getValuesExcept(['object'])
        const isEveryFalse = checkEveryValue(values, _validations.isObject, false)

        expect(isEveryFalse).toBe(true)
    })

    test('Корректные значения проходят проверку', () => {
        const values = TypesAndValues.getValues(['object'])
        const isEveryTrue = checkEveryValue(values, _validations.isObject, true)

        expect(isEveryTrue).toBe(true)
    })
});

describe('Тест _validations.isDate', () => {
    test('Некорректные значения не проходят проверку', () => {
        const values = TypesAndValues.getValuesExcept(['date'])
        const isEveryFalse = checkEveryValue(values, _validations.isDate, false)

        expect(isEveryFalse).toBe(true)
    })

    test('Корректные значения проходят проверку', () => {
        const values = TypesAndValues.getValues(['date'])
        const isEveryTrue = checkEveryValue(values, _validations.isDate, true)

        expect(isEveryTrue).toBe(true)
    })
});

describe('Тест _validations.isRegex', () => {
    test('Некорректные значения не проходят проверку', () => {
        const values = TypesAndValues.getValuesExcept(['regexp'])
        const isEveryFalse = checkEveryValue(values, _validations.isRegex, false)

        expect(isEveryFalse).toBe(true)
    })

    test('Корректные значения проходят проверку', () => {
        const values = TypesAndValues.getValues(['regexp'])
        const isEveryTrue = checkEveryValue(values, _validations.isRegex, true)

        expect(isEveryTrue).toBe(true)
    })
});

describe('Тест _validations.isBoolean', () => {
    test('Некорректные значения не проходят проверку', () => {
        const values = TypesAndValues.getValuesExcept(['boolean'])
        const isEveryFalse = checkEveryValue(values, _validations.isBoolean, false)

        expect(isEveryFalse).toBe(true)
    })

    test('Корректные значения проходят проверку', () => {
        const values = TypesAndValues.getValues(['boolean'])
        const isEveryTrue = checkEveryValue(values, _validations.isBoolean, true)

        expect(isEveryTrue).toBe(true)
    })
});

describe('Тест _validations.isNull', () => {
    test('Некорректные значения не проходят проверку', () => {
        const values = TypesAndValues.getValuesExcept(['null'])
        const isEveryFalse = checkEveryValue(values, _validations.isNull, false)

        expect(isEveryFalse).toBe(true)
    })

    test('Корректные значения проходят проверку', () => {
        const values = TypesAndValues.getValues(['null'])
        const isEveryTrue = checkEveryValue(values, _validations.isNull, true)

        expect(isEveryTrue).toBe(true)
    })
});

describe('Тест _validations.isUndefined', () => {
    test('Некорректные значения не проходят проверку', () => {
        const values = TypesAndValues.getValuesExcept(['undefined'])
        const isEveryFalse = checkEveryValue(values, _validations.isUndefined, false)

        expect(isEveryFalse).toBe(true)
    })

    test('Корректные значения проходят проверку', () => {
        const values = TypesAndValues.getValues(['undefined'])
        const isEveryTrue = checkEveryValue(values, _validations.isUndefined, true)

        expect(isEveryTrue).toBe(true)
    })
});

describe('Тест _validations.isNullOrUndefined', () => {
    test('Некорректные значения не проходят проверку', () => {
        const values = TypesAndValues.getValuesExcept(['undefined', 'null'])
        const isEveryFalse = checkEveryValue(values, _validations.isNullOrUndefined, false)

        expect(isEveryFalse).toBe(true)
    })

    test('Корректные значения проходят проверку', () => {
        const values = TypesAndValues.getValues(['undefined', 'null'])
        const isEveryTrue = checkEveryValue(values, _validations.isNullOrUndefined, true)

        expect(isEveryTrue).toBe(true)
    })
});

describe('Тест _validations.isEmail', () => {
    test('Некорректные значения не проходят проверку', () => {
        const values = TypesAndValues.getValuesExcept([])
        const isEveryFalse = checkEveryValue(values, _validations.isEmail, false)

        expect(isEveryFalse).toBe(true)
    })

    test('Корректные значения проходят проверку', () => {
        const values = ['name@email.com']
        const isEveryTrue = checkEveryValue(values, _validations.isEmail, true)

        expect(isEveryTrue).toBe(true)
    })
});

describe('Тест _validations.isDateYYYYMMDD', () => {
    test('Некорректные базовые значения не проходят проверку', () => {
        const values = TypesAndValues.getValuesExcept([])
        const isEveryFalse = checkEveryValue(values, _validations.isDateYYYYMMDD, false)

        expect(isEveryFalse).toBe(true)
    })

    test('Некорректные значения строк с датами не проходят проверку', () => {
        const values = [
            '2024-1-05',
            '2024-01-5',
            '2024-1-5',
            '01-01-2025',
            '20250101',
            '202-01-1'
        ]

        const isEveryFalse = checkEveryValue(values, _validations.isDateYYYYMMDD, false)

        expect(isEveryFalse).toBe(true)
    })

    test('Корректные значения проходят проверку', () => {
        const values = ['2025-01-24']
        const isEveryTrue = checkEveryValue(values, _validations.isDateYYYYMMDD, true)

        expect(isEveryTrue).toBe(true)
    })
});

describe('Тест _validations.isHex', () => {
    test('Некорректные базовые значения не проходят проверку', () => {
        const values = TypesAndValues.getValuesExcept(['hex'])
        const isEveryFalse = checkEveryValue(values, _validations.isHex, false)

        expect(isEveryFalse).toBe(true)
    })

    test('Некорректные значения строк с датами не проходят проверку', () => {
        const values = [
            '№fbec84',
            'fbec84'
        ]

        const isEveryFalse = checkEveryValue(values, _validations.isHex, false)

        expect(isEveryFalse).toBe(true)
    })

    test('Корректные значения проходят проверку', () => {
        const values = ['#fbec84', '#000']
        const isEveryTrue = checkEveryValue(values, _validations.isHex, true)

        expect(isEveryTrue).toBe(true)
    })
});

describe('Тест _validations.lengthIs', () => {
    test('Отсутствие аргументов вызывает ответ false', () => {
        const res1 = _validations.lengthIs('x')
        const res2 = _validations.lengthIs()

        expect(res1).toBe(false)
        expect(res2).toBe(false)
    })

    test('Некорректные базовые значения не проходят проверку', () => {
        const values = [
            'a', 'b2', 'c3', 'd4', 'e5',
            null,
            ...TypesAndValues.getValuesExcept(['string'])
        ]

        const isEveryFalse = checkEveryValue(values, (v) => _validations.lengthIs(v, 10), false)

        expect(isEveryFalse).toBe(true)
    })

    test('Корректные значения проходят проверку', () => {
        const values = ['abc']
        const isEveryTrue = checkEveryValue(values, (v) => _validations.lengthIs(v, 3), true)

        expect(isEveryTrue).toBe(true)
    })
});

describe('Тест _validations.lengthNot', () => {
    test('Отсутствие аргументов вызывает ответ false', () => {
        const res1 = _validations.lengthNot('x')
        const res2 = _validations.lengthNot()

        expect(res1).toBe(false)
        expect(res2).toBe(false)
    })

    test('Некорректные базовые значения не проходят проверку', () => {
        const values = [
            'a1', 'b2',
            ['1', '2']
        ]

        const isEveryFalse = checkEveryValue(values, (v) => _validations.lengthNot(v, 2), false)

        expect(isEveryFalse).toBe(true)
    })

    test('Корректные значения проходят проверку', () => {
        const values = [
            'abcdabc',
            'abcdabcdz',
            ['1', '2', '3', '4', '5', '6', '7'],
            ['1', '2', '3', '4', '5', '6', '7', '9']
        ]
        const isEveryTrue = checkEveryValue(values, (v) => _validations.lengthNot(v, 2), true)

        expect(isEveryTrue).toBe(true)
    })
});

describe('Тест _validations.lengthMin', () => {
    test('Отсутствие аргументов вызывает ответ false', () => {
        const res1 = _validations.lengthMin('x')
        const res2 = _validations.lengthMin()

        expect(res1).toBe(false)
        expect(res2).toBe(false)
    })

    test('Некорректные базовые значения не проходят проверку', () => {
        const values = [
            '12',
            ['a', 'b']
        ]

        const isEveryFalse = checkEveryValue(values, (v) => _validations.lengthMin(v, 3), false)

        expect(isEveryFalse).toBe(true)
    })

    test('Корректные значения проходят проверку', () => {
        const values = [
            '123',
            '1234',
            ['1', '2', '3'],
            ['1', '2', '3', '4']
        ]
        const isEveryTrue = checkEveryValue(values, (v) => _validations.lengthMin(v, 3), true)

        expect(isEveryTrue).toBe(true)
    })
});

describe('Тест _validations.lengthMax', () => {
    test('Отсутствие аргументов вызывает ответ false', () => {
        const res1 = _validations.lengthMax('x')
        const res2 = _validations.lengthMax()

        expect(res1).toBe(false)
        expect(res2).toBe(false)
    })

    test('Некорректные базовые значения не проходят проверку', () => {
        const values = [
            '123',
            ['a', 'b', 'c']
        ]

        const isEveryFalse = checkEveryValue(values, (v) => _validations.lengthMax(v, 2), false)

        expect(isEveryFalse).toBe(true)
        
    })

    test('Корректные значения проходят проверку', () => {
        const values = [
            '123',
            '12',
            ['1', '2', '3'],
            ['1', '2']
        ]
        const isEveryTrue = checkEveryValue(values, (v) => _validations.lengthMax(v, 3), true)

        expect(isEveryTrue).toBe(true)
    })
});

describe('Тест _validations.isNumberGte', () => {
    test('Отсутствие аргументов вызывает ответ false', () => {
        const res1 = _validations.isNumberGte(1)
        const res2 = _validations.isNumberGte()

        expect(res1).toBe(false)
        expect(res2).toBe(false)
    })

    test('Некорректные базовые значения не проходят проверку', () => {
        const values = [
            1,
            2,
            3
        ]

        const isEveryFalse = checkEveryValue(values, (v) => _validations.isNumberGte(v, 4), false)

        expect(isEveryFalse).toBe(true)
        
    })

    test('Корректные значения проходят проверку', () => {
        const values = [
            4,
            5,
            6
        ]
        const isEveryTrue = checkEveryValue(values, (v) => _validations.isNumberGte(v, 4), true)

        expect(isEveryTrue).toBe(true)
    })
});

describe('Тест _validations.isNumberLte', () => {
    test('Отсутствие аргументов вызывает ответ false', () => {
        const res1 = _validations.isNumberLte(1)
        const res2 = _validations.isNumberLte()

        expect(res1).toBe(false)
        expect(res2).toBe(false)
    })

    test('Некорректные базовые значения не проходят проверку', () => {
        const values = [
            4,
            5,
            6
        ]

        const isEveryFalse = checkEveryValue(values, (v) => _validations.isNumberLte(v, 3), false)

        expect(isEveryFalse).toBe(true)
        
    })

    test('Корректные значения проходят проверку', () => {
        const values = [
            1,
            2,
            3
        ]
        const isEveryTrue = checkEveryValue(values, (v) => _validations.isNumberLte(v, 3), true)

        expect(isEveryTrue).toBe(true)
    })
});

describe('Тест _validations.hasKey', () => {
    const testKey = 'xyz'

    test('Отсутствие аргументов вызывает ответ false', () => {
        const res1 = _validations.hasKey({})
        const res2 = _validations.hasKey()

        expect(res1).toBe(false)
        expect(res2).toBe(false)
    })

    test('Некорректные базовые значения не проходят проверку', () => {
        const values = [
            {x: 1},
            {y: 2},
            {z: 3}
        ]

        const isEveryFalse = checkEveryValue(
            values,
            (v) => _validations.hasKey(v, testKey),
            false
        )

        expect(isEveryFalse).toBe(true)
        
    })

    test('Корректные значения проходят проверку', () => {
        const values = [
            {xyz: 1, y: 2, z: 3},
            {xyz: 1, a: 2, b: 3},
            {xyz: 1, xx: 2, xxx: 3}
        ]

        const isEveryTrue = checkEveryValue(
            values,
            (v) => _validations.hasKey(v, testKey),
            true
        )

        expect(isEveryTrue).toBe(true)
    })
});

describe('Тест _validations.is', () => {
    test('Отсутствие аргументов вызывает корректный ответ', () => {
        expect(_validations.is('a')).toBe(false)
        expect(_validations.is()).toBe(true)
    })

    test('Несовпадающие значения возвращает false при проверке', () => {
        const results = []

        const toBeChecked = [
            ['string', 'string2'],
            ['string', 1],
            [1, 'string'],
            [[0], {x: 1}],
            [null, true],
            [true, null],
            [true, false],
            [[0], [1]],
        ]

        toBeChecked.forEach(arr => {
            results.push(_validations.is(arr[0], arr[1]))
        })

        const isEveryTrue = Object.values(results).every(v => v === false)

        expect(isEveryTrue).toBe(true)
    })

    test('Совпадающие значения возвращают true при проверке', () => {
        const dateA = new Date(2025, 0, 1, 0, 0, 0, 0)
        const dateB = new Date(2025, 0, 1, 0, 0, 0, 0)

        const toBeChecked = {
            boolean: [true, true],
            null: [null, null],
            string: ['string', 'string'],
            number: [1, 1],
            array1: [[1,2], [1,2]],
            array2: [['a'], ['a']],
            obj: [{x: 1, z: 2}, {x: 1, z: 2}],
            dates: [dateA, dateB]            
        }

        const results = {}

        for (const [key, values] of Object.entries(toBeChecked)) {
            results[key] = _validations.is(values[0], values[1])
        }

        expect(results.boolean).toBe(true)
        expect(results.null).toBe(true)
        expect(results.string).toBe(true)
        expect(results.number).toBe(true)
        expect(results.array1).toBe(true)
        expect(results.array2).toBe(true)
        expect(results.obj).toBe(true)
        expect(results.dates).toBe(true)
    })
});

describe('Тест _validations.not', () => {
    test('Отсутствие аргументов вызывает корректный ответ', () => {
        expect(_validations.not('a')).toBe(true)
        expect(_validations.not()).toBe(false)
    })

    test('Несовпадающие значения возвращает true при проверке', () => {
        const results = []

        const toBeChecked = [
            ['string', 'string2'],
            ['string', 1],
            [1, 'string'],
            [[0], {x: 1}],
            [null, true],
            [true, null],
            [true, false],
            [[0], [1]],
        ]

        toBeChecked.forEach(arr => {
            results.push(_validations.not(arr[0], arr[1]))
        })

        const isEveryTrue = Object.values(results).every(v => v === true)

        expect(isEveryTrue).toBe(true)
    })

    test('Совпадающие значения возвращают false при проверке', () => {
        const dateA = new Date(2025, 0, 1, 0, 0, 0, 0)
        const dateB = new Date(2025, 0, 1, 0, 0, 0, 0)

        const toBeChecked = {
            boolean: [true, true],
            null: [null, null],
            string: ['string', 'string'],
            number: [1, 1],
            array1: [[1,2], [1,2]],
            array2: [['a'], ['a']],
            obj: [{x: 1, z: 2}, {x: 1, z: 2}],
            dates: [dateA, dateB]            
        }

        const results = {}

        for (const [key, values] of Object.entries(toBeChecked)) {
            results[key] = _validations.not(values[0], values[1])
        }

        expect(results.boolean).toBe(false)
        expect(results.null).toBe(false)
        expect(results.string).toBe(false)
        expect(results.number).toBe(false)
        expect(results.array1).toBe(false)
        expect(results.array2).toBe(false)
        expect(results.obj).toBe(false)
        expect(results.dates).toBe(false)
    })

    test('Тест алиасов', () => {
        expect(_validations.not === _validations.isNot).toBe(true)
    })
});

describe('Тест _validations.regexp', () => {
    test('Отсутствие аргументов вызывает корректный ответ', () => {
        expect(() => _validations.regexp('a')).toThrow()
        expect(() => _validations.regexp()).toThrow()
    })

    test('Несовпадающие значения возвращает false при проверке', () => {
        const results = []

        const toBeChecked = [
            ['string', /^xxstr.*/],
            ['string', /string2/],
            ['1', /2/],
        ]

        toBeChecked.forEach(arr => {
            results.push(_validations.regexp(arr[0], arr[1]))
        })

        const isEveryTrue = Object.values(results).every(v => v === false)
        expect(isEveryTrue).toBe(true)
    })

    test('Совпадающие значения возвращают true при проверке', () => {
        const results = []

        const toBeChecked = [
            ['string', /^str.*/],
            ['string', /string/],
            ['1', /1/],
            ['name@mail.com', /^[^\s@]+@[^\s@]+\.[^\s@]+$/],
        ]

        toBeChecked.forEach(arr => {
            results.push(_validations.regexp(arr[0], arr[1]))
        })

        const isEveryTrue = Object.values(results).every(v => v === true)
        expect(isEveryTrue).toBe(true)
    })

    test('Тест алиасов', () => {
        expect(_validations.regexp === _validations.regexTested).toBe(true)
        expect(_validations.regex === _validations.regexTested).toBe(true)
        expect(_validations.test === _validations.regexTested).toBe(true)
    })
});