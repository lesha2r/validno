# Built-in Utilities

Validno provides a comprehensive set of standalone validation utilities that you can use independently of the main Schema class.

## Importing Utilities

```javascript
import { validations } from 'validno';

// Or import specific utilities (if supported by your bundler)
import { 
  isEmail, 
  isString, 
  lengthMin 
} from 'validno/validations';
```

## Type Checking Utilities

### Basic Type Checks

Verify the fundamental type of values:

```javascript
// String validation
validations.isString("hello");        // true
validations.isString(123);           // false
validations.isString("");            // true

// Number validation  
validations.isNumber(42);            // true
validations.isNumber("42");          // false
validations.isNumber(3.14);          // true
validations.isNumber(NaN);           // false
validations.isNumber(Infinity);      // false

// Boolean validation
validations.isBoolean(true);         // true
validations.isBoolean(false);        // true
validations.isBoolean(0);            // false
validations.isBoolean("true");       // false
```

### Complex Type Checks

Check for more complex JavaScript types:

```javascript
// Array validation
validations.isArray([1, 2, 3]);      // true
validations.isArray("array");        // false
validations.isArray({});             // false

// Object validation (plain objects, not arrays or null)
validations.isObject({});            // true
validations.isObject({ key: "value" }); // true
validations.isObject([]);            // false
validations.isObject(null);          // false

// Date validation
validations.isDate(new Date());      // true
validations.isDate("2023-01-01");    // false
validations.isDate(1640995200000);   // false
```

## String Format Validation

### Email Validation

Comprehensive email format checking:

```javascript
// Valid emails
validations.isEmail("user@example.com");           // true
validations.isEmail("test.email@domain.co.uk");    // true
validations.isEmail("user+tag@example.com");       // true

// Invalid emails
validations.isEmail("invalid-email");              // false
validations.isEmail("user@");                      // false
validations.isEmail("@domain.com");                // false
validations.isEmail("user@domain");                // false
```

### Date Format Validation

Check for specific date string formats:

```javascript
// YYYY-MM-DD format validation
validations.isDateYYYYMMDD("2023-12-25");    // true
validations.isDateYYYYMMDD("2023-1-1");      // false
validations.isDateYYYYMMDD("12/25/2023");    // false
validations.isDateYYYYMMDD("2023-13-01");    // false (invalid month)
```

### Color Format Validation

Validate hexadecimal color codes:

```javascript
// Hexadecimal color validation
validations.isHex("#FF0000");        // true (red)
validations.isHex("#ff0000");        // true (case insensitive)
validations.isHex("#F00");           // true (short format)
validations.isHex("FF0000");         // false (missing #)
validations.isHex("#GG0000");        // false (invalid hex)
```

## Length Validation

### Exact Length

Check for precise length requirements:

```javascript
// String length
validations.lengthIs("hello", 5);       // true
validations.lengthIs("hi", 5);          // false

// Array length
validations.lengthIs([1, 2, 3], 3);     // true
validations.lengthIs([1, 2], 3);        // false
```

### Minimum Length

Ensure minimum length requirements:

```javascript
// String minimum length
validations.lengthMin("password", 8);    // true
validations.lengthMin("pass", 8);        // false

// Array minimum length
validations.lengthMin([1, 2, 3], 2);     // true
validations.lengthMin([1], 2);           // false
```

### Maximum Length

Ensure values don't exceed maximum length:

```javascript
// String maximum length
validations.lengthMax("hello", 10);      // true
validations.lengthMax("very long string", 10); // false

// Array maximum length
validations.lengthMax([1, 2], 5);        // true
validations.lengthMax([1, 2, 3, 4, 5, 6], 5); // false
```

## Number Comparisons

### Greater Than or Equal

```javascript
// Number >= comparison
validations.isNumberGte(10, 5);      // true (10 >= 5)
validations.isNumberGte(5, 10);      // false (5 >= 10)
validations.isNumberGte(5, 5);       // true (5 >= 5)

// Works with decimals
validations.isNumberGte(3.14, 3);    // true
validations.isNumberGte(2.9, 3);     // false
```

### Less Than

```javascript
// Number < comparison  
validations.isNumberLt(5, 10);       // true (5 < 10)
validations.isNumberLt(10, 5);       // false (10 < 5)
validations.isNumberLt(5, 5);        // false (5 < 5)

// Works with decimals
validations.isNumberLt(2.9, 3);      // true
validations.isNumberLt(3.1, 3);      // false
```

