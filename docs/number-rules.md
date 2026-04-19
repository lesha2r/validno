# Number Rules

Number validation rules help ensure numeric data meets specific requirements for range, value, and precision.

## Range Validation

### Minimum Value
Set a minimum value (inclusive):

```javascript
const schema = new Schema({
  age: {
    type: Number,
    rules: {
      min: 18 // Must be 18 or greater
    }
  }
});

// Valid: 18, 25, 100
// Invalid: 17, 0, -5
```

### Maximum Value
Set a maximum value (inclusive):

```javascript
const schema = new Schema({
  percentage: {
    type: Number,
    rules: {
      max: 100 // Must be 100 or less
    }
  }
});

// Valid: 0, 50, 100
// Invalid: 101, 150, 1000
```

### Range (Min and Max)
Combine minimum and maximum in a single rule:

```javascript
const schema = new Schema({
  temperature: {
    type: Number,
    rules: {
      minMax: [-40, 50] // Between -40 and 50 (inclusive)
    }
  }
});

// Valid: -40, 0, 25, 50
// Invalid: -41, 51, 100
```

## Value Comparison

### Exact Match
Require a number to match exactly:

```javascript
const schema = new Schema({
  magicNumber: {
    type: Number,
    rules: {
      is: 42 // Must be exactly 42
    }
  }
});

// Valid: 42
// Invalid: 41, 43, 42.1
```

### Exclusion
Prevent specific values:

```javascript
const schema = new Schema({
  count: {
    type: Number,
    rules: {
      isNot: 0 // Cannot be zero
    }
  }
});

// Valid: 1, -1, 100, 0.1
// Invalid: 0
```

## Complex Number Validation

### Multiple Constraints
Combine different validation rules:

```javascript
const schema = new Schema({
  score: {
    type: Number,
    rules: {
      min: 0,      // At least 0
      max: 100,    // At most 100
      isNot: 13    // Cannot be 13 (unlucky number)
    }
  }
});

// Valid: 0, 50, 99, 100
// Invalid: -1, 13, 101
```

### Price Validation
```javascript
const schema = new Schema({
  price: {
    type: Number,
    rules: {
      min: 0.01,    // At least 1 cent
      max: 9999.99  // Maximum price
    }
  }
});

// Valid: 0.01, 10.50, 999.99
// Invalid: 0, -5.00, 10000
```

## Common Use Cases

### Age Validation
```javascript
const ageSchema = new Schema({
  age: {
    type: Number,
    rules: {
      min: 0,
      max: 150
    }
  }
});
```

### Rating System
```javascript
const ratingSchema = new Schema({
  rating: {
    type: Number,
    rules: {
      min: 1,
      max: 5
    }
  }
});
```

### Quantity Validation
```javascript
const quantitySchema = new Schema({
  quantity: {
    type: Number,
    rules: {
      min: 1,        // At least 1 item
      isNot: 13      // Skip unlucky number
    }
  }
});
```

### Percentage Validation
```javascript
const percentageSchema = new Schema({
  completion: {
    type: Number,
    rules: {
      min: 0,
      max: 100
    }
  }
});
```

## Working with Decimals

Validno handles both integers and floating-point numbers:

```javascript
const schema = new Schema({
  // Integers
  wholeNumber: {
    type: Number,
    rules: {
      min: 1,
      max: 1000
    }
  },
  
  // Decimals
  preciseValue: {
    type: Number,
    rules: {
      min: 0.001,
      max: 99.999
    }
  },
  
  // Negative numbers
  temperature: {
    type: Number,
    rules: {
      min: -273.15,  // Absolute zero
      max: 1000
    }
  }
});

// All valid
const data = {
  wholeNumber: 42,
  preciseValue: 3.14159,
  temperature: -40.5
};
```

## Example: Product Schema

```javascript
const productSchema = new Schema({
  id: {
    type: Number,
    rules: {
      min: 1 // Positive ID required
    }
  },
  
  price: {
    type: Number,
    rules: {
      min: 0.01,     // At least 1 cent
      max: 999999.99 // Maximum price
    }
  },
  
  discountPercent: {
    type: Number,
    required: false, // Optional field
    rules: {
      min: 0,
      max: 100
    }
  },
  
  stockQuantity: {
    type: Number,
    rules: {
      min: 0 // Can be zero (out of stock)
    }
  },
  
  rating: {
    type: Number,
    required: false,
    rules: {
      min: 1,
      max: 5
    }
  }
});

// Example valid data
const product = {
  id: 123,
  price: 29.99,
  discountPercent: 15,
  stockQuantity: 100,
  rating: 4.5
};

const result = productSchema.validate(product);
```

## Example: User Profile

```javascript
const userProfileSchema = new Schema({
  age: {
    type: Number,
    rules: {
      min: 13,   // Minimum age for service
      max: 120   // Reasonable maximum age
    }
  },
  
  height: {
    type: Number,
    required: false,
    rules: {
      min: 50,   // 50cm minimum
      max: 300   // 3m maximum (very tall!)
    }
  },
  
  weight: {
    type: Number,
    required: false,
    rules: {
      min: 1,    // 1kg minimum
      max: 1000  // 1 ton maximum
    }
  }
});
```

## Important Notes

1. **Inclusive Ranges**: Both `min` and `max` are inclusive (the boundary values are valid)
2. **Type Safety**: The value must be a valid number; strings like "42" will fail type validation first
3. **Precision**: JavaScript number precision limitations apply
4. **NaN and Infinity**: These special number values will fail validation rules

## Next Steps

- Learn about [Array Rules](/array-rules) for array-specific validation
- Explore [Custom Rules](/custom-rules) for advanced numeric validation logic
- See [Validation Results](/validation-results) to understand how to handle validation outcomes