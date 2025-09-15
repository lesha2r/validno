# API Reference

Complete API reference for Validno's classes, methods, and utilities.

## Schema Class

### Constructor

```typescript
new Schema(definition: SchemaDefinition)
```

Creates a new validation schema.

**Parameters:**
- `definition`: Object defining the validation schema structure

**Example:**
```javascript
const schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, rules: { isEmail: true } }
});
```

### Methods

#### `validate<T, K extends keyof T = keyof T>(inputData: T, validationKeys?: K | K[]): ValidnoResult`

Validates input data against the schema.

**Parameters:**
- `inputData`: The data to validate
- `validationKeys` (optional): Single field name or array of field names to validate

**Returns:** `ValidnoResult` object

**Examples:**
```javascript
// Validate all fields
const result = schema.validate(data);

// Validate single field
const result = schema.validate(data, 'email');

// Validate multiple fields
const result = schema.validate(data, ['name', 'email']);
```

## Schema Definition Structure

### Field Schema

```typescript
interface FieldSchema {
  type: TypeDefinition;
  required?: boolean;
  rules?: ValidationRules;
  title?: string;
  customMessage?: (context: MessageContext) => string;
  eachType?: TypeDefinition; // For arrays
}
```

### Type Definition

```typescript
type TypeDefinition = 
  | StringConstructor    // String
  | NumberConstructor    // Number  
  | BooleanConstructor   // Boolean
  | ArrayConstructor     // Array
  | ObjectConstructor    // Object
  | DateConstructor      // Date
  | RegExpConstructor    // RegExp
  | null                 // null type
  | 'any'               // any type
  | Function            // Custom constructor
  | TypeDefinition[]    // Union types
```

### Validation Rules

```typescript
interface ValidationRules {
  // String rules
  length?: number;
  lengthMin?: number;
  lengthMax?: number;
  lengthMinMax?: [number, number];
  lengthNot?: number;
  isEmail?: boolean;
  regex?: RegExp;
  is?: any;
  isNot?: any;
  
  // Number rules  
  min?: number;
  max?: number;
  minMax?: [number, number];
  
  // Array rules
  enum?: any[];
  
  // Custom rules
  custom?: (value: any, context: ValidationContext) => boolean | ValidationResult;
}
```

### Custom Message Context

```typescript
interface MessageContext {
  keyword: string;     // The failed validation rule
  value: any;         // The value being validated
  key: string;        // The field name
  title?: string;     // The field title (if specified)
  reqs: FieldSchema;  // The field requirements
  schema: SchemaDefinition; // The full schema
  rules: ValidationRules;   // The field rules
}
```

### Validation Context

```typescript
interface ValidationContext {
  schema: SchemaDefinition; // The full schema definition
  input: any;              // The complete input data
}
```

### Custom Rule Result

```typescript
interface ValidationResult {
  result: boolean;  // Whether validation passed
  details: string;  // Error message if validation failed
}
```

## ValidnoResult Class

The result object returned by `schema.validate()`.

### Properties

```typescript
interface ValidnoResult {
  ok: boolean;                    // Overall validation success
  passed: string[];              // Fields that passed validation
  failed: string[];              // Fields that failed validation
  missed: string[];              // Required fields that were missing
  errors: string[];              // All error messages
  byKeys: Record<string, boolean>;        // Validation status by field
  errorsByKeys: Record<string, string[]>; // Errors by field
  joinErrors(separator?: string): string; // Join all errors
}
```

### Methods

#### `joinErrors(separator?: string): string`

Joins all error messages into a single string.

**Parameters:**
- `separator` (optional): String to separate errors (default: `'; '`)

**Returns:** Joined error string

**Example:**
```javascript
const result = schema.validate(invalidData);
console.log(result.joinErrors(', ')); // "Error 1, Error 2, Error 3"
```

## Built-in Validations

Validno exports validation utilities for standalone use:

```javascript
import { validations } from 'validno';
```

### Type Checks

```typescript
validations.isString(value: any): boolean
validations.isNumber(value: any): boolean
validations.isArray(value: any): boolean
validations.isObject(value: any): boolean
validations.isDate(value: any): boolean
validations.isBoolean(value: any): boolean
```

### String Format Validation

```typescript
validations.isEmail(email: string): boolean
validations.isDateYYYYMMDD(dateString: string): boolean
validations.isHex(colorCode: string): boolean
```

### Length Validation

```typescript
validations.lengthIs(value: string | any[], length: number): boolean
validations.lengthMin(value: string | any[], minLength: number): boolean
validations.lengthMax(value: string | any[], maxLength: number): boolean
```

### Number Comparisons

```typescript
validations.isNumberGte(value: number, min: number): boolean
validations.isNumberLt(value: number, max: number): boolean
```

### Date Comparisons

```typescript
validations.isDateLte(date1: Date, date2: Date): boolean
validations.isDateGt(date1: Date, date2: Date): boolean
```

### Equality Checks

```typescript
validations.is(obj1: any, obj2: any): boolean      // Deep equality
validations.not(value1: any, value2: any): boolean // Inequality
```

