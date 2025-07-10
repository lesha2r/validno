import { SchemaFields } from "./constants/schema.js"
import validate from "./validate.js"

interface CustomMessageDetails {
    keyword: string,
    value: unknown,
    key: string,
    title: string,
    reqs: SchemaItem,
    schema: SchemaInput,
    rules?: Record<string, unknown>
}

export interface SchemaItem {
    required: boolean,
    type: unknown,
    eachType?: unknown,
    rules?: Record<string, unknown>,
    title?: string,
    customMessage?: (callbackInput: CustomMessageDetails) => string
}

export interface SchemaInput {
    [fieldName: string]: SchemaItem | SchemaInput
}

export const defaultSchemaKeys = Object.values(SchemaFields);

export class Schema {
    schema: SchemaInput

    constructor(inputSchemaDefinition: SchemaInput) {
        if (!inputSchemaDefinition || typeof inputSchemaDefinition !== 'object') {
            throw new Error("Invalid schema input");
        }
        
        this.schema = inputSchemaDefinition;
    }

    validate<T extends Record<string, unknown>>(
        inputData: T,
        validationKeys?: string | string[]
    ) {
        return validate.call(this, inputData, validationKeys)
    }
}