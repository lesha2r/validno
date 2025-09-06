# Examples

Common use cases and practical examples for using Validno in real-world applications.

## User Registration Form

A complete user registration validation schema:

```javascript
import Schema from 'validno';

const registrationSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    title: "First Name",
    rules: {
      lengthMin: 2,
      lengthMax: 50,
      regex: /^[a-zA-Z\s'-]+$/ // Letters, spaces, apostrophes, hyphens
    },
    customMessage: ({ keyword, rules, title }) => {
      switch (keyword) {
        case 'lengthMin':
          return `${title} must be at least ${rules.lengthMin} characters`;
        case 'regex':
          return `${title} can only contain letters, spaces, apostrophes, and hyphens`;
        default:
          return `Please enter a valid ${title.toLowerCase()}`;
      }
    }
  },
  
  lastName: {
    type: String,
    required: true,
    title: "Last Name",
    rules: {
      lengthMin: 2,
      lengthMax: 50,
      regex: /^[a-zA-Z\s'-]+$/
    }
  },
  
  email: {
    type: String,
    required: true,
    title: "Email Address",
    rules: {
      isEmail: true,
      lengthMax: 100
    },
    customMessage: ({ keyword, title }) => {
      if (keyword === 'isEmail') {
        return 'Please enter a valid email address (e.g., user@example.com)';
      }
      return `${title} is required`;
    }
  },
  
  password: {
    type: String,
    required: true,
    title: "Password",
    rules: {
      lengthMin: 8,
      lengthMax: 128,
      custom: (value) => {
        const hasUpper = /[A-Z]/.test(value);
        const hasLower = /[a-z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        
        return {
          result: hasUpper && hasLower && hasNumber && hasSpecial,
          details: hasUpper && hasLower && hasNumber && hasSpecial
            ? ''
            : 'Password must contain at least one uppercase letter, lowercase letter, number, and special character'
        };
      }
    }
  },
  
  confirmPassword: {
    type: String,
    required: true,
    title: "Confirm Password",
    rules: {
      custom: (value, { input }) => {
        return {
          result: value === input.password,
          details: value === input.password ? '' : 'Passwords do not match'
        };
      }
    }
  },
  
  age: {
    type: Number,
    required: true,
    title: "Age",
    rules: {
      min: 13,
      max: 120
    },
    customMessage: ({ keyword, rules, title }) => {
      switch (keyword) {
        case 'min':
          return `You must be at least ${rules.min} years old to register`;
        case 'max':
          return 'Please enter a valid age';
        default:
          return `${title} is required`;
      }
    }
  },
  
  terms: {
    type: Boolean,
    required: true,
    title: "Terms and Conditions",
    rules: {
      is: true
    },
    customMessage: ({ keyword }) => {
      if (keyword === 'is') {
        return 'You must accept the terms and conditions to register';
      }
      return 'Please accept the terms and conditions';
    }
  }
});

// Usage
const registrationData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  password: "SecurePass123!",
  confirmPassword: "SecurePass123!",
  age: 25,
  terms: true
};

const result = registrationSchema.validate(registrationData);

if (result.ok) {
  console.log('Registration data is valid!');
  // Proceed with user creation
} else {
  console.log('Validation errors:', result.joinErrors('\n'));
}
```

## E-commerce Product Schema

Validate product data for an online store:

```javascript
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    title: "Product Name",
    rules: {
      lengthMin: 3,
      lengthMax: 100
    }
  },
  
  description: {
    type: String,
    required: false,
    title: "Description",
    rules: {
      lengthMax: 1000
    }
  },
  
  price: {
    type: Number,
    required: true,
    title: "Price",
    rules: {
      min: 0.01,
      max: 99999.99
    },
    customMessage: ({ keyword, rules, title }) => {
      switch (keyword) {
        case 'min':
          return `${title} must be at least $${rules.min}`;
        case 'max':
          return `${title} cannot exceed $${rules.max}`;
        default:
          return `Please enter a valid ${title.toLowerCase()}`;
      }
    }
  },
  
  category: {
    type: String,
    required: true,
    title: "Category",
    rules: {
      enum: [
        'electronics',
        'clothing',
        'books',
        'home-garden',
        'sports',
        'toys',
        'automotive'
      ]
    }
  },
  
  tags: {
    type: Array,
    eachType: String,
    required: false,
    title: "Tags",
    rules: {
      lengthMax: 10 // Maximum 10 tags
    }
  },
  
  inStock: {
    type: Boolean,
    required: true,
    title: "In Stock"
  },
  
  stockQuantity: {
    type: Number,
    required: true,
    title: "Stock Quantity",
    rules: {
      min: 0,
      max: 10000
    }
  },
  
  weight: {
    type: Number,
    required: false,
    title: "Weight (kg)",
    rules: {
      min: 0.001,
      max: 1000
    }
  },
  
  dimensions: {
    required: false,
    length: {
      type: Number,
      required: false,
      rules: { min: 0.1, max: 500 }
    },
    width: {
      type: Number,
      required: false,
      rules: { min: 0.1, max: 500 }
    },
    height: {
      type: Number,
      required: false,
      rules: { min: 0.1, max: 500 }
    }
  }
});

// Example product data
const productData = {
  name: "Wireless Bluetooth Headphones",
  description: "High-quality wireless headphones with noise cancellation",
  price: 199.99,
  category: "electronics",
  tags: ["wireless", "bluetooth", "headphones", "audio"],
  inStock: true,
  stockQuantity: 50,
  weight: 0.3,
  dimensions: {
    length: 20,
    width: 18,
    height: 8
  }
};

const productResult = productSchema.validate(productData);
```

