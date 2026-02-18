import {describe, expect, test} from '@jest/globals';
import { Schema } from '../../Schema';
import { ObjectId } from 'mongodb';
import isObjectId from '../../utils/isObjectId.js';

// [Case]
// null handled incorrectly in type validation while comparing to ObjectId
//
// [Description]
// When validating a field that can be only ObjectId, null value tried
// to checked for constructor type which caused the validation to throw an error
// instead of returning a failed validation result.
// 
// [Examples]
// Here is the schema and data that caused the issue:
//
// import { Schema } from "./Schema.js";
// import isObjectId from "./utils/isObjectId.js";
// import { ObjectId } from "mongodb";

// export const AccessScopes = {
//     Inherit: 'inherit',
//     Public: 'public',
//     Project: 'workspace',
//     User: 'user'
// } as const;

// const checkMethodScope = (value: string, context: {input: any}) => {
//     const authCollection = context.input.authCollection
//     if (isObjectId(authCollection, ObjectId)) return true
    
//     const mainScope = context.input.scope
//     const methods = context.input.methods
//     const allMethodsScopes = [
//         mainScope,
//         //@ts-ignore
//         ...Object.values(methods).filter(method => method.isActive).map(method => method.scope)
//     ]

//     if (!allMethodsScopes.includes(AccessScopes.User) && !allMethodsScopes.includes(AccessScopes.Project)) {
//         return true
//     }
    
//     return {
//         result: false,
//         details: 'Invalid scope. To use User or Project scope, the collection must have authCollection to be set.'
//     }
// }

// const test = () => {
//     const data = {
//         scope: 'public',
//         methods: {
//             get: { isActive: false, scope: 'public' },
//             getAll: {
//             isActive: true,
//             scope: 'public',
//             sort: [Object],
//             filter: [Object],
//             search: [Object]
//             },
//             create: { isActive: true, scope: 'public' },
//             update: { isActive: false, scope: 'public', allowedFields: [] },
//             delete: { isActive: false, scope: 'public' },
//             distinct: { isActive: false, scope: 'public', fields: [] }
//         },
//         authSettings: null,
//         authCollection: null
//     }

//     const collectionSettingsSchema = new Schema({
//         authCollection: {
//             type: [ObjectId, null],
//             required: false,
//         },
//         scope: {
//             type: String,
//             rules: {
//                 enum: Object.values(AccessScopes).filter(scope => scope !== AccessScopes.Inherit),
//                 custom: checkMethodScope
//             },
//         },
//         methods: {
//             get: {
//                 isActive: { type: Boolean },
//                 scope: {
//                     type: String,
//                     rules: {enum: Object.values(AccessScopes)},
//                     required: false
//                 }
//             },
//             getAll: {
//                 isActive: { type: Boolean },
//                 scope: {
//                     type: String,
//                     rules: {
//                         enum: Object.values(AccessScopes)
//                     },
//                     required: false
//                 },
//                 sort: { default: {type: String, required: false }},
//                 filter: {fields: {type: Array, eachType: String, required: false}},
//                 search: { fields: { type: Array, eachType: String, required: false } }
//             },
//             create: {
//                 isActive: { type: Boolean },
//                 scope: {
//                     type: String,
//                     rules: {enum: Object.values(AccessScopes)},
//                     required: false
//                 }
//             },
//             update: {
//                 isActive: { type: Boolean },
//                 scope: {
//                     type: String,
//                     rules: {enum: Object.values(AccessScopes)},
//                     required: false
//                 },
//                 allowedFields: { type: Array, eachType: String, required: false }
//             },
//             delete: {
//                 isActive: { type: Boolean },
//                 scope: {
//                     type: String,
//                     rules: {enum: Object.values(AccessScopes)},
//                     required: false
//                 }
//             },
//             distinct: {
//                 isActive: { type: Boolean },
//                 scope: {
//                     type: String,
//                     rules: {enum: Object.values(AccessScopes)},
//                     required: false
//                 },
//                 fields: { type: Array, eachType: String }
//             }
//         }
//     })

//     const validateResult = collectionSettingsSchema.validate(data)
//     console.log(validateResult)
// };
// test();

export const AccessScopes = {
    Inherit: 'inherit',
    Public: 'public',
    Project: 'workspace',
    User: 'user'
} as const;

const dataExample = {
    scope: 'public',
    methods: {
        get: { isActive: false, scope: 'public' },
        getAll: {
        isActive: true,
        scope: 'public',
        sort: [Object],
        filter: [Object],
        search: [Object]
        },
        create: { isActive: true, scope: 'public' },
        update: { isActive: false, scope: 'public', allowedFields: [] },
        delete: { isActive: false, scope: 'public' },
        distinct: { isActive: false, scope: 'public', fields: [] }
    },
    authSettings: null,
    authCollection: null
}

const checkMethodScope = (value: string, context: {input: any}) => {
    const authCollection = context.input.authCollection
    if (isObjectId(authCollection, ObjectId)) return true
    
    const mainScope = context.input.scope
    const methods = context.input.methods
    const allMethodsScopes = [
        mainScope,
        // @ts-ignore
        ...Object.values(methods).filter(method => method.isActive).map(method => method.scope)
    ]

    if (!allMethodsScopes.includes(AccessScopes.User) && !allMethodsScopes.includes(AccessScopes.Project)) {
        return true
    }
    
    return {
        result: false,
        details: 'Invalid scope. To use User or Project scope, the collection must have authCollection to be set.'
    }
}

const collectionSettingsSchema = new Schema({
    authCollection: {
        type: [ObjectId, null],
        required: false,
    },
    scope: {
        type: String,
        rules: {
            enum: Object.values(AccessScopes).filter(scope => scope !== AccessScopes.Inherit),
            custom: checkMethodScope
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
            sort: { default: {type: String, required: false }},
            filter: {fields: {type: Array, eachType: String, required: false}},
            search: { fields: { type: Array, eachType: String, required: false } }
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
            allowedFields: { type: Array, eachType: String, required: false }
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

describe('Null type handled in ObjectId validation', () => {
    test('Null value should not cause an error in ObjectId validation', () => {
        const validateResult = collectionSettingsSchema.validate(dataExample)
        expect(validateResult.ok).toBe(true);
    })
})