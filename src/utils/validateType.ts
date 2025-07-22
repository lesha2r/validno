import { ValidationDetails } from "../constants/details.js";

export interface TypeValidationResult {
  key: string;
  passed: boolean;
  details?: string;
}

interface TypeValidationUtils {
  getResult: (
    key: string,
    passed: boolean,
    details?: string
  ) => TypeValidationResult;
}

class TypeValidationUtility implements TypeValidationUtils {
  /**
   * Creates a standardized validation result object
   * @param key - The field name being validated
   * @param passed - Whether the validation passed
   * @param details - Optional details about the validation result
   * @returns Formatted validation result
   */
  getResult(
    key: string,
    passed: boolean,
    details: string = ValidationDetails.OK
  ): TypeValidationResult {
    return {
      key,
      passed,
      details
    };
  }
}

const validateType = new TypeValidationUtility();
export default validateType;