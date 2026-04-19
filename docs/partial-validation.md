# Partial Validation

Partial validation allows you to validate only specific fields instead of the entire object. This is particularly useful for form updates, API patches, and progressive validation scenarios.

## Basic Partial Validation

Validate a single field by passing the field name as the second parameter:

```javascript
const userSchema = new Schema({
  name: { 
    type: String,
    rules: { lengthMin: 2 }
  },
  email: { 
    type: String,
    rules: { isEmail: true }
  },
  phone: { 
    type: String,
    required: false 
  }
});

const data = { 
  name: "John",
  email: "invalid-email",
  phone: "555-1234" 
};

// Validate only the name field
const nameResult = userSchema.validate(data, 'name');
// nameResult.ok === true

// Validate only the email field  
const emailResult = userSchema.validate(data, 'email');
// emailResult.ok === false (invalid email format)
```

## Multiple Field Validation

Validate multiple specific fields by passing an array of field names:

```javascript
const schema = new Schema({
  firstName: { type: String, rules: { lengthMin: 2 } },
  lastName: { type: String, rules: { lengthMin: 2 } },
  email: { type: String, rules: { isEmail: true } },
  phone: { type: String, required: false },
  address: { type: String, required: false }
});

const data = {
  firstName: "John",
  lastName: "D", // Too short
  email: "john@example.com",
  phone: "555-1234"
};

// Validate only firstName and lastName
const nameResult = schema.validate(data, ['firstName', 'lastName']);
// Will fail because lastName is too short

// Validate only firstName and email
const validResult = schema.validate(data, ['firstName', 'email']);  
// Will pass because both fields are valid
```

## Use Cases for Partial Validation

### 1. Form Field Validation (Real-time)
Validate individual fields as users type:

```javascript
const registrationSchema = new Schema({
  username: {
    type: String,
    rules: {
      lengthMin: 3,
      lengthMax: 20,
      regex: /^[a-zA-Z0-9_]+$/
    }
  },
  email: {
    type: String,
    rules: {
      isEmail: true
    }
  },
  password: {
    type: String,
    rules: {
      lengthMin: 8
    }
  }
});

// Validate username field on blur
const validateUsername = (username) => {
  const result = registrationSchema.validate({ username }, 'username');
  return {
    isValid: result.ok,
    error: result.errors[0] || null
  };
};

// Usage in a form
const usernameCheck = validateUsername("jo"); 
// { isValid: false, error: "Username too short" }
```

### 2. API PATCH Operations
Validate only the fields being updated:

```javascript
const userUpdateSchema = new Schema({
  name: {
    type: String,
    required: false, // Not required for updates
    rules: { lengthMin: 2 }
  },
  email: {
    type: String,
    required: false,
    rules: { isEmail: true }
  },
  bio: {
    type: String,
    required: false,
    rules: { lengthMax: 500 }
  }
});

// PATCH /users/123 - only updating email
const patchData = {
  email: "newemail@example.com"
};

const result = userUpdateSchema.validate(patchData, 'email');
// Only validates the email field
```

### 3. Progressive Form Validation
Validate forms step by step:

```javascript
const wizardSchema = new Schema({
  // Step 1: Personal Info
  firstName: { type: String, rules: { lengthMin: 2 } },
  lastName: { type: String, rules: { lengthMin: 2 } },
  
  // Step 2: Contact Info
  email: { type: String, rules: { isEmail: true } },
  phone: { type: String, rules: { regex: /^\d{3}-\d{3}-\d{4}$/ } },
  
  // Step 3: Preferences
  newsletter: { type: Boolean },
  notifications: { type: Array, rules: { enum: ['email', 'sms', 'push'] } }
});

// Validate Step 1
const step1Fields = ['firstName', 'lastName'];
const step1Result = wizardSchema.validate(formData, step1Fields);

// Validate Step 2  
const step2Fields = ['email', 'phone'];
const step2Result = wizardSchema.validate(formData, step2Fields);
```

### 4. Conditional Field Validation
Validate fields based on conditions:

```javascript
const orderSchema = new Schema({
  paymentMethod: {
    type: String,
    rules: { enum: ['credit_card', 'paypal', 'bank_transfer'] }
  },
  creditCardNumber: {
    type: String,
    required: false,
    rules: { regex: /^\d{4}-\d{4}-\d{4}-\d{4}$/ }
  },
  paypalEmail: {
    type: String,
    required: false,
    rules: { isEmail: true }
  },
  bankAccount: {
    type: String,
    required: false,
    rules: { regex: /^\d{10,12}$/ }
  }
});

// Validate payment-specific fields based on method
const validatePaymentDetails = (data) => {
  const { paymentMethod } = data;
  let fieldsToValidate = ['paymentMethod'];
  
  switch (paymentMethod) {
    case 'credit_card':
      fieldsToValidate.push('creditCardNumber');
      break;
    case 'paypal':
      fieldsToValidate.push('paypalEmail');  
      break;
    case 'bank_transfer':
      fieldsToValidate.push('bankAccount');
      break;
  }
  
  return orderSchema.validate(data, fieldsToValidate);
};
```

## Working with Nested Fields

For nested objects, use dot notation to specify field paths:

