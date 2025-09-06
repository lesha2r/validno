# Validation Results

Understanding the validation result structure is crucial for effectively handling validation outcomes and providing meaningful feedback to users.

## Result Structure

The `validate` method returns a comprehensive result object:

```javascript
const schema = new Schema({
  name: { type: String, rules: { lengthMin: 2 } },
  email: { type: String, rules: { isEmail: true } },
  age: { type: Number, rules: { min: 18 } }
});

const result = schema.validate({
  name: "John",
  email: "invalid-email",
  age: 16
});

console.log(result);
// Result object contains:
// {
//   ok: false,                    // Overall validation success
//   passed: ["name"],            // Array of field names that passed
//   failed: ["email", "age"],    // Array of field names that failed  
//   missed: [],                  // Array of required fields missing
//   errors: [...],               // Array of all error messages
//   byKeys: {...},               // Validation status by field name
//   errorsByKeys: {...},         // Error messages by field name
//   joinErrors: function         // Method to join all errors
// }
```

## Result Properties

### `ok` (Boolean)
Overall validation success indicator:

```javascript
const result = schema.validate(data);

if (result.ok) {
  console.log('All validations passed!');
} else {
  console.log('Some validations failed');
}
```

### `passed` (String[])
Array of field names that passed validation:

```javascript
const result = schema.validate({
  name: "John",        // Valid
  email: "bad-email",  // Invalid
  age: 25             // Valid
});

console.log(result.passed); // ["name", "age"]
```

### `failed` (String[])
Array of field names that failed validation:

```javascript
console.log(result.failed); // ["email"]
```

### `missed` (String[])
Array of required fields that were missing from input:

```javascript
const schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: false }
});

const result = schema.validate({ name: "John" }); // Missing email

console.log(result.missed); // ["email"]
console.log(result.failed); // []
console.log(result.passed); // ["name"]
```

### `errors` (String[])
Array of all error messages:

```javascript
const result = schema.validate({
  email: "invalid-email",
  age: -5
});

console.log(result.errors);
// [
//   "Invalid email format",
//   "Age must be at least 18"
// ]
```

### `byKeys` (Object)
Validation status by field name (boolean values):

```javascript
const result = schema.validate({
  name: "John",
  email: "invalid-email",
  age: 25
});

console.log(result.byKeys);
// {
//   name: true,    // Validation passed
//   email: false,  // Validation failed
//   age: true      // Validation passed
// }

// Check specific field
if (!result.byKeys.email) {
  console.log('Email validation failed');
}
```

### `errorsByKeys` (Object)
Error messages grouped by field name:

```javascript
const result = schema.validate({
  name: "A",              // Too short
  email: "invalid-email", // Invalid format
  age: 25                 // Valid
});

console.log(result.errorsByKeys);
// {
//   name: ["Name must be at least 2 characters"],
//   email: ["Invalid email format"],
//   age: []  // No errors for valid fields
// }

// Get errors for specific field
const emailErrors = result.errorsByKeys.email || [];
emailErrors.forEach(error => console.log(`Email error: ${error}`));
```

### `joinErrors()` Method
Convenience method to join all errors into a single string:

```javascript
const result = schema.validate(invalidData);

// Join with default separator (newline)
console.log(result.joinErrors());
// "Invalid email format
//  Age must be at least 18"

// Join with custom separator
console.log(result.joinErrors(', '));
// "Invalid email format, Age must be at least 18"

// Join with bullet points
console.log(result.joinErrors('\n• '));
// "Invalid email format
//  • Age must be at least 18"
```

## Working with Results

### Basic Error Handling
```javascript
const handleValidation = (data) => {
  const result = schema.validate(data);
  
  if (result.ok) {
    return { success: true, data };
  } else {
    return {
      success: false,
      errors: result.errors,
      failedFields: result.failed
    };
  }
};
```

### Field-Specific Error Handling
```javascript
const validateForm = (formData) => {
  const result = schema.validate(formData);
  const fieldErrors = {};
  
  // Process each field
  Object.keys(schema.definition).forEach(fieldName => {
    if (result.byKeys[fieldName] === false) {
      fieldErrors[fieldName] = result.errorsByKeys[fieldName];
    }
  });
  
  return {
    isValid: result.ok,
    errors: fieldErrors,
    summary: result.joinErrors(', ')
  };
};
```

### Partial Validation Results
```javascript
const schema = new Schema({
  name: { type: String },
  email: { type: String, rules: { isEmail: true } },
  phone: { type: String }
});

// Validate only email field
const emailResult = schema.validate(data, 'email');

console.log({
  isEmailValid: emailResult.ok,
  emailErrors: emailResult.errors,
  // Other fields won't be in the result
  validatedFields: emailResult.passed.concat(emailResult.failed)
});
```

## Result Analysis

### Categorizing Validation Issues
```javascript
const analyzeValidation = (result) => {
  return {
    hasErrors: !result.ok,
    missingRequired: result.missed.length > 0,
    invalidFields: result.failed.length > 0,
    validFields: result.passed.length,
    totalErrors: result.errors.length,
    
    // Specific categories
    categories: {
      missing: result.missed,
      invalid: result.failed,
      valid: result.passed
    },
    
    // Summary message
    summary: result.ok 
      ? `All ${result.passed.length} fields are valid`
      : `${result.failed.length + result.missed.length} issues found`
  };
};
```

