import _helpers from "../../utils/helpers.js"
import ValidnoResult from "../ValidnoResult.js"
import ValidateEngine, { KeyValidationDetails } from "../ValidateEngine.js"

function validate<T extends Record<string, unknown>>(
    this: ValidateEngine,
    data: T,
    validationKeys?: string | string[]
): ValidnoResult {
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
