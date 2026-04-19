# Custom Error Messages

Custom error messages help you provide user-friendly, contextual feedback when validation fails. Validno allows you to define custom messages at the field level.

## Basic Custom Messages

Use the `customMessage` function to override default error messages:

```javascript
const schema = new Schema({
  email: {
    type: String,
    required: true,
    rules: {
      isEmail: true
    },
    customMessage: ({ keyword, value, key }) => {
      if (keyword === 'isEmail') {
        return 'Please enter a valid email address';
      }
      if (keyword === 'required') {
        return 'Email address is required';
      }
      return `Invalid value for ${key}`;
    }
  }
});
```

## Custom Message Parameters

The `customMessage` function receives a context object with detailed information:

```javascript
const schema = new Schema({
  username: {
    type: String,
    title: "Username", // Human-readable field name
    rules: {
      lengthMin: 3,
      lengthMax: 20
    },
    customMessage: ({ keyword, value, key, title, reqs, schema, rules }) => {
      // keyword: The validation rule that failed ('lengthMin', 'lengthMax', etc.)
      // value: The actual value being validated
      // key: The field name ('username')
      // title: The field title if specified ('Username')
      // reqs: The field requirements object
      // schema: The full schema object
      // rules: The rules object for this field
      
      switch (keyword) {
        case 'lengthMin':
          return `${title} must be at least ${rules.lengthMin} characters long`;
        case 'lengthMax':
          return `${title} cannot exceed ${rules.lengthMax} characters`;
        case 'required':
          return `${title} is required`;
        default:
          return `Invalid ${title.toLowerCase()}`;
      }
    }
  }
});
```

## Context Object Properties

The custom message function receives these parameters:

- **`keyword`**: The validation rule that failed
- **`value`**: The actual value being validated
- **`key`**: The field name
- **`title`**: The field title (if specified)
- **`reqs`**: The field requirements object
- **`schema`**: The full schema object
- **`rules`**: The rules object for this field

## Keyword-Specific Messages

Handle different validation failures with specific messages:

```javascript
const passwordSchema = new Schema({
  password: {
    type: String,
    title: "Password",
    rules: {
      lengthMin: 8,
      lengthMax: 128,
      regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
    },
    customMessage: ({ keyword, rules, title }) => {
      switch (keyword) {
        case 'lengthMin':
          return `${title} must be at least ${rules.lengthMin} characters long`;
        case 'lengthMax':
          return `${title} cannot exceed ${rules.lengthMax} characters`;
        case 'regex':
          return `${title} must contain at least one uppercase letter, one lowercase letter, and one number`;
        case 'required':
          return `${title} is required`;
        default:
          return `Invalid ${title.toLowerCase()}`;
      }
    }
  }
});
```

## Value-Dependent Messages

Create messages based on the actual value:

```javascript
const ageSchema = new Schema({
  age: {
    type: Number,
    title: "Age",
    rules: {
      min: 18,
      max: 100
    },
    customMessage: ({ keyword, value, rules, title }) => {
      switch (keyword) {
        case 'min':
          return `You must be at least ${rules.min} years old. You entered ${value}.`;
        case 'max':
          return `Age cannot exceed ${rules.max} years. You entered ${value}.`;
        case 'type':
          return `${title} must be a number, not "${typeof value}".`;
        default:
          return `Invalid ${title.toLowerCase()}`;
      }
    }
  }
});
```

## Context-Aware Messages

Use other fields in your validation messages:

```javascript
const registrationSchema = new Schema({
  email: {
    type: String,
    rules: {
      isEmail: true
    }
  },
  confirmEmail: {
    type: String,
    customMessage: ({ keyword, value, schema }) => {
      if (keyword === 'custom') {
        return 'Email addresses do not match';
      }
      return 'Please confirm your email address';
    },
    rules: {
      custom: (value, { input }) => value === input.email
    }
  }
});
```

## Array Field Messages

Custom messages for array validation:

```javascript
const tagsSchema = new Schema({
  tags: {
    type: Array,
    title: "Tags",
    rules: {
      lengthMin: 1,
      lengthMax: 5,
      enum: ['technology', 'business', 'health', 'education']
    },
    customMessage: ({ keyword, value, rules, title }) => {
      switch (keyword) {
        case 'lengthMin':
          return `Please select at least ${rules.lengthMin} tag(s)`;
        case 'lengthMax':
          return `You can select up to ${rules.lengthMax} tags maximum`;
        case 'enum':
          return `Invalid tag(s). Allowed tags are: ${rules.enum.join(', ')}`;
        case 'type':
          return `${title} must be a list`;
        default:
          return `Invalid ${title.toLowerCase()}`;
      }
    }
  }
});
```

## Localization Support

Create localized error messages:

```javascript
const locale = 'es'; // Spanish

const getLocalizedMessage = (key, params = {}) => {
  const messages = {
    en: {
      required: 'This field is required',
      emailInvalid: 'Please enter a valid email address',
      tooShort: `Must be at least ${params.min} characters`,
      tooLong: `Cannot exceed ${params.max} characters`
    },
    es: {
      required: 'Este campo es obligatorio',
      emailInvalid: 'Por favor ingrese una dirección de email válida',
      tooShort: `Debe tener al menos ${params.min} caracteres`,
      tooLong: `No puede exceder ${params.max} caracteres`
    }
  };
  
  return messages[locale]?.[key] || messages.en[key];
};

const localizedSchema = new Schema({
  email: {
    type: String,
    rules: {
      isEmail: true,
      lengthMin: 5,
      lengthMax: 100
    },
    customMessage: ({ keyword, rules }) => {
      switch (keyword) {
        case 'required':
          return getLocalizedMessage('required');
        case 'isEmail':
          return getLocalizedMessage('emailInvalid');
        case 'lengthMin':
          return getLocalizedMessage('tooShort', { min: rules.lengthMin });
        case 'lengthMax':
          return getLocalizedMessage('tooLong', { max: rules.lengthMax });
        default:
          return getLocalizedMessage('invalid');
      }
    }
  }
});
```