## Blog Post Validation

Validate blog post content:

```javascript
const blogPostSchema = new Schema({
  title: {
    type: String,
    required: true,
    title: "Title",
    rules: {
      lengthMin: 10,
      lengthMax: 100
    }
  },
  
  content: {
    type: String,
    required: true,
    title: "Content",
    rules: {
      lengthMin: 100,
      lengthMax: 50000
    }
  },
  
  excerpt: {
    type: String,
    required: false,
    title: "Excerpt",
    rules: {
      lengthMax: 300
    }
  },
  
  author: {
    id: {
      type: Number,
      required: true,
      rules: { min: 1 }
    },
    name: {
      type: String,
      required: true,
      rules: { lengthMin: 2, lengthMax: 50 }
    },
    email: {
      type: String,
      required: true,
      rules: { isEmail: true }
    }
  },
  
  categories: {
    type: Array,
    eachType: String,
    required: true,
    title: "Categories",
    rules: {
      lengthMin: 1,
      lengthMax: 3,
      enum: [
        'technology',
        'business',
        'health',
        'lifestyle',
        'education',
        'entertainment'
      ]
    }
  },
  
  status: {
    type: String,
    required: true,
    title: "Status",
    rules: {
      enum: ['draft', 'published', 'archived']
    }
  },
  
  publishDate: {
    type: Date,
    required: false,
    title: "Publish Date",
    rules: {
      custom: (value, { input }) => {
        if (input.status !== 'published') {
          return true; // Publish date not required for drafts
        }
        
        if (!value) {
          return {
            result: false,
            details: 'Publish date is required for published posts'
          };
        }
        
        const now = new Date();
        return {
          result: new Date(value) >= now,
          details: new Date(value) >= now ? '' : 'Publish date cannot be in the past'
        };
      }
    }
  },
  
  tags: {
    type: Array,
    eachType: String,
    required: false,
    title: "Tags",
    rules: {
      lengthMax: 8
    }
  },
  
  featured: {
    type: Boolean,
    required: false
  },
  
  allowComments: {
    type: Boolean,
    required: false
  }
});

// Example blog post
const blogPost = {
  title: "Getting Started with TypeScript Validation",
  content: "TypeScript has become an essential tool for modern web development...", // (long content)
  excerpt: "Learn how to implement robust validation in your TypeScript applications",
  author: {
    id: 123,
    name: "Jane Smith",
    email: "jane@example.com"
  },
  categories: ["technology", "education"],
  status: "published",
  publishDate: new Date(Date.now() + 86400000), // Tomorrow
  tags: ["typescript", "validation", "web-dev"],
  featured: false,
  allowComments: true
};
```

## API Request Validation

Validate incoming API requests:

