import validate from "./validate.js";
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
}
