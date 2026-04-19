import { SchemaFields } from "./constants/schema.js"
import { SchemaDefinition } from "./types/common.js";
import ValidateEngine from "./engine/ValidateEngine.js";
import ValidnoResult from "./engine/ValidnoResult.js";

export const defaultSchemaKeys = Object.values(SchemaFields);

export class Schema {
    definition: SchemaDefinition
    private _engine: ValidateEngine  // Cache engine instance

    constructor(inputSchemaDefinition: SchemaDefinition) {
        if (!inputSchemaDefinition || typeof inputSchemaDefinition !== 'object') {
            throw new Error("Invalid schema input");
        }
        
        this.definition = inputSchemaDefinition;
        this._engine = new ValidateEngine(this.definition);  // Create once
    }

    validate<T, K extends keyof T = keyof T>(inputData: T, validationKeys?: K | K[]): ValidnoResult {
        // Reuse engine instance, just reset result
        this._engine.result = new ValidnoResult();
        const result = this._engine.validate(inputData, validationKeys as string | string[]);
        return result;
    }
}