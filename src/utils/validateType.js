import { ValidationDetails } from "../constants/details.js";
class TypeValidationUtility {
    /**
     * Creates a standardized validation result object
     * @param key - The field name being validated
     * @param passed - Whether the validation passed
     * @param details - Optional details about the validation result
     * @returns Formatted validation result
     */
    getResult(key, passed, details = ValidationDetails.OK) {
        return {
            key,
            passed,
            details
        };
    }
}
const validateType = new TypeValidationUtility();
export default validateType;