```javascript
const userSchema = new Schema({
  profile: {
    personalInfo: {
      firstName: { type: String, rules: { lengthMin: 2 } },
      lastName: { type: String, rules: { lengthMin: 2 } }
    },
    contactInfo: {
      email: { type: String, rules: { isEmail: true } },
      phone: { type: String, required: false }
    }
  }
});

const userData = {
  profile: {
    personalInfo: {
      firstName: "John",
      lastName: "Doe"
    },
    contactInfo: {
      email: "john@example.com",
      phone: "555-1234"
    }
  }
};

// Note: Validno currently validates at the top level
// For nested validation, you would validate the parent object
const profileResult = userSchema.validate(userData, 'profile');
```

## Handling Missing Fields

Partial validation handles missing fields gracefully:

```javascript
const schema = new Schema({
  name: { type: String, rules: { lengthMin: 2 } },
  email: { type: String, rules: { isEmail: true } },
  age: { type: Number, rules: { min: 18 } }
});

const incompleteData = {
  name: "John"
  // email and age are missing
};

// Validate only the name field (which exists)
const nameResult = schema.validate(incompleteData, 'name');
// Result: valid

// Validate email field (which is missing)  
const emailResult = schema.validate(incompleteData, 'email');
// Result: invalid (field is required but missing)

// Validate multiple fields including missing ones
const multiResult = schema.validate(incompleteData, ['name', 'email']);
// Result: invalid (email is missing)
```

## Optional Fields in Partial Validation

Optional fields behave differently in partial validation:

```javascript
const schema = new Schema({
  name: { type: String, required: true },
  nickname: { type: String, required: false },
  bio: { type: String, required: false, rules: { lengthMax: 200 } }
});

const data = { name: "John" };

// Validate optional field that's not provided
const nicknameResult = schema.validate(data, 'nickname');
// Result: valid (optional field can be missing)

// Validate optional field with validation rules
const bioData = { bio: "Very long bio that exceeds 200 characters..." };
const bioResult = schema.validate(bioData, 'bio');
// Result: invalid (fails lengthMax rule even though field is optional)
```

## Best Practices

### 1. Validate Related Fields Together
```javascript
// Good: Validate related fields as a group
const passwordFields = ['password', 'confirmPassword'];
const result = schema.validate(data, passwordFields);

// Avoid: Validating dependent fields separately
const passwordResult = schema.validate(data, 'password');
const confirmResult = schema.validate(data, 'confirmPassword');
```

### 2. Handle Missing Dependencies
```javascript
const validateWithDependencies = (data, fields) => {
  const allFields = [...fields];
  
  // Add dependent fields
  if (fields.includes('confirmPassword') && !fields.includes('password')) {
    allFields.push('password');
  }
  
  return schema.validate(data, allFields);
};
```

### 3. Provide Clear Feedback
```javascript
const validateField = (data, fieldName) => {
  const result = schema.validate(data, fieldName);
  
  return {
    field: fieldName,
    isValid: result.ok,
    errors: result.errorsByKeys[fieldName] || [],
    message: result.ok ? 'Valid' : result.errors.join(', ')
  };
};
```

### 4. Cache Validation Results
```javascript
class ValidationCache {
  constructor(schema) {
    this.schema = schema;
    this.cache = new Map();
  }
  
  validateField(data, field) {
    const key = `${field}:${JSON.stringify(data[field])}`;
    
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    const result = this.schema.validate(data, field);
    this.cache.set(key, result);
    
    return result;
  }
  
  clearCache() {
    this.cache.clear();
  }
}
```

## TypeScript Support

Partial validation works with TypeScript generics:

```typescript
interface User {
  name: string;
  email: string;
  age?: number;
}

const schema = new Schema({
  name: { type: String },
  email: { type: String, rules: { isEmail: true } },
  age: { type: Number, required: false }
});

// Type-safe partial validation
const result = schema.validate<User>(userData, 'email');
const multiResult = schema.validate<User>(userData, ['name', 'email']);
```

## Real-World Examples

### Form Validation Hook (React-like)
```javascript
const useFieldValidation = (schema, data) => {
  const [errors, setErrors] = useState({});
  
  const validateField = (fieldName) => {
    const result = schema.validate(data, fieldName);
    
    setErrors(prev => ({
      ...prev,
      [fieldName]: result.ok ? null : result.errors[0]
    }));
    
    return result.ok;
  };
  
  const validateFields = (fieldNames) => {
    const result = schema.validate(data, fieldNames);
    
    const newErrors = {};
    fieldNames.forEach(field => {
      newErrors[field] = result.errorsByKeys[field]?.[0] || null;
    });
    
    setErrors(prev => ({ ...prev, ...newErrors }));
    
    return result.ok;
  };
  
  return { validateField, validateFields, errors };
};
```

### API Validation Middleware
```javascript
const createValidationMiddleware = (schema) => {
  return (req, res, next) => {
    const method = req.method;
    
    if (method === 'POST') {
      // Validate all required fields for creation
      const result = schema.validate(req.body);
      if (!result.ok) {
        return res.status(400).json({ errors: result.errors });
      }
    } else if (method === 'PATCH') {
      // Validate only provided fields for updates
      const providedFields = Object.keys(req.body);
      const result = schema.validate(req.body, providedFields);
      if (!result.ok) {
        return res.status(400).json({ errors: result.errors });
      }
    }
    
    next();
  };
};
```

## Next Steps

- Learn about [Validation Results](/validation-results) to understand partial validation outcomes
- Explore [Custom Messages](/custom-messages) for better partial validation feedback