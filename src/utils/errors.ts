const _errors: {[key: string]: Function} = {}

_errors.getMissingError = (key: string) => `Ключ '${key}' отсутствует`

_errors.getErrorDetails = (key: string, expectedType: any, receivedValue: any) => {
    let receivedType = ''
    
    if (receivedValue === undefined) receivedType = 'undefined'
    else if (receivedValue === null) receivedType = 'null'
    else receivedType = receivedValue.constructor?.name || typeof receivedValue || 'na'

    return `Проверьте тип "${key}": ожидался ${expectedType?.name || expectedType}, получен ${receivedType || 'unknown'}`;
};

_errors.joinErrors = (errorsArr: string[], separator = '; ') => {
    return errorsArr?.join(`${separator}`) || ''
}

export default _errors

