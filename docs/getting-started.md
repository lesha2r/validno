# Installation & Quick Start

## Installation

Install Validno using npm:

```bash
npm i validno
```

## Quick Start

Here's a simple example to get you started with Validno:

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

## What's Validno?

Validno is a lightweight and flexible TypeScript validation library designed for Node.js applications. It provides:

- **Type Validation**: Support for built-in types and custom types
- **Flexible Rules**: Comprehensive validation rules for different data types
- **Nested Objects**: Full support for complex object structures
- **Custom Messages**: Define your own error messages
- **Partial Validation**: Validate only specific fields when needed
- **TypeScript Support**: Full type definitions included

## Next Steps

- Learn about [Schema Definition](/schema-definition) to understand how to structure your validation schemas
- Explore [Validation Rules](/string-rules) to see all available validation options
- Check out [Advanced Features](/nested-objects) for complex validation scenarios