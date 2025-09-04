import { ValidationIds } from "../../constants/details.js";
import _errors from "../../utils/errors.js";
function handleMissingKey(schema, input) {
    const { key, nestedKey, data, reqs } = input;
    const messageKey = nestedKey || key;
    const messageTitle = reqs.title || messageKey;
    if (!reqs.customMessage)
        return _errors.getMissingError(messageKey);
    const errorMessage = reqs.customMessage({
        keyword: ValidationIds.Missing,
        value: data[key],
        key: messageKey,
        title: messageTitle,
        reqs,
        schema,
    });
    return errorMessage;
}
export default handleMissingKey;
