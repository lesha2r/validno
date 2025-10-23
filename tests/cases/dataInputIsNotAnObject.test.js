/* eslint-disable no-unused-vars */
import {describe, expect, test} from '@jest/globals';
import { Schema } from '../../dist/Schema.js';

describe('Data input is not an object → returns failed validation result', () => {
    const schema = new Schema({
        name: {
            type: String
        }
    })

    test('null input fails validation but not throws', () => {
        const result = schema.validate(null)
        expect(result).toBeDefined()
        expect(result.ok).toBe(false)
    })

    test('array input fails validation but not throws', () => {
        const result = schema.validate([])
        expect(result).toBeDefined()
        expect(result.ok).toBe(false)
    })

    test('undefined input fails validation but not throws', () => {
        const result = schema.validate(undefined)
        expect(result).toBeDefined()
        expect(result.ok).toBe(false)
    })
})