## Date Comparisons

### Date Less Than or Equal

```javascript
const date1 = new Date('2023-01-01');
const date2 = new Date('2023-12-31');

// date1 <= date2
validations.isDateLte(date1, date2);  // true
validations.isDateLte(date2, date1);  // false

// Equal dates
const date3 = new Date('2023-01-01');
validations.isDateLte(date1, date3);  // true
```

### Date Greater Than

```javascript
const yesterday = new Date('2023-01-01');
const today = new Date('2023-01-02');

// today > yesterday
validations.isDateGt(today, yesterday);    // true
validations.isDateGt(yesterday, today);    // false

// Equal dates
const anotherToday = new Date('2023-01-02');
validations.isDateGt(today, anotherToday); // false
```

## Equality and Inequality

### Deep Equality Check

Compare values deeply, including objects and arrays:

```javascript
// Primitive values
validations.is("hello", "hello");     // true
validations.is(42, 42);              // true
validations.is(true, true);          // true

// Objects
validations.is({ a: 1 }, { a: 1 });  // true
validations.is({ a: 1 }, { a: 2 });  // false

// Arrays
validations.is([1, 2, 3], [1, 2, 3]); // true
validations.is([1, 2], [1, 2, 3]);    // false

// Nested structures
validations.is(
  { users: [{ name: "John" }] },
  { users: [{ name: "John" }] }
); // true
```

### Inequality Check

Verify values are different:

```javascript
// Simple inequality
validations.not("hello", "world");    // true
validations.not("hello", "hello");    // false

// Object inequality
validations.not({ a: 1 }, { a: 2 }); // true
validations.not({ a: 1 }, { a: 1 }); // false
```

## Regular Expression Testing

Test strings against regex patterns:

```javascript
// Basic regex testing
validations.regexTested("123", /^\d+$/);          // true (digits only)
validations.regexTested("abc", /^\d+$/);          // false

// Complex patterns
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
validations.regexTested("user@example.com", emailPattern); // true

// Phone number pattern
const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
validations.regexTested("123-456-7890", phonePattern);     // true
validations.regexTested("1234567890", phonePattern);       // false
```

## Practical Examples

### Form Validation Helper

```javascript
class FormValidator {
  static validateEmail(email) {
    return {
      isValid: validations.isString(email) && validations.isEmail(email),
      message: !validations.isString(email) 
        ? "Email must be a string"
        : !validations.isEmail(email) 
        ? "Please enter a valid email address"
        : ""
    };
  }
  
  static validatePassword(password) {
    const isString = validations.isString(password);
    const hasMinLength = isString && validations.lengthMin(password, 8);
    const hasMaxLength = isString && validations.lengthMax(password, 128);
    
    let message = "";
    if (!isString) {
      message = "Password must be a string";
    } else if (!hasMinLength) {
      message = "Password must be at least 8 characters";
    } else if (!hasMaxLength) {
      message = "Password cannot exceed 128 characters";
    }
    
    return {
      isValid: isString && hasMinLength && hasMaxLength,
      message
    };
  }
  
  static validateAge(age) {
    const isNumber = validations.isNumber(age);
    const isValidRange = isNumber && 
      validations.isNumberGte(age, 13) && 
      validations.isNumberLt(age, 150);
    
    return {
      isValid: isNumber && isValidRange,
      message: !isNumber 
        ? "Age must be a number"
        : !isValidRange
        ? "Age must be between 13 and 149"
        : ""
    };
  }
}

// Usage
const emailCheck = FormValidator.validateEmail("user@example.com");
const passwordCheck = FormValidator.validatePassword("mypassword123");
const ageCheck = FormValidator.validateAge(25);
```

### Data Sanitization

