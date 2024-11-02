import validate from "./validate.js";
import validateKey from "./validateKey.js";
export const defaultSchemaKeys = [
    "required",
    "type",
    "eachType",
    "rules"
];
export class Schema {
    constructor(inputSchema) {
        this.schema = inputSchema;
    }
    validate(data) {
        return validate.call(this, this, data);
    }
    validateKey(key, data) {
        return validateKey.call(this, this, data, key);
    }
}
