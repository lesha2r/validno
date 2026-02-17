/* eslint-disable no-unused-vars */
import {describe, expect, test} from '@jest/globals';
import { Schema } from '../../Schema';

const AccessScopes = {
    Public: 'public',
    Project: 'workspace',
    User: 'user'
};

const collectionSettingsSchema = new Schema({
    auth: { type: null },
    scope: {
        type: String,
        rules: {
            enum: Object.values(AccessScopes)
        },
    },
    methods: {
        get: {
            isActive: { type: Boolean },
            scope: {
                type: String,
                rules: {enum: Object.values(AccessScopes)},
                required: false
            }
        },
        getAll: {
            isActive: { type: Boolean },
            scope: {
                type: String,
                rules: {
                    enum: Object.values(AccessScopes)
                },
                required: false
            },
            sort: { default: {type: String }},
            filter: {fields: {type: Array, eachType: String }},
            search: { fields: { type: Array, eachType: String } }
        },
        create: {
            isActive: { type: Boolean },
            scope: {
                type: String,
                rules: {enum: Object.values(AccessScopes)},
                required: false
            }
        },
        update: {
            isActive: { type: Boolean },
            scope: {
                type: String,
                rules: {enum: Object.values(AccessScopes)},
                required: false
            },
            allowedFields: { type: Array, eachType: String }
        },
        delete: {
            isActive: { type: Boolean },
            scope: {
                type: String,
                rules: {enum: Object.values(AccessScopes)},
                required: false
            }
        },
        distinct: {
            isActive: { type: Boolean },
            scope: {
                type: String,
                rules: {enum: Object.values(AccessScopes)},
                required: false
            },
            fields: { type: Array, eachType: String }
        }
    }
})

const settingsData = { test: 1}

describe('Corrupted data in nested keys', () => {
    test('Corrupted data in nested keys should not pass the validation', () => {
        const result = collectionSettingsSchema.validate(settingsData);
        expect(result.ok).toBe(false);
        expect(result.errors.length).toBeGreaterThan(1);
    });
});
