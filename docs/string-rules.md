# String Rules

String validation rules help ensure your text data meets specific requirements for length, format, and content.

## Length Validation

### Exact Length
Require a string to have a specific length:

```javascript
const schema = new Schema({
  code: {
    type: String,
    rules: {
      length: 10 // Must be exactly 10 characters
    }
  }
});

// Valid: "ABCD123456"
// Invalid: "ABC123", "ABCD1234567"
```

### Minimum Length
Set a minimum character count:

```javascript
const schema = new Schema({
  password: {
    type: String,
    rules: {
      lengthMin: 8 // Must be at least 8 characters
    }
  }
});

// Valid: "password123", "verylongpassword"
// Invalid: "pass", "1234567"
```

### Maximum Length
Set a maximum character count:

```javascript
const schema = new Schema({
  username: {
    type: String,
    rules: {
      lengthMax: 20 // Must be 20 characters or fewer
    }
  }
});

// Valid: "john", "johndoe123"
// Invalid: "verylongusernamethatexceedslimit"
```

### Length Range
Combine minimum and maximum in a single rule:

```javascript
const schema = new Schema({
  name: {
    type: String,
    rules: {
      lengthMinMax: [2, 50] // Between 2 and 50 characters
    }
  }
});

// Valid: "Jo", "John Doe", "Very Long Name Here"
// Invalid: "J", "Way too long name that exceeds fifty characters limit"
```

### Exclude Specific Length
Prevent strings of a specific length:

```javascript
const schema = new Schema({
  input: {
    type: String,
    rules: {
      lengthNot: 0 // Cannot be empty string
    }
  }
});

// Valid: "a", "hello"
// Invalid: ""
```

## Format Validation

### Email Validation
Validate email format:

```javascript
const schema = new Schema({
  email: {
    type: String,
    rules: {
      isEmail: true
    }
  }
});

// Valid: "user@example.com", "test.email+tag@domain.co.uk"
// Invalid: "notanemail", "user@", "@domain.com"
```

### Regular Expression
Use custom regex patterns:

```javascript
const schema = new Schema({
  phoneNumber: {
    type: String,
    rules: {
      regex: /^\d{3}-\d{3}-\d{4}$/ // Format: 123-456-7890
    }
  },
  
  productCode: {
    type: String,
    rules: {
      regex: /^PROD-\d{6}$/ // Format: PROD-123456
    }
  }
});

// Valid phoneNumber: "123-456-7890"
// Invalid phoneNumber: "1234567890", "123-45-6789"
```

## Value Comparison

### Exact Match
Require a string to match exactly:

```javascript
const schema = new Schema({
  confirmPassword: {
    type: String,
    rules: {
      is: "expectedPassword" // Must match exactly
    }
  },
  
  status: {
    type: String,
    rules: {
      is: "active" // Must be exactly "active"
    }
  }
});
```

### Exclusion
Prevent specific values:

```javascript
const schema = new Schema({
  username: {
    type: String,
    rules: {
      isNot: "admin" // Cannot be "admin"
    }
  }
});

// Valid: "user", "johnsmith", "administrator"
// Invalid: "admin"
```

## Complex String Validation

### Multiple Rules Combined
Combine different validation rules:

```javascript
const schema = new Schema({
  username: {
    type: String,
    rules: {
      lengthMin: 3,        // At least 3 characters
      lengthMax: 20,       // At most 20 characters  
      regex: /^[a-zA-Z0-9_]+$/, // Only letters, numbers, underscore
      isNot: "admin"       // Cannot be "admin"
    }
  }
});

// Valid: "john_doe", "user123", "test_user"
// Invalid: "jo", "verylongusernamethatexceedslimit", "user@domain", "admin"
```

### Email with Length Constraints
```javascript
const schema = new Schema({
  email: {
    type: String,
    rules: {
      isEmail: true,       // Must be valid email format
      lengthMax: 100       // Maximum 100 characters
    }
  }
});
```

## Common Patterns

### URL Validation
```javascript
const urlSchema = new Schema({
  website: {
    type: String,
    rules: {
      regex: /^https?:\/\/[^\s$.?#].[^\s]*$/
    }
  }
});
```

### Alphanumeric Only
```javascript
const alphanumericSchema = new Schema({
  identifier: {
    type: String,
    rules: {
      regex: /^[a-zA-Z0-9]+$/,
      lengthMin: 1
    }
  }
});
```

### No Whitespace
```javascript
const noSpacesSchema = new Schema({
  slug: {
    type: String,
    rules: {
      regex: /^\S+$/ // No whitespace characters
    }
  }
});
```

## Example: User Registration Form

```javascript
const userRegistrationSchema = new Schema({
  firstName: {
    type: String,
    rules: {
      lengthMin: 2,
      lengthMax: 30,
      regex: /^[a-zA-Z]+$/ // Letters only
    }
  },
  
  lastName: {
    type: String,
    rules: {
      lengthMin: 2,
      lengthMax: 30,
      regex: /^[a-zA-Z]+$/ // Letters only
    }
  },
  
  email: {
    type: String,
    rules: {
      isEmail: true,
      lengthMax: 100
    }
  },
  
  username: {
    type: String,
    rules: {
      lengthMin: 3,
      lengthMax: 20,
      regex: /^[a-zA-Z0-9_]+$/,
      isNot: "admin"
    }
  },
  
  password: {
    type: String,
    rules: {
      lengthMin: 8,
      lengthMax: 128
    }
  }
});
```

## Next Steps

- Learn about [Number Rules](/number-rules) for numeric validation
- Explore [Custom Rules](/custom-rules) for complex string validation logic
- See [Custom Messages](/custom-messages) for user-friendly error messages