```javascript
class DataSanitizer {
  static sanitizeString(value, maxLength = 255) {
    if (!validations.isString(value)) {
      return "";
    }
    
    return validations.lengthMax(value, maxLength) 
      ? value.trim() 
      : value.substring(0, maxLength).trim();
  }
  
  static sanitizeNumber(value, min = 0, max = Number.MAX_SAFE_INTEGER) {
    if (!validations.isNumber(value)) {
      return null;
    }
    
    if (!validations.isNumberGte(value, min)) {
      return min;
    }
    
    if (value > max) {
      return max;
    }
    
    return value;
  }
  
  static sanitizeArray(value, maxLength = 100) {
    if (!validations.isArray(value)) {
      return [];
    }
    
    return validations.lengthMax(value, maxLength)
      ? value
      : value.slice(0, maxLength);
  }
}

// Usage
const cleanString = DataSanitizer.sanitizeString("  hello world  ", 50);
const cleanNumber = DataSanitizer.sanitizeNumber(-5, 0, 100); // Returns 0
const cleanArray = DataSanitizer.sanitizeArray([1, 2, 3, 4, 5], 3); // [1, 2, 3]
```

### Custom Validation Rules

```javascript
class CustomValidations {
  static isCreditCard(value) {
    if (!validations.isString(value)) return false;
    
    // Remove spaces and dashes
    const cleaned = value.replace(/[\s-]/g, '');
    
    // Check if it's all digits and reasonable length
    if (!validations.regexTested(cleaned, /^\d{13,19}$/)) {
      return false;
    }
    
    // Basic Luhn algorithm check
    let sum = 0;
    let isEven = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i));
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  }
  
  static isUSPhoneNumber(value) {
    if (!validations.isString(value)) return false;
    
    const phonePattern = /^(\+1\s?)?(\([0-9]{3}\)\s?|[0-9]{3}[-.\s]?)[0-9]{3}[-.\s]?[0-9]{4}$/;
    return validations.regexTested(value, phonePattern);
  }
  
  static isStrongPassword(password) {
    if (!validations.isString(password)) return false;
    if (!validations.lengthMin(password, 8)) return false;
    
    const hasUpper = validations.regexTested(password, /[A-Z]/);
    const hasLower = validations.regexTested(password, /[a-z]/);
    const hasNumber = validations.regexTested(password, /\d/);
    const hasSpecial = validations.regexTested(password, /[!@#$%^&*(),.?":{}|<>]/);
    
    return hasUpper && hasLower && hasNumber && hasSpecial;
  }
}

// Usage
console.log(CustomValidations.isCreditCard("4111-1111-1111-1111")); // true
console.log(CustomValidations.isUSPhoneNumber("(555) 123-4567")); // true
console.log(CustomValidations.isStrongPassword("SecurePass123!")); // true
```

### Batch Validation

```javascript
class BatchValidator {
  static validateMultiple(validators) {
    const results = [];
    let allValid = true;
    
    for (const [name, validator, value] of validators) {
      const isValid = validator(value);
      results.push({ name, value, isValid });
      
      if (!isValid) {
        allValid = false;
      }
    }
    
    return {
      allValid,
      results,
      validCount: results.filter(r => r.isValid).length,
      invalidCount: results.filter(r => !r.isValid).length
    };
  }
}

// Usage
const validationSet = [
  ['email', validations.isEmail, 'user@example.com'],
  ['age', (v) => validations.isNumber(v) && validations.isNumberGte(v, 18), 25],
  ['name', (v) => validations.isString(v) && validations.lengthMin(v, 2), 'John']
];

const batchResult = BatchValidator.validateMultiple(validationSet);
console.log(batchResult.allValid); // true/false
console.log(batchResult.results);  // Individual results
```

## Performance Considerations

1. **Use built-in utilities** instead of recreating validation logic
2. **Cache regex patterns** when using `regexTested` repeatedly
3. **Combine checks efficiently** - fail fast on the most likely failures
4. **Use appropriate utilities** - `lengthMin` is more efficient than checking length manually

## TypeScript Support

Built-in utilities work seamlessly with TypeScript:

```typescript
import { validations } from 'validno';

// Type guards
function isValidEmail(value: unknown): value is string {
  return validations.isString(value) && validations.isEmail(value);
}

function isPositiveNumber(value: unknown): value is number {
  return validations.isNumber(value) && validations.isNumberGte(value, 0);
}

// Usage with type safety
const userInput: unknown = getUserInput();

if (isValidEmail(userInput)) {
  // userInput is now typed as string
  console.log(userInput.toLowerCase());
}
```

## Next Steps

- Learn about [Examples](/examples) for common use case patterns
- See [Advanced Examples](/advanced-examples) for complex validation scenarios
- Explore [API Reference](/api-reference) for complete utility documentation