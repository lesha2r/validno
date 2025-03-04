import validate from "./validate.js"

export type TSchemaItem = {
    required: boolean,
    type: any,
    eachType?: any,
    rules?: {},
    title?: string,
    
    customMessage?: Function
}

export type TSchemaInput = {
    [key: string]: TSchemaItem | TSchemaInput
}

export const enum ESchemaFields {
    Required = 'required',
    Type = 'type',
    EachType = 'eachType',
    Rules = 'rules',
    Title = 'title',
    CustomMessage = 'customMessage',
    JoinErrors = 'joinErrors'
}

export const defaultSchemaKeys = [
    ESchemaFields.Required,
    ESchemaFields.Type,
    ESchemaFields.EachType,
    ESchemaFields.Rules,
    ESchemaFields.Title,
    ESchemaFields.CustomMessage,
    ESchemaFields.JoinErrors
]

export type TSchema = TSchemaInput

export class Schema {
    schema: TSchema

    constructor(inputSchema: TSchema) {
        this.schema = inputSchema
    }

    validate(data: any, keys?: string | string[]) {
        return validate.call(this, this, data, keys)
    }
}