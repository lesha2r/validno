import validate from "./validate.js"
import { SchemaFields } from "./constants/schema.js"
import { SchemaDefinition } from "./types/common.js";

export const defaultSchemaKeys = Object.values(SchemaFields);

export class Schema {
    schema: SchemaDefinition

    constructor(inputSchemaDefinition: SchemaDefinition) {
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