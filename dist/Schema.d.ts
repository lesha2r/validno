import { SchemaFields } from "./constants/schema.js";
import { SchemaDefinition } from "./types/common.js";
import ValidnoResult from "./engine/ValidnoResult.js";
export declare const defaultSchemaKeys: SchemaFields[];
export declare class Schema {
    definition: SchemaDefinition;
    constructor(inputSchemaDefinition: SchemaDefinition);
    validate<T, K extends keyof T = keyof T>(inputData: T, validationKeys?: K | K[]): ValidnoResult;
}
//# sourceMappingURL=Schema.d.ts.map