```javascript
// POST /api/users - Create user endpoint
const createUserSchema = new Schema({
  username: {
    type: String,
    required: true,
    rules: {
      lengthMin: 3,
      lengthMax: 20,
      regex: /^[a-zA-Z0-9_]+$/,
      custom: async (value) => {
        // In a real app, you'd check database
        const existingUsers = ['admin', 'root', 'test'];
        return {
          result: !existingUsers.includes(value.toLowerCase()),
          details: !existingUsers.includes(value.toLowerCase()) 
            ? '' 
            : 'Username is already taken'
        };
      }
    }
  },
  
  email: {
    type: String,
    required: true,
    rules: {
      isEmail: true,
      lengthMax: 255
    }
  },
  
  profile: {
    firstName: {
      type: String,
      required: true,
      rules: { lengthMin: 2, lengthMax: 50 }
    },
    lastName: {
      type: String,
      required: true,
      rules: { lengthMin: 2, lengthMax: 50 }
    },
    bio: {
      type: String,
      required: false,
      rules: { lengthMax: 500 }
    }
  },
  
  preferences: {
    required: false,
    theme: {
      type: String,
      required: false,
      rules: { enum: ['light', 'dark', 'auto'] }
    },
    language: {
      type: String,
      required: false,
      rules: { enum: ['en', 'es', 'fr', 'de', 'it'] }
    },
    notifications: {
      email: { type: Boolean, required: false },
      push: { type: Boolean, required: false },
      sms: { type: Boolean, required: false }
    }
  }
});

// PATCH /api/users/:id - Update user endpoint
const updateUserSchema = new Schema({
  username: {
    type: String,
    required: false, // Optional for updates
    rules: {
      lengthMin: 3,
      lengthMax: 20,
      regex: /^[a-zA-Z0-9_]+$/
    }
  },
  
  email: {
    type: String,
    required: false,
    rules: {
      isEmail: true,
      lengthMax: 255
    }
  },
  
  profile: {
    required: false,
    firstName: {
      type: String,
      required: false,
      rules: { lengthMin: 2, lengthMax: 50 }
    },
    lastName: {
      type: String,
      required: false,
      rules: { lengthMin: 2, lengthMax: 50 }
    },
    bio: {
      type: String,
      required: false,
      rules: { lengthMax: 500 }
    }
  }
});

// Express.js middleware example
const validateRequest = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = req[source];
    const result = schema.validate(data);
    
    if (!result.ok) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.errorsByKeys,
        message: result.joinErrors(', ')
      });
    }
    
    // Attach validated data to request
    req.validatedData = data;
    next();
  };
};

// Usage in routes
app.post('/api/users', validateRequest(createUserSchema), (req, res) => {
  // req.validatedData contains the validated user data
  createUser(req.validatedData);
});

app.patch('/api/users/:id', validateRequest(updateUserSchema), (req, res) => {
  // Only validate fields that are provided
  const providedFields = Object.keys(req.body);
  const result = updateUserSchema.validate(req.body, providedFields);
  
  if (!result.ok) {
    return res.status(400).json({ errors: result.errors });
  }
  
  updateUser(req.params.id, req.body);
});
```

## Form Validation Hook (React)

A React hook for form validation:

```javascript
import { useState, useCallback } from 'react';
import Schema from 'validno';

const useFormValidation = (schema, initialData = {}) => {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const validateField = useCallback((fieldName, value) => {
    const fieldData = { ...data, [fieldName]: value };
    const result = schema.validate(fieldData, fieldName);
    
    setErrors(prev => ({
      ...prev,
      [fieldName]: result.ok ? null : result.errorsByKeys[fieldName]?.[0]
    }));
    
    return result.ok;
  }, [schema, data]);
  
  const validateAll = useCallback(() => {
    const result = schema.validate(data);
    
    const newErrors = {};
    Object.keys(schema.definition).forEach(field => {
      newErrors[field] = result.errorsByKeys[field]?.[0] || null;
    });
    
    setErrors(newErrors);
    return result;
  }, [schema, data]);
  
  const handleChange = useCallback((fieldName, value) => {
    setData(prev => ({ ...prev, [fieldName]: value }));
    
    // Validate if field has been touched
    if (touched[fieldName]) {
      validateField(fieldName, value);
    }
  }, [validateField, touched]);
  
  const handleBlur = useCallback((fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, data[fieldName]);
  }, [validateField, data]);
  
  const handleSubmit = useCallback((onSubmit) => {
    return (e) => {
      e.preventDefault();
      
      const result = validateAll();
      
      if (result.ok) {
        onSubmit(data);
      } else {
        // Mark all fields as touched to show errors
        const allTouched = {};
        Object.keys(schema.definition).forEach(field => {
          allTouched[field] = true;
        });
        setTouched(allTouched);
      }
    };
  }, [validateAll, data, schema.definition]);
  
  return {
    data,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    validateField,
    validateAll,
    isValid: Object.values(errors).every(error => !error)
  };
};

// Usage in React component
const ContactForm = () => {
  const contactSchema = new Schema({
    name: { 
      type: String, 
      required: true, 
      rules: { lengthMin: 2 } 
    },
    email: { 
      type: String, 
      required: true, 
      rules: { isEmail: true } 
    },
    message: { 
      type: String, 
      required: true, 
      rules: { lengthMin: 10, lengthMax: 1000 } 
    }
  });
  
  const {
    data,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit
  } = useFormValidation(contactSchema);
  
  const onSubmit = (formData) => {
    console.log('Submitting:', formData);
    // Handle form submission
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          value={data.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          className={touched.name && errors.name ? 'error' : ''}
        />
        {touched.name && errors.name && (
          <span className="error-message">{errors.name}</span>
        )}
      </div>
      
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={data.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          className={touched.email && errors.email ? 'error' : ''}
        />
        {touched.email && errors.email && (
          <span className="error-message">{errors.email}</span>
        )}
      </div>
      
      <div>
        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          value={data.message || ''}
          onChange={(e) => handleChange('message', e.target.value)}
          onBlur={() => handleBlur('message')}
          className={touched.message && errors.message ? 'error' : ''}
        />
        {touched.message && errors.message && (
          <span className="error-message">{errors.message}</span>
        )}
      </div>
      
      <button type="submit">Submit</button>
    </form>
  );
};
```