## Nested Object Messages

Handle custom messages for nested objects:

```javascript
const userSchema = new Schema({
  profile: {
    firstName: {
      type: String,
      title: "First Name",
      rules: {
        lengthMin: 2
      },
      customMessage: ({ keyword, title, rules }) => {
        switch (keyword) {
          case 'required':
            return `${title} is required for your profile`;
          case 'lengthMin':
            return `${title} must be at least ${rules.lengthMin} characters long`;
          default:
            return `Please provide a valid ${title.toLowerCase()}`;
        }
      }
    },
    email: {
      type: String,
      title: "Email Address",
      rules: {
        isEmail: true
      },
      customMessage: ({ keyword, title }) => {
        switch (keyword) {
          case 'required':
            return `${title} is required to create your account`;
          case 'isEmail':
            return `Please enter a valid ${title.toLowerCase()}`;
          default:
            return `Invalid ${title.toLowerCase()}`;
        }
      }
    }
  }
});
```

## Business Rule Messages

Create domain-specific error messages:

```javascript
const orderSchema = new Schema({
  quantity: {
    type: Number,
    title: "Quantity",
    rules: {
      min: 1,
      max: 100
    },
    customMessage: ({ keyword, value, rules }) => {
      switch (keyword) {
        case 'min':
          return 'You must order at least 1 item';
        case 'max':
          return `Sorry, we can only process orders up to ${rules.max} items at a time`;
        case 'type':
          return 'Quantity must be a number';
        default:
          return 'Please enter a valid quantity';
      }
    }
  },
  
  discountCode: {
    type: String,
    required: false,
    title: "Discount Code",
    rules: {
      custom: (value) => {
        if (!value) return true;
        const validCodes = ['SAVE10', 'WELCOME20', 'VIP'];
        return validCodes.includes(value);
      }
    },
    customMessage: ({ keyword }) => {
      if (keyword === 'custom') {
        return 'Invalid discount code. Please check your code and try again.';
      }
      return 'Please enter a valid discount code';
    }
  }
});
```

## Dynamic Messages

Generate messages based on current state or context:

```javascript
const dynamicSchema = new Schema({
  birthDate: {
    type: Date,
    title: "Birth Date",
    rules: {
      custom: (value) => {
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        return age >= 13 && age <= 120;
      }
    },
    customMessage: ({ keyword, value }) => {
      if (keyword === 'custom') {
        const birthYear = new Date(value).getFullYear();
        const currentYear = new Date().getFullYear();
        const age = currentYear - birthYear;
        
        if (age < 13) {
          return 'You must be at least 13 years old to use this service';
        }
        if (age > 120) {
          return 'Please enter a valid birth date';
        }
      }
      return 'Please enter a valid birth date';
    }
  }
});
```

## Best Practices

1. **Be specific and helpful** - explain what's wrong and how to fix it
2. **Use consistent tone** across all messages
3. **Include relevant values** when helpful (limits, requirements)
4. **Consider your audience** - use appropriate language and terminology
5. **Test your messages** - ensure they make sense in context
6. **Keep messages concise** but informative
7. **Use field titles** for better readability

## Example: Complete Form with Custom Messages

```javascript
const registrationSchema = new Schema({
  firstName: {
    type: String,
    title: "First Name",
    rules: {
      lengthMin: 2,
      lengthMax: 50
    },
    customMessage: ({ keyword, rules, title }) => {
      switch (keyword) {
        case 'required':
          return `${title} is required`;
        case 'lengthMin':
          return `${title} must be at least ${rules.lengthMin} characters`;
        case 'lengthMax':
          return `${title} cannot exceed ${rules.lengthMax} characters`;
        default:
          return `Please enter a valid ${title.toLowerCase()}`;
      }
    }
  },
  
  email: {
    type: String,
    title: "Email Address",
    rules: {
      isEmail: true
    },
    customMessage: ({ keyword, title }) => {
      switch (keyword) {
        case 'required':
          return `${title} is required to create your account`;
        case 'isEmail':
          return 'Please enter a valid email address (e.g., user@example.com)';
        default:
          return `Please enter a valid ${title.toLowerCase()}`;
      }
    }
  },
  
  password: {
    type: String,
    title: "Password",
    rules: {
      lengthMin: 8,
      custom: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)
    },
    customMessage: ({ keyword, rules, title }) => {
      switch (keyword) {
        case 'required':
          return `${title} is required`;
        case 'lengthMin':
          return `${title} must be at least ${rules.lengthMin} characters long`;
        case 'custom':
          return `${title} must contain at least one uppercase letter, one lowercase letter, and one number`;
        default:
          return `Please create a strong ${title.toLowerCase()}`;
      }
    }
  }
});
```

## Next Steps

- Learn about [Partial Validation](/partial-validation) for selective field validation
- Explore [Validation Results](/validation-results) to understand how custom messages are returned
- See [Built-in Utilities](/built-in-utilities) for additional validation helpers