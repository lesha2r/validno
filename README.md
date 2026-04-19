# Validno

[![npm version](https://img.shields.io/npm/v/validno.svg)](https://www.npmjs.com/package/validno)
[![bundle size](https://img.shields.io/bundlephobia/minzip/validno)](https://bundlephobia.com/package/validno)
[![license](https://img.shields.io/npm/l/validno.svg)](https://github.com/lesha2r/validno/blob/main/LICENSE)

A lightweight and flexible TypeScript validation library for Node.js applications.

## Why Validno?

- 🪶 **Tiny footprint** — Just 4.2 KB gzipped
- 🎯 **Simple API** — Declarative schema definition, no method chaining
- 💬 **Flexible messages** — Inline, shorthand, or callback-based error messages
- 📦 **Zero dependencies** — No bloat in your node_modules

> 🚀 **Used in production** — Validno is the default validation library powering [Kodzero](https://kodzero.pro), an app constructor platform.

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
- **Inline Error Messages**: Zod-like syntax for attaching messages directly to rules
- **Required Message Shorthand**: Simple `requiredMessage` field for missing field errors
- **Custom Message Callbacks**: Advanced callback function for dynamic error messages
- **Partial Validation**: Validate only specific keys when needed
- **TypeScript Support**: Written in TypeScript with full type definitions

## Schema Definition

### Basic Schema Structure

```javascript
const schema = new Schema({
  fieldName: {
    type: String,           // Required: field type
    required: true,         // Optional: whether field is required (default: true)
    rules: {},              // Optional: validation rules (supports inline messages)
    title: "Field Name",    // Optional: human-readable field name
    requiredMessage: "...", // Optional: custom message for missing required field
    customMessage: (details) => "Custom error" // Optional: custom error callback
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

### Inline Rule Messages

Attach error messages directly to rules for cleaner, more ergonomic validation:

```javascript
const schema = new Schema({
  email: {
    type: String,
    required: true,
    rules: {
      isEmail: { value: true, message: 'Please enter a valid email address' },
      lengthMinMax: { value: [5, 100], message: 'Email must be between 5 and 100 characters' }
    }
  },
  password: {
    type: String,
    required: true,
    rules: {
      lengthMinMax: { value: [8, 100], message: 'Password must be at least 8 characters' }
    }
  },
  age: {
    type: Number,
    required: false,
    rules: {
      min: { value: 18, message: 'You must be at least 18 years old' }
    }
  }
});
```

You can also mix inline messages with simple rule syntax:

```javascript
const schema = new Schema({
  email: {
    type: String,
    required: true,
    rules: {
      isEmail: { value: true, message: 'Invalid email format' },
      lengthMin: 5  // Uses default error message
    }
  }
});
```

### Required Message Shorthand

For the common case of required field validation, use the `requiredMessage` shorthand:

```javascript
const schema = new Schema({
  email: {
    type: String,
    required: true,
    requiredMessage: 'Please enter your email address'
  },
  name: {
    type: String,
    required: true,
    requiredMessage: 'Name is required'
  }
});

const result = schema.validate({});
// result.errors = ['Please enter your email address', 'Name is required']
```

### Field-Level Custom Messages (Advanced)

For complex cases where the message depends on the actual value, use the `customMessage` callback:

```javascript
const schema = new Schema({
  email: {
    type: String,
    required: true,
    rules: {
      isEmail: true
    },
    customMessage: ({ keyword, value, key }) => {
      if (keyword === 'missing') {
        return `${key} is required`;
      }
      if (keyword === 'isEmail') {
        return `"${value}" is not a valid email address`;
      }
      return `Invalid value for ${key}`;
    }
  }
});
```

The `customMessage` function receives an object with:
- `keyword`: The validation rule that failed (`'missing'`, `'type'`, or rule name like `'isEmail'`)
- `value`: The actual value being validated
- `key`: The field name
- `title`: The field title (if specified)
- `reqs`: The field requirements object
- `schema`: The full schema object
- `rules`: The rules object for this field

### Message Priority

When multiple message options are specified, the priority is:
1. `customMessage` callback (highest priority)
2. Inline rule messages (for rules) / `requiredMessage` (for missing fields)
3. Default error messages (lowest priority)

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

## Comparison with Other Libraries

| Feature | Validno | Zod | Yup | Joi |
|---------|---------|-----|-----|-----|
| Inline rule messages | ✅ | ✅ | ❌ | ❌ |
| Nested object validation | ✅ | ✅ | ✅ | ✅ |
| Custom validators | ✅ | ✅ | ✅ | ✅ |
| TypeScript support | ✅ | ✅ | ✅ | ⚠️ |
| Zero dependencies | ✅ | ✅ | ❌ | ❌ |
| Bundle size (minified) | 13.6 KB | 261.6 KB | 42.7 KB | 171.9 KB |
| Bundle size (gzipped) | 4.2 KB | 57.1 KB | 13.1 KB | 52.8 KB |

## Migration Guide

### From callback-based messages to inline messages

**Before (callback approach):**
```javascript
const schema = new Schema({
  email: {
    type: String,
    required: true,
    rules: { isEmail: true },
    customMessage: ({ keyword }) => {
      if (keyword === 'isEmail') return 'Invalid email';
      return 'Error';
    }
  }
});
```

**After (inline approach):**
```javascript
const schema = new Schema({
  email: {
    type: String,
    required: true,
    requiredMessage: 'Email is required',
    rules: {
      isEmail: { value: true, message: 'Invalid email' }
    }
  }
});
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [lesha2r](https://github.com/lesha2r)