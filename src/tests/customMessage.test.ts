/* eslint-disable no-unused-vars */
import {describe, expect, test} from '@jest/globals';
import { Schema } from '../Schema';
import _errors from '../utils/errors';

describe('Тестирование кастомного сообщения об ошибке', () => {
    test('Кастомные сообщения корректно отображаются в результате валидации', () => {
        const wrongTypeKey = 'wrongType'
        const missingKey = 'missingKey'
        const wrongRule1 = 'wrongRule1'
        const wrongRule2 = 'wrongRule2'
        const wrongRule3 = 'wrongRule3'

        const allKeys = [
            wrongTypeKey,
            missingKey,
            wrongRule1,
            wrongRule2,
            wrongRule3
        ]

        const getCustomMsg = (key: string, variation = '') => key + ' custom' + variation

        const schema = new Schema({
            [wrongTypeKey]: {
                type: Number,
                required: true,
                title: 'Не по типу',
                customMessage: (input) => {
                    return getCustomMsg(wrongTypeKey)
                }
            },
            [missingKey]: {
                type: Date,
                required: true,
                title: 'Отсутствующий',
                customMessage: (input) => {
                    return getCustomMsg(missingKey)
                }
            },
            [wrongRule1]: {
                type: String,
                required: true,
                title: 'Wrong Rule #1',
                rules: {
                    is: 'xxx'
                },
                customMessage: (input) => {
                    return getCustomMsg(wrongRule1)
                }
            },
            [wrongRule2]: {
                type: String,
                required: true,
                title: 'Wrong Rule #2',
                rules: {
                    lengthMin: 999
                },
                customMessage: (input) => {
                    return getCustomMsg(wrongRule2)
                }
            },
            [wrongRule3]: {
                type: String,
                required: true,
                title: 'Wrong Rule #3',
                rules: {
                    lengthMax: 1
                },
                customMessage: (input) => {
                    const {keyword, value, key, title, reqs, schema, rules} = input
        
                    if (keyword === 'lengthMax') {
                        return getCustomMsg(wrongRule3)
                    }
        
                    return wrongRule3 + ' should reach here'
                }
            },
        })
        
        const obj = {
            [wrongTypeKey]: 'abc',
            // missingKey: 'is missing :)',
            [wrongRule1]: 'def',
            [wrongRule2]: 'ghi',
            [wrongRule3]: 'jkl'
            
        }
        
        const result = schema.validate(obj)

        expect(result).toEqual({
            ok: false,
            missed: [missingKey],
            failed: [...allKeys],
            passed: [],
            errors: allKeys.map(el => getCustomMsg(el)),
            byKeys: {
              wrongType: false,
              missingKey: false,
              wrongRule1: false,
              wrongRule2: false,
              wrongRule3: false
            },
            errorsByKeys: {
              wrongType: [getCustomMsg(allKeys[0])],
              missingKey: [getCustomMsg(allKeys[1])],
              wrongRule1: [getCustomMsg(allKeys[2])],
              wrongRule2: [getCustomMsg(allKeys[3])],
              wrongRule3: [getCustomMsg(allKeys[4])],
            }
          })
    })
})