### Error Severity Classification
```javascript
const classifyErrors = (result) => {
  const classification = {
    critical: [],  // Missing required fields
    errors: [],    // Validation rule failures
    warnings: []   // Optional field issues
  };
  
  // Missing required fields are critical
  result.missed.forEach(field => {
    classification.critical.push({
      field,
      message: `${field} is required`,
      type: 'missing'
    });
  });
  
  // Failed validations are errors
  result.failed.forEach(field => {
    const errors = result.errorsByKeys[field] || [];
    errors.forEach(message => {
      classification.errors.push({
        field,
        message,
        type: 'validation'
      });
    });
  });
  
  return classification;
};
```

## User Interface Integration

### Form Validation Display
```javascript
const displayValidationResults = (result, formElement) => {
  // Clear previous errors
  formElement.querySelectorAll('.error').forEach(el => {
    el.classList.remove('error');
    el.querySelector('.error-message')?.remove();
  });
  
  if (!result.ok) {
    // Add errors to specific fields
    Object.keys(result.errorsByKeys).forEach(fieldName => {
      const errors = result.errorsByKeys[fieldName];
      if (errors.length > 0) {
        const fieldElement = formElement.querySelector(`[name="${fieldName}"]`);
        if (fieldElement) {
          fieldElement.classList.add('error');
          
          const errorDiv = document.createElement('div');
          errorDiv.className = 'error-message';
          errorDiv.textContent = errors.join(', ');
          fieldElement.parentNode.appendChild(errorDiv);
        }
      }
    });
    
    // Show summary
    const summaryElement = formElement.querySelector('.validation-summary');
    if (summaryElement) {
      summaryElement.textContent = result.joinErrors(', ');
      summaryElement.style.display = 'block';
    }
  }
};
```

### API Response Format
```javascript
const createApiResponse = (validationResult, data = null) => {
  if (validationResult.ok) {
    return {
      success: true,
      data: data,
      message: 'Validation successful'
    };
  } else {
    return {
      success: false,
      errors: {
        general: validationResult.errors,
        byField: validationResult.errorsByKeys
      },
      message: 'Validation failed',
      details: {
        failedFields: validationResult.failed,
        missingFields: validationResult.missed,
        validFields: validationResult.passed
      }
    };
  }
};
```

### React Component Integration
```javascript
const useValidation = (schema, initialData = {}) => {
  const [data, setData] = useState(initialData);
  const [result, setResult] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  
  const validate = useCallback((newData = data) => {
    const validationResult = schema.validate(newData);
    setResult(validationResult);
    
    // Update field-specific errors
    const errors = {};
    Object.keys(validationResult.errorsByKeys).forEach(field => {
      const fieldErrors = validationResult.errorsByKeys[field];
      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors[0]; // Take first error
      }
    });
    setFieldErrors(errors);
    
    return validationResult;
  }, [schema, data]);
  
  const validateField = useCallback((fieldName, value) => {
    const newData = { ...data, [fieldName]: value };
    const result = schema.validate(newData, fieldName);
    
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: result.ok ? null : result.errors[0]
    }));
    
    return result.ok;
  }, [schema, data]);
  
  return {
    data,
    setData,
    validate,
    validateField,
    result,
    fieldErrors,
    isValid: result?.ok ?? false
  };
};
```

## Advanced Result Processing

### Custom Result Wrapper
```javascript
class ValidationResult {
  constructor(rawResult) {
    this.raw = rawResult;
  }
  
  get isValid() {
    return this.raw.ok;
  }
  
  get hasErrors() {
    return !this.raw.ok;
  }
  
  get errorCount() {
    return this.raw.errors.length;
  }
  
  getFieldError(fieldName) {
    return this.raw.errorsByKeys[fieldName]?.[0] || null;
  }
  
  getFieldErrors(fieldName) {
    return this.raw.errorsByKeys[fieldName] || [];
  }
  
  hasFieldError(fieldName) {
    return this.raw.byKeys[fieldName] === false;
  }
  
  getFirstError() {
    return this.raw.errors[0] || null;
  }
  
  getSummary() {
    if (this.isValid) {
      return `All ${this.raw.passed.length} fields are valid`;
    }
    return `${this.errorCount} validation error(s) found`;
  }
  
  toJSON() {
    return {
      valid: this.isValid,
      errors: this.raw.errors,
      fieldErrors: this.raw.errorsByKeys,
      summary: this.getSummary()
    };
  }
}

// Usage
const result = new ValidationResult(schema.validate(data));
console.log(result.getSummary());
```

### Logging and Monitoring
```javascript
const logValidationResult = (result, context = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    valid: result.ok,
    errorCount: result.errors.length,
    failedFields: result.failed,
    missingFields: result.missed,
    context
  };
  
  if (!result.ok) {
    logEntry.errors = result.errors;
    logEntry.errorsByField = result.errorsByKeys;
  }
  
  // Send to logging service
  console.log('Validation Result:', logEntry);
  
  // Could also send to analytics, error tracking, etc.
  if (!result.ok && context.source === 'production') {
    // Analytics.track('validation_failed', logEntry);
  }
};
```

## Best Practices

1. **Always check `result.ok`** before proceeding with valid data
2. **Use `errorsByKeys`** for field-specific error handling
3. **Leverage `joinErrors()`** for user-friendly error summaries
4. **Handle missing vs. invalid** fields differently when appropriate
5. **Cache results** when validating the same data multiple times
6. **Provide context** in error messages for better user experience

## Next Steps

- Learn about [Built-in Utilities](/built-in-utilities) for additional validation helpers
- Explore [TypeScript Support](/typescript-support) for type-safe validation results
- See [Advanced Examples](/advanced-examples) for complex validation scenarios