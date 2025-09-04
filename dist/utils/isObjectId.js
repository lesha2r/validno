const isObjectId = (value, expectedType) => {
    const isObjectId = typeof value === 'object' && (value === null || value === void 0 ? void 0 : value.constructor.name) === 'ObjectId';
    const isTypeObjectId = typeof expectedType === 'function' && expectedType.name === 'ObjectId';
    return (isObjectId && isTypeObjectId);
};
export default isObjectId;
