import { ValidationIds } from "../../constants/details.js";
import { Schema } from "../../Schema.js";
import _errors from "../../utils/errors.js";
import { KeyValidationDetails } from "../ValidateEngine.js";

function handleMissingKey(schema: Schema, input: KeyValidationDetails) {
  const { key, nestedKey, data, reqs } = input;

  const messageKey = nestedKey || key;
  const messageTitle = reqs.title || messageKey;

  // Priority: customMessage callback > requiredMessage shorthand > default error
  if (reqs.customMessage && typeof reqs.customMessage === 'function') {
    // @ts-ignore
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

  if (reqs.requiredMessage && typeof reqs.requiredMessage === 'string') {
    return reqs.requiredMessage;
  }

  return _errors.getMissingError(messageKey);
}

export default handleMissingKey;