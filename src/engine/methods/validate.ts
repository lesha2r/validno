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
        const result = new ValidnoResult()
        result.setFailed("", ValidationDetails.BadInput)
        return result.finish()
    }

    const hasKeysToCheck = _helpers.areKeysLimited(validationKeys)
    const schemaKeys = Object.entries(this.definition)

    for (const [key, reqs] of schemaKeys) {
      const toBeValidated = _helpers.needValidation(key, hasKeysToCheck, validationKeys)
      if (!toBeValidated) continue
    
      const keyResult = this.handleKey({key, data, reqs} as KeyValidationDetails)
      this.result.merge(keyResult)
    }
  
    return this.result.finish()
}

export default validate;
