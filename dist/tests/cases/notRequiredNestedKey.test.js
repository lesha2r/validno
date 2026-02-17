import { describe, expect, test } from '@jest/globals';
import { Schema } from '../../Schema';
describe('Not required nested key', () => {
    test('[1] Nested key that is not required should pass the validation', () => {
        const schema = new Schema({
            query: { type: Object },
            data: { type: Object },
            params: {
                upsert: { type: Boolean, required: false },
            }
        });
        const data = {
            query: {},
            data: {}
        };
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
        });
        const data = {
            query: {},
            data: {}
        };
        const result = schema.validate(data);
        expect(result.ok).toBe(false);
        expect(result.missed).toEqual(['params.upsert']);
        expect(result.failed).toEqual(['params.upsert', 'params']);
        expect(result.passed).toEqual(['query', 'data']);
    });
});
