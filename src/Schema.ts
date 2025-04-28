import { ESchemaFields } from "./constants/schema.js"
import validate from "./validate.js"

interface ICustomMessage {
    keyword: string,
    value: unknown,
    key: string,
    title: string,
    reqs: TSchemaItem,
    schema: TSchemaInput,
    rules?: Record<string, unknown>
}

export type TSchemaItem = {
    required: boolean,
    type: unknown,
    eachType?: unknown,
    rules?: Record<string, unknown>,
    title?: string,
    customMessage?: (callbackInput: ICustomMessage) => string
}

export type TSchemaInput = {
    [fieldName: string]: TSchemaItem | TSchemaInput
}

export const defaultSchemaKeys = Object.values(ESchemaFields);
export type TSchema = TSchemaInput

export class Schema {
    schema: TSchema

    constructor(inputSchemaDefinition: TSchema) {
        if (!inputSchemaDefinition || typeof inputSchemaDefinition !== 'object') {
            throw new Error("Invalid schema input");
        }
        
        this.schema = inputSchemaDefinition;
    }

    validate<T extends Record<string, unknown>>(
        inputData: T,
        validationKeys?: string | string[]
    ) {
        return validate.call(this, inputData, validationKeys)
    }
}