import { SchemaFields } from "./constants/schema.js";
import ValidateEngine from "./engine/ValidateEngine.js";
export const defaultSchemaKeys = Object.values(SchemaFields);
export class Schema {
    constructor(inputSchemaDefinition) {
        if (!inputSchemaDefinition || typeof inputSchemaDefinition !== 'object') {
            throw new Error("Invalid schema input");
        }
        this.definition = inputSchemaDefinition;
    }
    validate(inputData, validationKeys) {
        const engine = new ValidateEngine(this.definition);
        return engine.validate(inputData, validationKeys);
    }
}
