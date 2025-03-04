import {describe, expect, test} from '@jest/globals';
import { Schema } from '../dist/Schema.js';

describe('Проверка каждого типа по отдельности', () => {
    test('Тест String', () => {
        const key = 'testKey'
        const scheme = new Schema({
            [key]: {
                required: true,
                type: String
            }
        })
        const objOK = {
            [key]: 'string'
        }

        const resOK = scheme.validate(objOK)
        
        expect(resOK.ok).toBe(true)
        expect(resOK.passed.includes(key)).toBe(true)
        expect(resOK.byKeys[key]).toBe(true)

        const objBad = {
            [key]: 1
        }

        const resBad = scheme.validate(objBad)
        expect(resBad.ok).toBe(false)
        expect(resBad.failed.includes(key)).toBe(true)
        expect(resBad.passed.includes(key)).toBe(false)
        expect(resBad.byKeys[key]).toBe(false)
    })

    test('Тест Number', () => {
        const key = 'testKey'
        const scheme = new Schema({
            [key]: {
                required: true,
                type: Number
            }
        })
        const objOK = {
            [key]: 111
        }

        const resOK = scheme.validate(objOK)
        
        expect(resOK.ok).toBe(true)
        expect(resOK.passed.includes(key)).toBe(true)
        expect(resOK.byKeys[key]).toBe(true)

        const objBad = {
            [key]: 'string'
        }

        const resBad = scheme.validate(objBad)
        expect(resBad.ok).toBe(false)
        expect(resBad.failed.includes(key)).toBe(true)
        expect(resBad.passed.includes(key)).toBe(false)
        expect(resBad.byKeys[key]).toBe(false)
    })

    test('Тест Boolean', () => {
        const key = 'testKey'
        const scheme = new Schema({
            [key]: {
                required: true,
                type: Boolean
            }
        })
        const objOK = {
            [key]: true
        }

        const resOK = scheme.validate(objOK)
        
        expect(resOK.ok).toBe(true)
        expect(resOK.passed.includes(key)).toBe(true)
        expect(resOK.byKeys[key]).toBe(true)

        const objBad = {
            [key]: 'false'
        }

        const resBad = scheme.validate(objBad)
        expect(resBad.ok).toBe(false)
        expect(resBad.failed.includes(key)).toBe(true)
        expect(resBad.passed.includes(key)).toBe(false)
        expect(resBad.byKeys[key]).toBe(false)
    })

    test('Тест Array', () => {
        const key = 'testKey'
        const scheme = new Schema({
            [key]: {
                required: true,
                type: Array
            }
        })
        const objOK = {
            [key]: []
        }

        const objOK2 = {
            [key]: [1,2,3]
        }

        const resOK = scheme.validate(objOK)
        expect(resOK.ok).toBe(true)
        expect(resOK.passed.includes(key)).toBe(true)
        expect(resOK.byKeys[key]).toBe(true)

        const resOK2 = scheme.validate(objOK2)
        expect(resOK2.ok).toBe(true)
        expect(resOK2.passed.includes(key)).toBe(true)
        expect(resOK2.byKeys[key]).toBe(true)

        const objBad = {
            [key]: 'not array'
        }

        const resBad = scheme.validate(objBad)
        expect(resBad.ok).toBe(false)
        expect(resBad.failed.includes(key)).toBe(true)
        expect(resBad.passed.includes(key)).toBe(false)
        expect(resBad.byKeys[key]).toBe(false)
    })

    test('Тест null', () => {
        const key = 'testKey'
        const scheme = new Schema({
            [key]: {
                required: true,
                type: null
            }
        })
        const objOK = {
            [key]: null
        }

        const resOK = scheme.validate(objOK)
        expect(resOK.ok).toBe(true)
        expect(resOK.passed.includes(key)).toBe(true)
        expect(resOK.byKeys[key]).toBe(true)

        const objBad = {
            [key]: 'not null'
        }

        const resBad = scheme.validate(objBad)
        expect(resBad.ok).toBe(false)
        expect(resBad.failed.includes(key)).toBe(true)
        expect(resBad.passed.includes(key)).toBe(false)
        expect(resBad.byKeys[key]).toBe(false)
    })

    test('Тест Date', () => {
        const key = 'testKey'
        const scheme = new Schema({
            [key]: {
                required: true,
                type: Date
            }
        })
        const objOK = {
            [key]: new Date()
        }

        const resOK = scheme.validate(objOK)
        expect(resOK.ok).toBe(true)
        expect(resOK.passed.includes(key)).toBe(true)
        expect(resOK.byKeys[key]).toBe(true)

        const objBad = {
            [key]: 'not date'
        }

        const resBad = scheme.validate(objBad)
        expect(resBad.ok).toBe(false)
        expect(resBad.failed.includes(key)).toBe(true)
        expect(resBad.passed.includes(key)).toBe(false)
        expect(resBad.byKeys[key]).toBe(false)
    })

    test('Тест Object', () => {
        const key = 'testKey'
        const scheme = new Schema({
            [key]: {
                required: true,
                type: Object
            }
        })
        const objOK = {
            [key]: { test: 1}
        }
        
        const resOK = scheme.validate(objOK)

        expect(resOK.ok).toBe(true)
        expect(resOK.passed.includes(key)).toBe(true)
        expect(resOK.byKeys[key]).toBe(true)

        const objBad = {
            [key]: 'not obj'
        }

        const resBad = scheme.validate(objBad)
        expect(resBad.ok).toBe(false)
        expect(resBad.failed.includes(key)).toBe(true)
        expect(resBad.passed.includes(key)).toBe(false)
        expect(resBad.byKeys[key]).toBe(false)
    })
})

describe("Проверка всех типов сразу", () => {
    test('Тест всех типов с корректными данными', () => {
        const schema = new Schema({
            str: {
                type: String,
            },
            obj: {
                type: Object,
            },
            num: {
                type: Number,
            },
            arr: {
                type: Array,
            },
            null: {
                type: null,
            },
            bool: {
                type: Boolean,
            },
            date: {
                type: Date
            }
        })

        const obj = {
            str: 'String',
            obj: {},
            num: 1,
            arr: [1,2,3],
            null: null,
            bool: true,
            date: new Date()
        }

        const res = schema.validate(obj)

        const arePassed = []
        for (const key in obj) {
            arePassed.push(res.byKeys[key])
        }

        expect(res.ok).toBe(true)
        expect(arePassed.every(el => el === true)).toBe(true)
        expect(res.errors.length).toBe(0)
    })

    test('Тест всех типов с некорректными данными', () => {
        const schema = new Schema({
            str: {
                type: String,
            },
            obj: {
                type: Object,
            },
            num: {
                type: Number,
            },
            arr: {
                type: Array,
            },
            null: {
                type: null,
            },
            bool: {
                type: Boolean,
            },
            date: {
                type: Date
            },
            test: {
                type: Object,
                required: true
            }
        })

        const obj = {
            str: 123,
            obj: [],
            num: 'str',
            arr: null,
            null: {},
            bool: new Date(),
            date: true,
            test: undefined
        }

        const res = schema.validate(obj)
        expect(res.ok).toBe(false)

        const areFailed = []
        const hasErrorMsg = []

        for (const key in obj) {
            areFailed.push(res.byKeys[key])
            hasErrorMsg.push(key in res.errorsByKeys)
        }

        expect(areFailed.every(el => el === false)).toBe(true)
        expect(hasErrorMsg.every(el => el === true)).toBe(true)
        expect(res.errors.length).toBe(Object.keys(obj).length)
    })
})