### Regular Expression

```typescript
validations.regexTested(string: string, pattern: RegExp): boolean
```

## Constants

### Schema Fields

```javascript
import { SchemaFields } from 'validno';

// Available schema field properties
SchemaFields.TYPE        // 'type'
SchemaFields.REQUIRED    // 'required'  
SchemaFields.RULES       // 'rules'
SchemaFields.TITLE       // 'title'
SchemaFields.CUSTOM_MESSAGE // 'customMessage'
SchemaFields.EACH_TYPE   // 'eachType'
```

## Error Keywords

Common validation error keywords used in custom messages:

- `'required'` - Field is required but missing
- `'type'` - Value is wrong type
- `'length'` - String/array length doesn't match exact requirement
- `'lengthMin'` - String/array is too short
- `'lengthMax'` - String/array is too long
- `'lengthMinMax'` - String/array length outside range
- `'lengthNot'` - String/array has forbidden length
- `'isEmail'` - String is not valid email format
- `'regex'` - String doesn't match regex pattern
- `'is'` - Value doesn't match required value
- `'isNot'` - Value matches forbidden value
- `'min'` - Number is below minimum
- `'max'` - Number is above maximum
- `'minMax'` - Number is outside range
- `'enum'` - Value is not in allowed list
- `'custom'` - Custom validation rule failed

## TypeScript Types

### Import Types

```typescript
import { 
  SchemaDefinition,
  FieldSchema,
  ValidationRules,
  ValidnoResult,
  MessageContext,
  ValidationContext
} from 'validno';
```

### Usage with Types

```typescript
interface User {
  name: string;
  email: string;
  age?: number;
}

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, rules: { isEmail: true } },
  age: { type: Number, required: false }
} as SchemaDefinition);

// Type-safe validation
const result = userSchema.validate<User>(userData);
const partialResult = userSchema.validate<User, 'email'>(userData, 'email');
```

## Examples

### Complete Schema Example

```javascript
import Schema, { validations } from 'validno';

const userSchema = new Schema({
  // Required string with length constraints
  username: {
    type: String,
    required: true,
    title: "Username",
    rules: {
      lengthMin: 3,
      lengthMax: 20,
      regex: /^[a-zA-Z0-9_]+$/,
      isNot: "admin"
    },
    customMessage: ({ keyword, rules, title }) => {
      switch (keyword) {
        case 'lengthMin':
          return `${title} must be at least ${rules.lengthMin} characters`;
        case 'regex':
          return `${title} can only contain letters, numbers, and underscores`;
        default:
          return `Invalid ${title.toLowerCase()}`;
      }
    }
  },
  
  // Email validation
  email: {
    type: String,
    required: true,
    rules: {
      isEmail: true,
      lengthMax: 100
    }
  },
  
  // Optional number with range
  age: {
    type: Number,
    required: false,
    rules: {
      min: 13,
      max: 120
    }
  },
  
  // Array with enum values
  interests: {
    type: Array,
    eachType: String,
    required: false,
    rules: {
      enum: ['technology', 'sports', 'music', 'travel'],
      lengthMax: 5
    }
  },
  
  // Custom validation
  password: {
    type: String,
    required: true,
    rules: {
      lengthMin: 8,
      custom: (value) => {
        const hasUpper = /[A-Z]/.test(value);
        const hasLower = /[a-z]/.test(value);
        const hasNumber = /\d/.test(value);
        
        return {
          result: hasUpper && hasLower && hasNumber,
          details: hasUpper && hasLower && hasNumber 
            ? '' 
            : 'Password must contain uppercase, lowercase, and number'
        };
      }
    }
  }
});

// Validation
const userData = {
  username: "john_doe",
  email: "john@example.com",
  age: 25,
  interests: ["technology", "sports"],
  password: "SecurePass123"
};

const result = userSchema.validate(userData);
```

### Using Built-in Validations

```javascript
import { validations } from 'validno';

// Type checks
console.log(validations.isEmail("test@example.com")); // true
console.log(validations.isString(123)); // false
console.log(validations.isArray([1, 2, 3])); // true

// Length validation
console.log(validations.lengthMin("hello", 3)); // true
console.log(validations.lengthMax([1, 2, 3], 5)); // true

// Number comparisons
console.log(validations.isNumberGte(10, 5)); // true
console.log(validations.isNumberLt(3, 10)); // true

// Regular expressions
console.log(validations.regexTested("123", /^\d+$/)); // true
```

## Migration Guide

### From Version 0.2.x to 0.3.x

No breaking changes in the public API. All existing code should work without modifications.

### Best Practices

1. **Always import the default export** for the Schema class
2. **Use TypeScript types** for better development experience
3. **Handle validation results properly** by checking `result.ok`
4. **Leverage built-in validations** for common validation tasks
5. **Use custom messages** for better user experience

## Next Steps

- Explore [Built-in Utilities](/built-in-utilities) for standalone validation functions
- Check [Advanced Examples](/advanced-examples) for complex use cases
