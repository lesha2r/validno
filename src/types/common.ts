export interface SchemaDefinition {
    [key: string]: FieldSchema | SchemaDefinition
}

/**
 * Rule value with inline message support.
 * Can be a simple value or an object with value and message properties.
 * @example
 * // Simple value
 * rules: { isEmail: true }
 * 
 * // With inline message
 * rules: { isEmail: { value: true, message: 'Please enter a valid email' } }
 */
export type RuleWithMessage<T = unknown> = T | { value: T; message: string }

export interface FieldSchema {
    required?: boolean,
    type: unknown,
    eachType?: unknown,
    rules?: Record<string, RuleWithMessage>,
    title?: string,
    /**
     * Custom error message for required field validation.
     * Shorthand for common required field errors.
     * @example
     * email: {
     *   type: String,
     *   required: true,
     *   requiredMessage: 'Please enter your email'
     * }
     */
    requiredMessage?: string,
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