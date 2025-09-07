# Nested Objects

Validno provides full support for validating complex nested object structures, allowing you to create comprehensive validation schemas for deeply nested data.

## Basic Nested Validation

Define nested objects by creating sub-schemas within your main schema:

```javascript
const schema = new Schema({
  user: {
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
    }
  }
});

const data = {
  user: {
    name: "John Doe",
    email: "john@example.com"
  }
};

const result = schema.validate(data);
```

## Multi-Level Nesting

You can nest objects multiple levels deep:

```javascript
const orderSchema = new Schema({
  order: {
    id: {
      type: String,
      required: true
    },
    customer: {
      profile: {
        firstName: {
          type: String,
          required: true,
          rules: {
            lengthMin: 2
          }
        },
        lastName: {
          type: String,
          required: true,
          rules: {
            lengthMin: 2
          }
        },
        contact: {
          email: {
            type: String,
            required: true,
            rules: {
              isEmail: true
            }
          },
          phone: {
            type: String,
            required: false,
            rules: {
              regex: /^\d{3}-\d{3}-\d{4}$/
            }
          }
        }
      },
      preferences: {
        newsletter: {
          type: Boolean,
          required: false
        },
        notifications: {
          type: Array,
          rules: {
            enum: ['email', 'sms', 'push']
          }
        }
      }
    }
  }
});
```

## Nested Arrays with Objects

Validate arrays containing objects:

```javascript
const schema = new Schema({
  items: {
    type: Array,
    eachType: Object,
    rules: {
      lengthMin: 1
    }
  }
});

// For validating the structure of objects within the array,
// you would typically validate the array first, then validate 
// each object separately with its own schema
```

## Complex Example: E-commerce Order

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
    personalInfo: {
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
    },
    address: {
      street: {
        type: String,
        required: true,
        rules: {
          lengthMin: 5
        }
      },
      city: {
        type: String,
        required: true,
        rules: {
          lengthMin: 2
        }
      },
      zipCode: {
        type: String,
        required: true,
        rules: {
          regex: /^\d{5}(-\d{4})?$/
        }
      },
      country: {
        type: String,
        required: true,
        rules: {
          enum: ['US', 'CA', 'UK', 'DE', 'FR']
        }
      }
    }
  },
  
  payment: {
    method: {
      type: String,
      required: true,
      rules: {
        enum: ['credit_card', 'debit_card', 'paypal']
      }
    },
    amount: {
      type: Number,
      required: true,
      rules: {
        min: 0.01
      }
    },
    currency: {
      type: String,
      required: true,
      rules: {
        enum: ['USD', 'EUR', 'GBP', 'CAD']
      }
    }
  },
  
  shipping: {
    method: {
      type: String,
      rules: {
        enum: ['standard', 'express', 'overnight']
      }
    },
    trackingNumber: {
      type: String,
      required: false
    }
  }
});

// Example valid order data
const orderData = {
  orderId: "ORD-123456",
  customer: {
    id: 1001,
    personalInfo: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com"
    },
    address: {
      street: "123 Main Street",
      city: "New York",
      zipCode: "10001",
      country: "US"
    }
  },
  payment: {
    method: "credit_card",
    amount: 99.99,
    currency: "USD"
  }
};

const result = orderSchema.validate(orderData);
```

## Error Path Tracking

When nested validation fails, Validno provides clear error paths:

```javascript
const schema = new Schema({
  user: {
    profile: {
      email: {
        type: String,
        rules: {
          isEmail: true
        }
      }
    }
  }
});

const invalidData = {
  user: {
    profile: {
      email: "not-an-email" // Invalid email
    }
  }
};

const result = schema.validate(invalidData);
// The error will clearly indicate the path: user.profile.email
```

## Best Practices for Nested Validation

### 1. Keep Nesting Reasonable
Don't nest too deeply - it can become hard to manage:

```javascript
// Good: 2-3 levels
const goodSchema = new Schema({
  user: {
    profile: {
      contact: {
        email: { type: String }
      }
    }
  }
});

// Avoid: Too deep
const avoidSchema = new Schema({
  app: {
    user: {
      profile: {
        personal: {
          contact: {
            primary: {
              email: { type: String }
            }
          }
        }
      }
    }
  }
});
```

### 2. Use Descriptive Field Names
```javascript
const schema = new Schema({
  orderDetails: {
    customerInfo: {
      billingAddress: {
        streetAddress: { type: String },
        city: { type: String }
      }
    }
  }
});
```

### 3. Group Related Fields
```javascript
const userSchema = new Schema({
  // Personal information
  personalInfo: {
    firstName: { type: String },
    lastName: { type: String },
    birthDate: { type: Date }
  },
  
  // Contact information
  contactInfo: {
    email: { type: String, rules: { isEmail: true } },
    phone: { type: String }
  },
  
  // Account settings
  accountSettings: {
    newsletter: { type: Boolean },
    privacy: { type: String, rules: { enum: ['public', 'private'] } }
  }
});
```

### 4. Consider Optional Groups
```javascript
const profileSchema = new Schema({
  username: { type: String, required: true },
  
  // Optional social media links
  socialMedia: {
    twitter: { type: String, required: false },
    linkedin: { type: String, required: false },
    github: { type: String, required: false }
  }
});
```

## Working with Dynamic Nested Data

For highly dynamic nested structures, consider validating in stages:

```javascript
// First, validate the top-level structure
const topLevelSchema = new Schema({
  type: {
    type: String,
    rules: {
      enum: ['user', 'product', 'order']
    }
  },
  data: {
    type: Object,
    required: true
  }
});

// Then, based on the type, validate the nested data with specific schemas
const userDataSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, rules: { isEmail: true } }
});

const productDataSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, rules: { min: 0 } }
});
```

## Validation Tips

1. **Validate nested objects exist** before validating their properties
2. **Use consistent field naming** across nested levels
3. **Consider the user experience** - nested errors should be clear
4. **Test edge cases** like missing nested objects
5. **Keep validation logic focused** - one concern per nested level

## Next Steps

- Learn about [Custom Messages](/custom-messages) for better nested error messages
- Explore [Partial Validation](/partial-validation) for validating specific nested fields
- See [Validation Results](/validation-results) to understand nested error reporting