## File Upload Validation

Validate file uploads:

```javascript
const fileUploadSchema = new Schema({
  file: {
    type: Object,
    required: true,
    title: "File",
    rules: {
      custom: (file) => {
        // Check if it's a File object (browser) or similar structure
        if (!file || typeof file !== 'object') {
          return {
            result: false,
            details: 'Please select a file'
          };
        }
        
        // File size validation (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
          return {
            result: false,
            details: 'File size must be less than 5MB'
          };
        }
        
        // File type validation
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'application/pdf',
          'text/plain'
        ];
        
        if (!allowedTypes.includes(file.type)) {
          return {
            result: false,
            details: 'File type not supported. Allowed: JPEG, PNG, GIF, PDF, TXT'
          };
        }
        
        return true;
      }
    }
  },
  
  description: {
    type: String,
    required: false,
    rules: {
      lengthMax: 200
    }
  },
  
  category: {
    type: String,
    required: true,
    rules: {
      enum: ['document', 'image', 'other']
    }
  }
});

// Usage with file input
const handleFileUpload = (fileInput, description, category) => {
  const file = fileInput.files[0];
  
  const uploadData = {
    file: file,
    description: description,
    category: category
  };
  
  const result = fileUploadSchema.validate(uploadData);
  
  if (result.ok) {
    // Proceed with file upload
    uploadFile(uploadData);
  } else {
    // Show validation errors
    alert(result.joinErrors('\n'));
  }
};
```

## Configuration Validation

Validate application configuration:

```javascript
const configSchema = new Schema({
  app: {
    name: {
      type: String,
      required: true,
      rules: { lengthMin: 1, lengthMax: 50 }
    },
    version: {
      type: String,
      required: true,
      rules: {
        regex: /^\d+\.\d+\.\d+$/ // Semantic versioning
      }
    },
    environment: {
      type: String,
      required: true,
      rules: {
        enum: ['development', 'testing', 'staging', 'production']
      }
    }
  },
  
  database: {
    host: {
      type: String,
      required: true,
      rules: { lengthMin: 1 }
    },
    port: {
      type: Number,
      required: true,
      rules: { min: 1, max: 65535 }
    },
    name: {
      type: String,
      required: true,
      rules: { lengthMin: 1, lengthMax: 64 }
    },
    ssl: {
      type: Boolean,
      required: false
    }
  },
  
  api: {
    port: {
      type: Number,
      required: true,
      rules: { min: 1000, max: 9999 }
    },
    cors: {
      enabled: { type: Boolean, required: true },
      origins: {
        type: Array,
        eachType: String,
        required: false
      }
    },
    rateLimit: {
      enabled: { type: Boolean, required: true },
      maxRequests: {
        type: Number,
        required: false,
        rules: { min: 1, max: 10000 }
      },
      windowMs: {
        type: Number,
        required: false,
        rules: { min: 1000, max: 86400000 } // 1 second to 1 day
      }
    }
  }
});

// Load and validate configuration
const loadConfig = (configFile) => {
  try {
    const config = JSON.parse(configFile);
    const result = configSchema.validate(config);
    
    if (!result.ok) {
      throw new Error(`Configuration validation failed:\n${result.joinErrors('\n')}`);
    }
    
    return config;
  } catch (error) {
    console.error('Failed to load configuration:', error.message);
    process.exit(1);
  }
};
```

## Next Steps

- Explore [Advanced Examples](/advanced-examples) for more complex scenarios
- Learn about [Built-in Utilities](/built-in-utilities) for standalone validation functions
- See [API Reference](/api-reference) for complete documentation