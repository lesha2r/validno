import _helpers from "./helpers.js";

interface ValidationUtils {
  // Type checks
  isString: (value: any) => boolean;
  isNumber: (value: any) => boolean;
  isArray: (value: any) => boolean;
  isObject: (value: any) => boolean;
  isDate: (value: any) => boolean;
  isRegex: (value: any) => boolean;
  isBoolean: (value: any) => boolean;
  isNull: (value: any) => boolean;
  isUndefined: (value: any) => boolean;
  isNullOrUndefined: (value: any) => boolean;
  
  // String format validations
  isEmail: (value: string) => boolean;
  isDateYYYYMMDD: (value: string) => boolean;
  isHex: (value: string) => boolean;
  
  // Length validations
  lengthIs: (value: string | any[], length: number) => boolean;
  lengthNot: (value: string | any[], length: number) => boolean;
  lengthMin: (value: string | any[], min: number) => boolean;
  lengthMax: (value: string | any[], max: number) => boolean;
  
  // Number comparisons
  isNumberGte: (value: any, gte: number) => boolean;
  isNumberGt: (value: any, gt: number) => boolean;
  isNumberLte: (value: any, lte: number) => boolean;
  isNumberLt: (value: any, lt: number) => boolean;
  
  // Date comparisons
  isDateGte: (date1: any, date2: Date) => boolean;
  isDateGt: (date1: any, date2: Date) => boolean;
  isDateLte: (date1: any, date2: Date) => boolean;
  isDateLt: (date1: any, date2: Date) => boolean;
  
  // Object/equality validations
  hasKey: (obj: object, key: string) => boolean;
  is: (value: any, compareTo: any) => boolean;
  not: (value: any, not: any) => boolean;
  regexTested: (value: string, regexp: RegExp) => boolean;
  
  // Aliases
  gt: (value: any, gt: number) => boolean;
  gte: (value: any, gte: number) => boolean;
  lte: (value: any, lte: number) => boolean;
  lt: (value: any, lt: number) => boolean;
  eq: (value: any, compareTo: any) => boolean;
  isNot: (value: any, not: any) => boolean;
  ne: (value: any, not: any) => boolean;
  neq: (value: any, not: any) => boolean;
  regex: (value: string, regexp: RegExp) => boolean;
  regexp: (value: string, regexp: RegExp) => boolean;
  test: (value: string, regexp: RegExp) => boolean;
}

class ValidationUtility implements ValidationUtils {
  // TYPE CHECKS
  /**
   * Checks if value is a string
   * @param value - Value to check
   * @returns True if value is a string
   */
  isString(value: any): boolean {
    return typeof value === 'string';
  }

  /**
   * Checks if value is a number
   * @param value - Value to check
   * @returns True if value is a number
   */
  isNumber(value: any): boolean {
    return typeof value === 'number';
  }

  /**
   * Checks if value is an array
   * @param value - Value to check
   * @returns True if value is an array
   */
  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  /**
   * Checks if value is a plain object
   * @param value - Value to check
   * @returns True if value is a plain object
   */
  isObject(value: any): boolean {
    return value !== null && 
           typeof value === 'object' && 
           value?.constructor?.name === 'Object' && 
           !Array.isArray(value);
  }

  /**
   * Checks if value is a valid Date
   * @param value - Value to check
   * @returns True if value is a valid Date
   */
  isDate(value: any): boolean {
    return value instanceof Date && String(value) !== 'Invalid Date';
  }

  /**
   * Checks if value is a RegExp
   * @param value - Value to check
   * @returns True if value is a RegExp
   */
  isRegex(value: any): boolean {
    return value instanceof RegExp;
  }

  /**
   * Checks if value is a boolean
   * @param value - Value to check
   * @returns True if value is a boolean
   */
  isBoolean(value: any): boolean {
    return typeof value === 'boolean';
  }

  /**
   * Checks if value is null
   * @param value - Value to check
   * @returns True if value is null
   */
  isNull(value: any): boolean {
    return value === null;
  }

  /**
   * Checks if value is undefined
   * @param value - Value to check
   * @returns True if value is undefined
   */
  isUndefined(value: any): boolean {
    return value === undefined;
  }

  /**
   * Checks if value is null or undefined
   * @param value - Value to check
   * @returns True if value is null or undefined
   */
  isNullOrUndefined(value: any): boolean {
    return value === undefined || value === null;
  }

