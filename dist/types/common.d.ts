export interface SchemaDefinition {
    [key: string]: FieldSchema | SchemaDefinition;
}
export declare type RuleWithMessage<T = unknown> = T | {
    value: T;
    message: string;
};
export interface FieldSchema {
    required?: boolean;
    type: unknown;
    eachType?: unknown;
    rules?: Record<string, RuleWithMessage>;
    title?: string;
    requiredMessage?: string;
    customMessage?: (callbackInput: CustomMessageDetails) => string;
}
export interface CustomMessageDetails {
    keyword: string;
    value: unknown;
    key: string;
    title: string;
    reqs: FieldSchema;
    schema: SchemaDefinition;
    rules?: Record<string, unknown>;
}
//# sourceMappingURL=common.d.ts.map