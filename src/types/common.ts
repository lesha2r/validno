export interface SchemaDefinition {
    [key: string]: FieldSchema | SchemaDefinition
}

export interface FieldSchema {
    required: boolean,
    type: unknown,
    eachType?: unknown,
    rules?: Record<string, unknown>,
    title?: string,
    customMessage?: (callbackInput: CustomMessageDetails) => string
}

export interface CustomMessageDetails {
    keyword: string,
    value: unknown,
    key: string,
    title: string,
    reqs: FieldSchema,
    schema: SchemaDefinition,
    rules?: Record<string, unknown>
}