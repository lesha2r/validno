# Enum Validation

Enum validation ensures that values are from a predefined set of allowed options. This is useful for status fields, categories, types, and any controlled vocabulary.

## Basic Enum Validation

Use the `enum` rule to specify allowed values:

```javascript
const schema = new Schema({
  status: {
    type: String,
    rules: {
      enum: ['active', 'inactive', 'pending']
    }
  }
});

// Valid: 'active', 'inactive', 'pending'
// Invalid: 'disabled', 'unknown', 'ACTIVE'
```

## String Enums

Most common use case - string values from a predefined list:

```javascript
const userSchema = new Schema({
  role: {
    type: String,
    rules: {
      enum: ['admin', 'user', 'moderator', 'guest']
    }
  },
  
  accountType: {
    type: String,
    rules: {
      enum: ['free', 'premium', 'enterprise']
    }
  },
  
  priority: {
    type: String,
    rules: {
      enum: ['low', 'medium', 'high', 'urgent']
    }
  }
});

// Valid data
const userData = {
  role: 'admin',
  accountType: 'premium',
  priority: 'high'
};
```

## Number Enums

Enum validation also works with numbers:

```javascript
const ratingSchema = new Schema({
  rating: {
    type: Number,
    rules: {
      enum: [1, 2, 3, 4, 5] // Only these numeric values allowed
    }
  },
  
  httpStatusCode: {
    type: Number,
    rules: {
      enum: [200, 201, 400, 401, 403, 404, 500]
    }
  }
});

// Valid: rating: 5, httpStatusCode: 404
// Invalid: rating: 6, httpStatusCode: 418
```

## Mixed Type Enums

You can mix different types in an enum:

```javascript
const schema = new Schema({
  value: {
    type: [String, Number, Boolean], // Union type
    rules: {
      enum: ['yes', 'no', 1, 0, true, false] // Mixed values
    }
  }
});

// Valid: 'yes', 'no', 1, 0, true, false
// Invalid: 'maybe', 2, null
```

## Array Enums

For arrays, enum validation ensures all elements are from the allowed set:

```javascript
const schema = new Schema({
  colors: {
    type: Array,
    rules: {
      enum: ['red', 'green', 'blue', 'yellow', 'orange']
    }
  }
});

// Valid: ['red'], ['red', 'blue'], ['green', 'yellow', 'orange']
// Invalid: ['purple'], ['red', 'pink'], ['blue', 'unknown']
```

## Case-Sensitive Validation

Enum validation is case-sensitive by default:

```javascript
const schema = new Schema({
  status: {
    type: String,
    rules: {
      enum: ['Active', 'Inactive']
    }
  }
});

// Valid: 'Active', 'Inactive'
// Invalid: 'active', 'ACTIVE', 'inactive'
```

For case-insensitive validation, use a custom rule:

```javascript
const schema = new Schema({
  status: {
    type: String,
    rules: {
      custom: (value) => {
        const allowedValues = ['active', 'inactive'];
        const isValid = allowedValues.includes(value.toLowerCase());
        
        return {
          result: isValid,
          details: isValid ? '' : `Status must be one of: ${allowedValues.join(', ')}`
        };
      }
    }
  }
});
```

## Common Use Cases

### User Roles and Permissions
```javascript
const userSchema = new Schema({
  role: {
    type: String,
    rules: {
      enum: ['super_admin', 'admin', 'editor', 'author', 'subscriber']
    }
  },
  
  permissions: {
    type: Array,
    rules: {
      enum: ['read', 'write', 'delete', 'publish', 'manage_users']
    }
  }
});
```

### Order Management
```javascript
const orderSchema = new Schema({
  status: {
    type: String,
    rules: {
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']
    }
  },
  
  paymentMethod: {
    type: String,
    rules: {
      enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery']
    }
  },
  
  priority: {
    type: Number,
    rules: {
      enum: [1, 2, 3, 4, 5] // 1 = lowest, 5 = highest
    }
  }
});
```

### Content Management
```javascript
const contentSchema = new Schema({
  type: {
    type: String,
    rules: {
      enum: ['article', 'video', 'podcast', 'infographic', 'tutorial']
    }
  },
  
  visibility: {
    type: String,
    rules: {
      enum: ['public', 'private', 'draft', 'scheduled']
    }
  },
  
  categories: {
    type: Array,
    rules: {
      enum: ['technology', 'business', 'health', 'education', 'entertainment']
    }
  }
});
```

### Geographic Data
```javascript
const locationSchema = new Schema({
  country: {
    type: String,
    rules: {
      enum: ['US', 'CA', 'UK', 'DE', 'FR', 'JP', 'AU'] // ISO codes
    }
  },
  
  timezone: {
    type: String,
    rules: {
      enum: [
        'America/New_York',
        'America/Los_Angeles', 
        'Europe/London',
        'Europe/Paris',
        'Asia/Tokyo',
        'Australia/Sydney'
      ]
    }
  }
});
```

### API Configuration
```javascript
const apiSchema = new Schema({
  method: {
    type: String,
    rules: {
      enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    }
  },
  
  version: {
    type: String,
    rules: {
      enum: ['v1', 'v2', 'v3']
    }
  },
  
  responseFormat: {
    type: String,
    rules: {
      enum: ['json', 'xml', 'csv']
    }
  }
});
```

## Combining Enum with Other Rules

Enum rules work alongside other validation rules:

```javascript
const schema = new Schema({
  // Required enum
  status: {
    type: String,
    required: true,
    rules: {
      enum: ['active', 'inactive']
    }
  },
  
  // Optional enum with length constraints
  category: {
    type: String,
    required: false,
    rules: {
      enum: ['tech', 'business', 'health'],
      lengthMin: 3 // Additional constraint (though redundant here)
    }
  },
  
  // Array enum with length constraints
  tags: {
    type: Array,
    rules: {
      enum: ['urgent', 'important', 'low-priority', 'archived'],
      lengthMin: 1,    // At least one tag
      lengthMax: 3     // At most three tags
    }
  }
});
```

## Dynamic Enums

For dynamic enum values (e.g., from database), prepare the enum array beforehand:

```javascript
// This could come from a database or API
const availableCategories = ['electronics', 'clothing', 'books', 'home', 'sports'];
const activeStatuses = ['published', 'draft', 'archived'];

const productSchema = new Schema({
  category: {
    type: String,
    rules: {
      enum: availableCategories
    }
  },
  
  status: {
    type: String,
    rules: {
      enum: activeStatuses
    }
  }
});
```

## Error Messages

Enum validation provides clear error messages:

```javascript
const schema = new Schema({
  priority: {
    type: String,
    rules: {
      enum: ['low', 'medium', 'high']
    }
  }
});

const result = schema.validate({ priority: 'urgent' });
// result.errors will contain information about the invalid enum value
```

## Best Practices

1. **Use descriptive enum values** that are self-explanatory
2. **Keep enum lists manageable** - too many options can be confusing
3. **Consider using constants** for enum values to avoid typos:

```javascript
const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending'
};

const schema = new Schema({
  status: {
    type: String,
    rules: {
      enum: Object.values(STATUS)
    }
  }
});
```

4. **Document enum meanings** when values aren't self-evident
5. **Use consistent naming patterns** (e.g., all lowercase, snake_case, etc.)

## Next Steps

- Learn about [Nested Objects](/nested-objects) for complex data structures
- Explore [Custom Messages](/custom-messages) for better enum error messages
- See [Partial Validation](/partial-validation) for validating specific enum fields