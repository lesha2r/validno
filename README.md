# Validno

A lightweight and flexible TypeScript validation library for Node.js applications.

## Documentation

Check out docs at [https://validno.kodzero.pro](https://validno.kodzero.pro)

## Installation

```bash
npm i validno
```

## Quick Start

```javascript
import Schema from 'validno';

// Define your schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    rules: {
      lengthMin: 2,
      lengthMax: 50
    }
  },
  email: {
    type: String,
    required: true,
    rules: {
      isEmail: true
    }
  },
  age: {
    type: Number,
    required: false,
    rules: {
      min: 18,
      max: 120
    }
  }
});

// Validate data
const userData = {
  name: "Barney Stinson",
  email: "barney@himym.com",
  age: 35
};

const result = userSchema.validate(userData);

if (result.ok) {
  console.log('Validation passed!');
} else {
  console.log('Errors:', result.errors);
}
```

## Features

- **Type Validation**: Support for built-in types (String, Number, Boolean, Array, Object, Date, RegExp) and custom types
- **Flexible Rules**: Comprehensive set of validation rules for strings, numbers, arrays, and custom logic
- **Nested Objects**: Full support for nested object validation
- **Custom Messages**: Define custom error messages for validation failures
- **Partial Validation**: Validate only specific keys when needed
- **TypeScript Support**: Written in TypeScript with full type definitions

## Schema Definition

### Basic Schema Structure

```javascript
const schema = new Schema({
  fieldName: {
    type: String,           // Required: field type
    required: true,         // Optional: whether field is required (default: true)
    rules: {},             // Optional: validation rules
    title: "Field Name",   // Optional: human-readable field name (only used in custom messages for now)
    customMessage: (details) => "Custom error" // Optional: custom error function
  }
});
```

### Supported Types

```javascript
const schema = new Schema({
  stringField: { type: String },
  numberField: { type: Number },
  booleanField: { type: Boolean },
  arrayField: { type: Array },
  objectField: { type: Object },
  dateField: { type: Date },
  regexField: { type: RegExp },
  nullField: { type: null },
  
  // Union types (multiple allowed types)
  mixedField: { type: [String, Number] },
  
  // Custom classes
  customField: { type: MyCustomClass },
  
  // Any type
  anyField: { type: 'any' }
});
```

### Array Type Validation

```javascript
const schema = new Schema({
  // Array of any items
  items: { type: Array },
  
  // Array where each item must be a specific type
  numbers: { 
    type: Array, 
    eachType: Number, 
  }
});
```

## Validation Rules

### String Rules

```javascript
const schema = new Schema({
  text: {
    type: String,
    rules: {
      // Length validations
      length: 10,              // Exact length
      lengthMin: 5,           // Minimum length
      lengthMax: 100,         // Maximum length
      lengthMinMax: [5, 100], // Length range
      lengthNot: 0,           // Not this length
      
      // Format validations
      isEmail: true,          // Valid email format
      regex: /^[A-Z]+$/,      // Custom regex pattern
      
      // Value comparisons
      is: "exact value",      // Must equal this value
      isNot: "forbidden"      // Must not equal this value
    }
  }
});
```

### Number Rules

```javascript
const schema = new Schema({
  count: {
    type: Number,
    rules: {
      min: 0,              // Minimum value (>=)
      max: 100,            // Maximum value (<=)
      minMax: [0, 100],    // Value range
      is: 42,              // Must equal this value
      isNot: 0             // Must not equal this value
    }
  }
});
```

### Array Rules

```javascript
const schema = new Schema({
  items: {
    type: Array,
    rules: {
      length: 5,              // Exact length
      lengthMin: 1,          // Minimum length
      lengthMax: 10,         // Maximum length
      lengthMinMax: [1, 10], // Length range
      enum: ['a', 'b', 'c']  // All items must be from this list
    }
  }
});
```

### Custom Rules

```javascript
const schema = new Schema({
  password: {
    type: String,
    rules: {
      custom: (value, { schema, input }) => {
        // Custom validation logic
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumbers = /\d/.test(value);

        const isPassed = hasUpperCase && hasLowerCase && hasNumbers
        
        // Return true or false value...
        return isPassed

        // ...or provide details for the validation
        return {
          result: isPassed,
          details: isPassed ? '' : "Password must contain an uppercase letter, a lowercase letter, and a number"
        }
      }
    }
  }
});
```

### Enum Validation

```javascript
const schema = new Schema({
  status: {
    type: String,
    rules: {
      enum: ['active', 'inactive', 'pending']
    }
  }
});
```

## Nested Objects

```javascript
const schema = new Schema({
  user: {
    name: {
      type: String,
      required: true
    },
    address: {
      street: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      zipCode: {
        type: String,
        required: false,
        rules: {
          regex: /^\d{5}$/
        }
      }
    }
  }
});

const data = {
  user: {
    name: "Barney Stinson",
    address: {
      street: "123 Main St",
      city: "New York",
      zipCode: "10001"
    }
  }
};

const result = schema.validate(data);
```

## Custom Error Messages

### Field-Level Custom Messages

```javascript
const schema = new Schema({
  email: {
    type: String,
    required: true,
    rules: {
      isEmail: true
    },
    customMessage: ({ keyword, value, key }) => {
      if (keyword === 'isEmail') {
        return `Please enter a valid email address for ${key}`;
      }
      return `Invalid value for ${key}`;
    }
  }
});
```

### Custom Message Parameters

The `customMessage` function receives an object with:
- `keyword`: The validation rule that failed
- `value`: The actual value being validated
- `key`: The field name
- `title`: The field title (if specified)
- `reqs`: The field requirements object
- `schema`: The full schema object
- `rules`: The rules object for this field

## Partial Validation

Validate only specific fields:

```javascript
const schema = new Schema({
  name: { type: String },
  email: { type: String },
  phone: { type: String }
});

const data = { name: "Barney", email: "barney@himym.com" };

// Validate only the name field
const nameResult = schema.validate(data, 'name');

// Validate only name and email fields
const partialResult = schema.validate(data, ['name', 'email']);
```

## Validation Result

The `validate` method returns a result object with:

```javascript
{
  ok: boolean,                    // Overall validation success
  passed: string[],              // Array of field names that passed
  failed: string[],              // Array of field names that failed
  missed: string[],              // Array of required fields that were missing
  errors: string[],              // Array of all error messages
  byKeys: {                      // Validation status by field name
    fieldName: boolean
  },
  errorsByKeys: {                // Error messages by field name
    fieldName: string[]
  },
  joinErrors: (separator?) => string  // Method to join all errors
}
```

### Using the Result

```javascript
const result = schema.validate(data);

if (result.ok) {
  console.log('All validations passed!');
} else {
  console.log('Failed fields:', result.failed);
  console.log('Missing fields:', result.missed);
  console.log('All errors:', result.joinErrors(', '));
  
  // Check specific field
  if (!result.byKeys.email) {
    console.log('Email errors:', result.errorsByKeys.email);
  }
}
```

## Built-in Validation Utilities

Validno exports validation utilities that you can use independently:

```javascript
import { validations } from 'validno';

// Type checks
validations.isString(value);
validations.isNumber(value);
validations.isArray(value);
validations.isObject(value);
validations.isDate(value);
validations.isBoolean(value);

// String format validation
validations.isEmail(email);
validations.isDateYYYYMMDD(dateString);
validations.isHex(colorCode);

// Length validation
validations.lengthIs(value, 5);
validations.lengthMin(value, 2);
validations.lengthMax(value, 10);

// Number comparisons
validations.isNumberGte(value, 10);
validations.isNumberLt(value, 100);

// Date comparisons
validations.isDateLte(date1, date2);
validations.isDateGt(date1, date2);

// Deep equality
validations.is(obj1, obj2);
validations.not(value1, value2);

// Regular expressions
validations.regexTested(string, /pattern/);
```

## Advanced Examples

### Complex Nested Validation

```javascript
const orderSchema = new Schema({
  orderId: {
    type: String,
    required: true,
    rules: {
      regex: /^ORD-\d{6}$/
    }
  },
  customer: {
    id: {
      type: Number,
      required: true,
      rules: {
        min: 1
      }
    },
    profile: {
      firstName: {
        type: String,
        required: true,
        rules: {
          lengthMin: 2,
          lengthMax: 50
        }
      },
      lastName: {
        type: String,
        required: true,
        rules: {
          lengthMin: 2,
          lengthMax: 50
        }
      },
      email: {
        type: String,
        required: true,
        rules: {
          isEmail: true
        }
      }
    }
  },
  items: {
    type: Array,
    eachType: Object,
    required: true,
    rules: {
      lengthMin: 1
    }
  },
  totalAmount: {
    type: Number,
    required: true,
    rules: {
      min: 0.01
    }
  },
  status: {
    type: String,
    required: true,
    rules: {
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    }
  }
});
```

## TypeScript Support

Validno is written in TypeScript and provides full type definitions:

```typescript
import Schema from 'validno';
import { SchemaDefinition, FieldSchema } from 'validno';

interface User {
  name: string;
  email: string;
  age?: number;
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  } as FieldSchema,
  email: {
    type: String,
    required: true,
    rules: {
      isEmail: true
    }
  } as FieldSchema,
  age: {
    type: Number,
    required: false
  } as FieldSchema
} as SchemaDefinition);

const newUser = {
  name: "Barney",
  email: "barney@himym.com",
}

// Use generic type...
const result = userSchema.validate<User>(newUser, ['name', 'email'])

// ...or use automatic type inference based on the object
const result = userSchema.validate(newUser, ['name', 'email'])
```