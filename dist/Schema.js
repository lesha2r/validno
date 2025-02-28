import validate from "./validate.js";
export const defaultSchemaKeys = [
    "required",
    "type",
    "eachType",
    "rules",
    "title",
    "customMessage",
    "joinErrors"
];
export class Schema {
    constructor(inputSchema) {
        this.schema = inputSchema;
    }
    validate(data, keys) {
        return validate.call(this, this, data, keys);
    }
}
