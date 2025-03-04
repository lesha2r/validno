import {expect, test} from '@jest/globals';
import _errors from '../../dist/utils/errors.js';

test('Тест _errors.getMissingError', () => {
    const key = 'testKey'
    const emptyKey = _errors.getMissingError()
    const okKey = _errors.getMissingError(key)

    expect(emptyKey).toBe(`Отсутствует значение 'na'`)
    expect(okKey).toBe(`Отсутствует значение '${key}'`)
});

test('Тест _errors.joinErrors', () => {
    const defaultSeparator = '; '
    const customSeparator = '||'

    const emptyErrorMsg = _errors.joinErrors()
    const oneErrorMsg = _errors.joinErrors(['X'])
    const multipleErrorMsg = _errors.joinErrors(['X', 'Y', 'Z'])
    const customSeparatorErrorMsg = _errors.joinErrors(['X', 'Y', 'Z'], customSeparator)

    expect(emptyErrorMsg).toBe('')
    expect(oneErrorMsg).toBe('X')
    expect(multipleErrorMsg).toBe('X' + defaultSeparator + 'Y' + defaultSeparator + 'Z')
    expect(customSeparatorErrorMsg).toBe('X' + customSeparator + 'Y' + customSeparator + 'Z')
});

test('Тест _errors.getErrorDetails', () => {
    class CustomTest {
        test() {
            return true
        }
    }

    const customObj = new CustomTest()

    const key = 'key'
    const errorNull = _errors.getErrorDetails(key, String, null)
    const errorUndefined = _errors.getErrorDetails(key, Array, undefined)
    const errorObject = _errors.getErrorDetails(key, Object, [])
    const errorBoolean = _errors.getErrorDetails(key, Boolean, 190)
    const errorCustom = _errors.getErrorDetails(key, Object, customObj)
    const errorUnknown = _errors.getErrorDetails(key, Number)

    const okCustom = _errors.getErrorDetails(key, CustomTest, customObj)

    const getError = (key, expected, recieved) => {
        return `Проверьте тип '${key}': ожидался ${expected}, получен ${recieved}`
    }

    expect(errorNull).toBe(getError(key, 'String', 'null'))
    expect(errorUndefined).toBe(getError(key, 'Array', 'undefined'))
    expect(errorObject).toBe(getError(key, 'Object', 'Array'))
    expect(errorBoolean).toBe(getError(key, 'Boolean', 'Number'))
    expect(errorCustom).toBe(getError(key, 'Object', 'CustomTest'))
    expect(errorUnknown).toBe(getError(key, 'Number', 'undefined'))
    expect(okCustom).toBe('')
    
});