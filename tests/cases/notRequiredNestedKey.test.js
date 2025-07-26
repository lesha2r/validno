/* eslint-disable no-unused-vars */
import {describe, expect, test} from '@jest/globals';
import { Schema } from '../../dist/Schema.js';

// [Case]
// Not required nested key
//
// [Title]
// Scheme with a nested key that is not required
//
// [Description]
// The parent key should not fail validation if the nested key is not provided until it is required.
// 
// [Examples]
// 
// [1] Should pass if the nested key is not required
// Both 'params' and 'params.upsert' SHOULD PASS:
// 
// const schema = new Schema({
//     query: { type: Object },
//     data: { type: Object },
//     params: {
//         upsert: { type: Boolean, required: false },
//     }
// })
// 
// schema.validate({
//    query: {},
//    data: {}
// })
// 
// [2] Both 'params' and 'params.upsert' SHOULD NOT PASS 
//  The following scheme should fail because 'params.upsert' is required:
// 
// const schema = new Schema({
//     query: { type: Object },
//     data: { type: Object },
//     params: {
//         upsert: { type: Boolean, required: true },
//     }
// })
// 
// schema.validate({
//     query: {},
//     data: {}
// })

describe('Not required nested key', () => {
    test('[1] Nested key that is not required should pass the validation', () => {
        const schema = new Schema({
            query: { type: Object },
            data: { type: Object },
            params: {
                upsert: { type: Boolean, required: false },
            }
        })

        const data = {
            query: {},
            data: {}
        }

        const result = schema.validate(data);
        expect(result.ok).toBe(true);
        expect(result.missed).toEqual([]);
    });

    test('[2] Nested key that is required should not pass the validation', () => {
        const schema = new Schema({
            query: { type: Object },
            data: { type: Object },
            params: {
                upsert: { type: Boolean, required: true },
            }
        })

        const data = {
            query: {},
            data: {}
        }

        const result = schema.validate(data);
        expect(result.ok).toBe(false);
        expect(result.missed).toEqual(['params.upsert']);
        expect(result.failed).toEqual(['params.upsert', 'params']);
        expect(result.passed).toEqual(['query', 'data']);
    });
})
