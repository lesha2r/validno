import { ValidationDetails } from "../constants/details.js"

/**
 * Result type for checkType
 */
export type TypeValidationResult = {
  key: string;
  passed: boolean;
  details?: string;
}

const _validateType = {
  /**
   * Helper function to create a check result object
   */
  getResult: (
    key: string,
    passed: boolean,
    details: string = ValidationDetails.OK
  ): TypeValidationResult => {
      return {
        key: key,
        passed: passed,
        details: details,
    }
  }
}

export default _validateType