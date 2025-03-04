const _errors: {[key: string]: Function} = {}

_errors.getMissingError = (key: string = 'na') => `Отсутствует значение '${key}'`

_errors.getErrorDetails = (key: string, expectedType: any, receivedValue: any) => {
    let receivedType = ''
    
    if (receivedValue === undefined) receivedType = 'undefined'
    else if (receivedValue === null) receivedType = 'null'
    else receivedType = receivedValue.constructor?.name || typeof receivedValue || 'na'

    const expectedOutput = expectedType?.name || expectedType
    const receivedOutput = receivedType || 'na'

    if (String(expectedOutput) === String(receivedOutput)) return ''

    return `Проверьте тип '${key}': ожидался ${expectedOutput}, получен ${receivedOutput}`;
};

_errors.joinErrors = (errorsArr: string[], separator = '; ') => {
    return errorsArr?.join(`${separator}`) || ''
}

export default _errors

