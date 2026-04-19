import _helpers from "../../utils/helpers.js"
import ValidnoResult from "../ValidnoResult.js"
import ValidateEngine, { KeyValidationDetails } from "../ValidateEngine.js"
import { ValidationDetails } from "../../constants/details.js"

function validate(
    this: ValidateEngine,
    data: any,
    validationKeys?: string | string[]
): ValidnoResult {
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
        this.result.setFailed("", ValidationDetails.BadInput)
        return this.result.finish()
    }

    // Inline areKeysLimited for performance
    const hasKeysToCheck = validationKeys !== undefined && (
      (typeof validationKeys === 'string' && validationKeys.length > 0) ||
      (Array.isArray(validationKeys) && validationKeys.length > 0)
    );
    const schemaKeys = (this as any)._schemaEntries  // Use cached entries

    // Fast path: validate all keys (most common case)
    if (!hasKeysToCheck) {
      for (let i = 0; i < schemaKeys.length; i++) {
        const [key, reqs] = schemaKeys[i]
        const keyResult = this.handleKey({key, data, reqs} as KeyValidationDetails)
        this.result.merge(keyResult)
      }
    } else {
      // Slow path: selective validation
      for (let i = 0; i < schemaKeys.length; i++) {
        const [key, reqs] = schemaKeys[i]
        // Inline needValidation for performance
        const toBeValidated = key === validationKeys || (Array.isArray(validationKeys) && validationKeys.includes(key));
        if (!toBeValidated) continue
        
        const keyResult = this.handleKey({key, data, reqs} as KeyValidationDetails)
        this.result.merge(keyResult)
      }
    }
  
    return this.result.finish()
}

export default validate;
