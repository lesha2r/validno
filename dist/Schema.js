import { SchemaFields } from "./constants/schema.js";
import validate from "./validate.js";
export const defaultSchemaKeys = Object.values(SchemaFields);
export class Schema {
    constructor(inputSchemaDefinition) {
        if (!inputSchemaDefinition || typeof inputSchemaDefinition !== 'object') {
            throw new Error("Invalid schema input");
        }
        this.schema = inputSchemaDefinition;
    }
    validate(inputData, validationKeys) {
        return validate.call(this, inputData, validationKeys);
    }
}
