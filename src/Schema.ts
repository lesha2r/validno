import { SchemaFields } from "./constants/schema.js"
import { SchemaDefinition } from "./types/common.js";
import ValidateEngine from "./engine/ValidateEngine.js";

export const defaultSchemaKeys = Object.values(SchemaFields);

export class Schema {
    definition: SchemaDefinition

    constructor(inputSchemaDefinition: SchemaDefinition) {
        if (!inputSchemaDefinition || typeof inputSchemaDefinition !== 'object') {
            throw new Error("Invalid schema input");
        }
        
        this.definition = inputSchemaDefinition;
    }

    validate<T extends Record<string, unknown>>(
        inputData: T,
        validationKeys?: string | string[]
    ) {
        const engine = new ValidateEngine(this.definition);
        return engine.validate(inputData, validationKeys);
    }
}