import { SchemaFields } from "./constants/schema.js"
import { SchemaDefinition } from "./types/common.js";
import ValidateEngine from "./engine/ValidateEngine.js";
import ValidnoResult from "./engine/ValidnoResult.js";

export const defaultSchemaKeys = Object.values(SchemaFields);

export class Schema {
    definition: SchemaDefinition

    constructor(inputSchemaDefinition: SchemaDefinition) {
        if (!inputSchemaDefinition || typeof inputSchemaDefinition !== 'object') {
            throw new Error("Invalid schema input");
        }
        
        this.definition = inputSchemaDefinition;
    }

    validate<T, K extends keyof T = keyof T>(inputData: T, validationKeys?: K | K[]): ValidnoResult {
        const engine = new ValidateEngine(this.definition);
        const result = engine.validate(inputData, validationKeys as string | string[]);
        return result;
    }
}