  // STRING FORMAT VALIDATIONS
  /**
   * Validates email format
   * @param value - String to validate
   * @returns True if value is a valid email
   */
  isEmail(value: string): boolean {
    const emailRegex = /^(?!.*\.\.)[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  /**
   * Validates YYYY-MM-DD date format
   * @param value - String to validate
   * @returns True if value matches YYYY-MM-DD format
   */
  isDateYYYYMMDD(value: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(value);
  }

  /**
   * Validates hexadecimal color format
   * @param value - String to validate
   * @returns True if value is a valid hex color
   */
  isHex(value: string): boolean {
    const regex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
    return regex.test(value);
  }

  // LENGTH VALIDATIONS
  /**
   * Checks if value has exact length
   * @param value - String or array to check
   * @param length - Expected length
   * @returns True if value has exact length
   */
  lengthIs(value: string | any[], length: number): boolean {
    if (typeof value !== 'string' && !Array.isArray(value)) return false;
    if (typeof length !== 'number') return false;
    return value.length === length;
  }

  /**
   * Checks if value does not have specific length
   * @param value - String or array to check
   * @param length - Length to compare against
   * @returns True if value does not have specific length
   */
  lengthNot(value: string | any[], length: number): boolean {
    if (typeof value !== 'string' && !Array.isArray(value)) return false;
    if (typeof length !== 'number') return false;
    return value.length !== length;
  }

  /**
   * Checks if value has minimum length
   * @param value - String or array to check
   * @param min - Minimum length
   * @returns True if value has minimum length
   */
  lengthMin(value: string | any[], min: number): boolean {
    if (typeof value !== 'string' && !Array.isArray(value)) return false;
    if (typeof min !== 'number') return false;
    return value.length >= min;
  }

  /**
   * Checks if value has maximum length
   * @param value - String or array to check
   * @param max - Maximum length
   * @returns True if value has maximum length
   */
  lengthMax(value: string | any[], max: number): boolean {
    if (typeof value !== 'string' && !Array.isArray(value)) return false;
    if (typeof max !== 'number') return false;
    return value.length <= max;
  }

  // NUMBER COMPARISONS
  /**
   * Checks if number is greater than or equal to value
   * @param value - Value to check
   * @param gte - Minimum value (inclusive)
   * @returns True if value >= gte
   */
  isNumberGte(value: any, gte: number): boolean {
    return typeof value === 'number' && value >= gte;
  }

  /**
   * Checks if number is greater than value
   * @param value - Value to check
   * @param gt - Minimum value (exclusive)
   * @returns True if value > gt
   */
  isNumberGt(value: any, gt: number): boolean {
    return typeof value === 'number' && value > gt;
  }

  /**
   * Checks if number is less than or equal to value
   * @param value - Value to check
   * @param lte - Maximum value (inclusive)
   * @returns True if value <= lte
   */
  isNumberLte(value: any, lte: number): boolean {
    return typeof value === 'number' && value <= lte;
  }

  /**
   * Checks if number is less than value
   * @param value - Value to check
   * @param lt - Maximum value (exclusive)
   * @returns True if value < lt
   */
  isNumberLt(value: any, lt: number): boolean {
    return typeof value === 'number' && value < lt;
  }

  // DATE COMPARISONS
  /**
   * Checks if date1 is greater than or equal to date2
   * @param date1 - First date
   * @param date2 - Second date
   * @returns True if date1 >= date2
   */
  isDateGte(date1: any, date2: Date): boolean {
    if (!this.isDate(date1) || !this.isDate(date2)) {
      return false;
    }
    return date1 >= date2;
  }

  /**
   * Checks if date1 is greater than date2
   * @param date1 - First date
   * @param date2 - Second date
   * @returns True if date1 > date2
   */
  isDateGt(date1: any, date2: Date): boolean {
    if (!this.isDate(date1) || !this.isDate(date2)) {
      return false;
    }
    return date1 > date2;
  }

  /**
   * Checks if date1 is less than or equal to date2
   * @param date1 - First date
   * @param date2 - Second date
   * @returns True if date1 <= date2
   */
  isDateLte(date1: any, date2: Date): boolean {
    if (!this.isDate(date1) || !this.isDate(date2)) {
      return false;
    }
    return date1 <= date2;
  }

  /**
   * Checks if date1 is less than date2
   * @param date1 - First date
   * @param date2 - Second date
   * @returns True if date1 < date2
   */
  isDateLt(date1: any, date2: Date): boolean {
    if (!this.isDate(date1) || !this.isDate(date2)) {
      return false;
    }
    return date1 < date2;
  }

  // OBJECT/EQUALITY VALIDATIONS
  /**
   * Checks if object has a specific key
   * @param obj - Object to check
   * @param key - Key to look for
   * @returns True if object has the key
   */
  hasKey(obj: object, key: string): boolean {
    if (!this.isObject(obj)) return false;
    return key in obj;
  }

  /**
   * Performs deep equality comparison
   * @param value - First value to compare
   * @param compareTo - Second value to compare
   * @returns True if values are deeply equal
   */
  is(value: any, compareTo: any): boolean {
    if (value === compareTo) {
      return true;
    }

    const bothArrays = this.isArray(value) && this.isArray(compareTo);
    if (bothArrays) {
      return _helpers.compareArrs(value, compareTo);
    }

    const bothObjects = this.isObject(value) && this.isObject(compareTo);
    if (bothObjects) {
      return _helpers.compareObjs(value, compareTo);
    }

    const bothDates = this.isDate(value) && this.isDate(compareTo);
    if (bothDates) {
      return value.getTime() === compareTo.getTime();
    }

    return value === compareTo;
  }

  /**
   * Checks if values are not equal
   * @param value - First value to compare
   * @param not - Second value to compare
   * @returns True if values are not equal
   */
  not(value: any, not: any): boolean {
    return !this.is(value, not);
  }

  /**
   * Tests value against regular expression
   * @param value - String to test
   * @param regexp - Regular expression to test against
   * @returns True if regexp matches value
   */
  regexTested(value: string, regexp: RegExp): boolean {
    if (!regexp || !(regexp instanceof RegExp)) {
      throw new Error('regexp argument is incorrect');
    }
    return regexp.test(value);
  }

  // ALIASES
  get gt() { return this.isNumberGt; }
  get gte() { return this.isNumberGte; }
  get lte() { return this.isNumberLte; }
  get lt() { return this.isNumberLt; }
  get eq() { return this.is; }
  get isNot() { return this.not; }
  get ne() { return this.not; }
  get neq() { return this.not; }
  get regex() { return this.regexTested; }
  get regexp() { return this.regexTested; }
  get test() { return this.regexTested; }
}

const validations = new ValidationUtility();
export default validations;
