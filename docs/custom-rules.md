# Custom Rules

When built-in validation rules aren't enough, you can create custom validation logic using the `custom` rule.

## Basic Custom Rules

Custom rules are functions that receive the value being validated and return either a boolean or a detailed result object:

```javascript
const schema = new Schema({
  password: {
    type: String,
    rules: {
      custom: (value) => {
        // Simple boolean return
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumbers = /\d/.test(value);
        
        return hasUpperCase && hasLowerCase && hasNumbers;
      }
    }
  }
});

// Valid: "Password123", "SecurePass1"
// Invalid: "password", "PASSWORD", "Password"
```

## Detailed Custom Rules

For better error messages, return an object with result and details:

```javascript
const schema = new Schema({
  password: {
    type: String,
    rules: {
      custom: (value, context) => {
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumbers = /\d/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        
        const checks = [
          { condition: hasUpperCase, message: "uppercase letter" },
          { condition: hasLowerCase, message: "lowercase letter" },
          { condition: hasNumbers, message: "number" },
          { condition: hasSpecialChar, message: "special character" }
        ];
        
        const failed = checks.filter(check => !check.condition);
        const isPassed = failed.length === 0;
        
        return {
          result: isPassed,
          details: isPassed ? '' : `Password must contain: ${failed.map(f => f.message).join(', ')}`
        };
      }
    }
  }
});
```

## Context Parameter

Custom rule functions receive a second parameter with useful context:

```javascript
const schema = new Schema({
  confirmPassword: {
    type: String,
    rules: {
      custom: (value, { schema, input }) => {
        // Access the original input data
        const password = input.password;
        
        return {
          result: value === password,
          details: value === password ? '' : 'Passwords do not match'
        };
      }
    }
  },
  password: {
    type: String,
    rules: {
      lengthMin: 8
    }
  }
});

// The context object contains:
// - schema: The full schema definition
// - input: The complete input data being validated
```

## Context Properties

The context parameter provides:

- `schema`: The complete schema definition
- `input`: The full input data object being validated

```javascript
const userSchema = new Schema({
  username: {
    type: String,
    rules: {
      custom: (value, { input, schema }) => {
        // Access other fields in the input
        const email = input.email;
        
        // Custom logic: username cannot be the same as email prefix
        if (email && email.includes('@')) {
          const emailPrefix = email.split('@')[0];
          if (value === emailPrefix) {
            return {
              result: false,
              details: 'Username cannot be the same as your email prefix'
            };
          }
        }
        
        return true;
      }
    }
  },
  email: {
    type: String,
    rules: {
      isEmail: true
    }
  }
});
```

## Advanced Custom Rules

### Cross-Field Validation
```javascript
const dateRangeSchema = new Schema({
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true,
    rules: {
      custom: (value, { input }) => {
        const startDate = new Date(input.startDate);
        const endDate = new Date(value);
        
        return {
          result: endDate >= startDate,
          details: endDate >= startDate ? '' : 'End date must be after start date'
        };
      }
    }
  }
});
```

### Complex Business Logic
```javascript
const orderSchema = new Schema({
  discountCode: {
    type: String,
    required: false,
    rules: {
      custom: (value, { input }) => {
        if (!value) return true; // Optional field
        
        const validCodes = ['SAVE10', 'WELCOME', 'VIP'];
        const totalAmount = input.totalAmount || 0;
        
        // VIP code only for orders over $100
        if (value === 'VIP' && totalAmount < 100) {
          return {
            result: false,
            details: 'VIP discount code requires minimum order of $100'
          };
        }
        
        return {
          result: validCodes.includes(value),
          details: validCodes.includes(value) ? '' : 'Invalid discount code'
        };
      }
    }
  },
  totalAmount: {
    type: Number,
    required: true,
    rules: {
      min: 0.01
    }
  }
});
```

### Async-like Validation (with external data)
```javascript
// Note: Custom rules are synchronous, but you can prepare data beforehand
const validUserIds = [1, 2, 3, 100, 101]; // This could come from a database query

const schema = new Schema({
  assignedUserId: {
    type: Number,
    rules: {
      custom: (value) => {
        return {
          result: validUserIds.includes(value),
          details: validUserIds.includes(value) ? '' : 'Invalid user ID'
        };
      }
    }
  }
});
```

## Common Custom Rule Patterns

### Credit Card Validation
```javascript
const paymentSchema = new Schema({
  creditCard: {
    type: String,
    rules: {
      custom: (value) => {
        // Basic Luhn algorithm check
        const clean = value.replace(/\s+/g, '');
        let sum = 0;
        let isEven = false;
        
        for (let i = clean.length - 1; i >= 0; i--) {
          let digit = parseInt(clean.charAt(i));
          
          if (isEven) {
            digit *= 2;
            if (digit > 9) {
              digit -= 9;
            }
          }
          
          sum += digit;
          isEven = !isEven;
        }
        
        return {
          result: sum % 10 === 0,
          details: sum % 10 === 0 ? '' : 'Invalid credit card number'
        };
      }
    }
  }
});
```

### Unique Array Elements
```javascript
const schema = new Schema({
  tags: {
    type: Array,
    eachType: String,
    rules: {
      custom: (value) => {
        const unique = [...new Set(value)];
        return {
          result: unique.length === value.length,
          details: unique.length === value.length ? '' : 'Tags must be unique'
        };
      }
    }
  }
});
```

### Age Validation with Birth Date
```javascript
const userSchema = new Schema({
  birthDate: {
    type: Date,
    required: true,
    rules: {
      custom: (value) => {
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ? age - 1
          : age;
        
        return {
          result: actualAge >= 13 && actualAge <= 120,
          details: actualAge >= 13 && actualAge <= 120 ? '' : 'Age must be between 13 and 120 years'
        };
      }
    }
  }
});
```

## Best Practices

1. **Return detailed results** with helpful error messages
2. **Use context wisely** to access other fields when needed
3. **Keep logic focused** - one custom rule per specific validation concern
4. **Handle edge cases** like null, undefined, or empty values
5. **Consider performance** - custom rules run for every validation

## Error Handling in Custom Rules

```javascript
const schema = new Schema({
  data: {
    type: String,
    rules: {
      custom: (value) => {
        try {
          // Some operation that might fail
          const parsed = JSON.parse(value);
          
          return {
            result: parsed && typeof parsed === 'object',
            details: parsed && typeof parsed === 'object' ? '' : 'Must be valid JSON object'
          };
        } catch (error) {
          return {
            result: false,
            details: 'Invalid JSON format'
          };
        }
      }
    }
  }
});
```

## Combining with Other Rules

Custom rules work alongside built-in rules:

```javascript
const schema = new Schema({
  username: {
    type: String,
    rules: {
      lengthMin: 3,        // Built-in rule
      lengthMax: 20,       // Built-in rule
      regex: /^[a-zA-Z0-9_]+$/, // Built-in rule
      custom: (value) => {  // Custom rule
        const bannedNames = ['admin', 'root', 'test'];
        return {
          result: !bannedNames.includes(value.toLowerCase()),
          details: !bannedNames.includes(value.toLowerCase()) ? '' : 'This username is not available'
        };
      }
    }
  }
});
```

## Next Steps

- Learn about [Enum Validation](/enum-validation) for controlled value sets
- Explore [Custom Messages](/custom-messages) for field-level error customization
- See [Validation Results](/validation-results) to understand how custom rule errors are returned