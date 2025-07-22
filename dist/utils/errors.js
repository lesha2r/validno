class ErrorUtility {
    getMissingError(key = 'na') {
        return `Missing value for '${key}'`;
    }
    getErrorDetails(key, expectedType, receivedValue) {
        const receivedType = this.getTypeString(receivedValue);
        const expectedOutput = this.getExpectedTypeString(expectedType);
        if (expectedOutput === receivedType) {
            return '';
        }
        return `Check the type of '${key}': expected ${expectedOutput}, received ${receivedType}`;
    }
    joinErrors(errorsArr, separator = '; ') {
        var _a;
        return ((_a = errorsArr === null || errorsArr === void 0 ? void 0 : errorsArr.filter(error => error === null || error === void 0 ? void 0 : error.trim())) === null || _a === void 0 ? void 0 : _a.join(separator)) || '';
    }
    getTypeString(value) {
        var _a;
        if (value === undefined)
            return 'undefined';
        if (value === null)
            return 'null';
        return ((_a = value.constructor) === null || _a === void 0 ? void 0 : _a.name) || typeof value || 'unknown';
    }
    getExpectedTypeString(expectedType) {
        return (expectedType === null || expectedType === void 0 ? void 0 : expectedType.name) || String(expectedType) || 'unknown';
    }
}
const errors = new ErrorUtility();
export default errors;
