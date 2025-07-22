interface ErrorUtils {
  getMissingError: (key?: string) => string;
  getErrorDetails: (key: string, expectedType: any, receivedValue: any) => string;
  joinErrors: (errorsArr: string[], separator?: string) => string;
}

class ErrorUtility implements ErrorUtils {
  /**
   * Generates a missing value error message
   * @param key - The field name that is missing
   * @returns Formatted error message
   */
  getMissingError(key: string = 'na'): string {
    return `Missing value for '${key}'`;
  }

  /**
   * Generates detailed type mismatch error message
   * @param key - The field name with type mismatch
   * @param expectedType - The expected type
   * @param receivedValue - The actual received value
   * @returns Formatted error message or empty string if types match
   */
  getErrorDetails(key: string, expectedType: any, receivedValue: any): string {
    const receivedType = this.getTypeString(receivedValue);
    const expectedOutput = this.getExpectedTypeString(expectedType);
    
    if (expectedOutput === receivedType) {
      return '';
    }

    return `Check the type of '${key}': expected ${expectedOutput}, received ${receivedType}`;
  }

  /**
   * Joins multiple error messages with a separator
   * @param errorsArr - Array of error messages
   * @param separator - String to join errors with
   * @returns Combined error message
   */
  joinErrors(errorsArr: string[], separator: string = '; '): string {
    return errorsArr?.filter(error => error?.trim())?.join(separator) || '';
  }

  /**
   * Determines the type string for a given value
   * @private
   */
  private getTypeString(value: any): string {
    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    
    return value.constructor?.name || typeof value || 'unknown';
  }

  /**
   * Gets the expected type string from type parameter
   * @private
   */
  private getExpectedTypeString(expectedType: any): string {
    return expectedType?.name || String(expectedType) || 'unknown';
  }
}

const errors = new ErrorUtility();
export default errors;

