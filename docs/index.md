---
layout: home

hero:
  name: "Validno"
  text: "TypeScript Validation Library"
  tagline: "Lightweight and flexible runtime data validation for Node.js applications"
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/lesha2r/validno

features:
  - title: Type Safe
    details: Written in TypeScript with full type definitions and support for built-in and custom types
  - title: Flexible Rules
    details: Comprehensive set of validation rules for strings, numbers, arrays, and custom logic
  - title: Nested Objects
    details: Full support for nested object validation with intuitive schema definition
  - title: Custom Messages
    details: Define custom error messages for validation failures with detailed context
  - title: Partial Validation
    details: Validate only specific keys when needed for efficient partial updates
  - title: Zero Dependencies
    details: Lightweight library with no external dependencies, perfect for any Node.js project
---

## Quick Example

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

## Installation

```bash
npm i validno
```