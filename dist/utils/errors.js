const _errors = {};
_errors.getMissingError = (key = 'na') => `Отсутствует значение '${key}'`;
_errors.getErrorDetails = (key, expectedType, receivedValue) => {
    var _a;
    let receivedType = '';
    if (receivedValue === undefined)
        receivedType = 'undefined';
    else if (receivedValue === null)
        receivedType = 'null';
    else
        receivedType = ((_a = receivedValue.constructor) === null || _a === void 0 ? void 0 : _a.name) || typeof receivedValue || 'na';
    const expectedOutput = (expectedType === null || expectedType === void 0 ? void 0 : expectedType.name) || expectedType;
    const receivedOutput = receivedType || 'na';
    if (String(expectedOutput) === String(receivedOutput))
        return '';
    return `Проверьте тип '${key}': ожидался ${expectedOutput}, получен ${receivedOutput}`;
};
_errors.joinErrors = (errorsArr, separator = '; ') => {
    return (errorsArr === null || errorsArr === void 0 ? void 0 : errorsArr.join(`${separator}`)) || '';
};
export default _errors;
