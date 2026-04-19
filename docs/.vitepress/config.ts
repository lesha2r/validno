import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Validno',
  description: 'A lightweight TypeScript validation library for runtime data validation',
  base: '/',
  cleanUrls: true,
  
  head: [
    ['link', { rel: 'icon', href: '/validno/favicon.ico' }],
  ],

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/getting-started' },
      { text: 'API', link: '/api-reference' },
      { text: 'Examples', link: '/examples' }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'Installation & Quick Start', link: '/getting-started' }
        ]
      },
      {
        text: 'Schema Definition',
        items: [
          { text: 'Basic Structure', link: '/schema-definition' },
          { text: 'Supported Types', link: '/supported-types' },
          { text: 'Array Validation', link: '/array-validation' }
        ]
      },
      {
        text: 'Validation Rules',
        items: [
          { text: 'String Rules', link: '/string-rules' },
          { text: 'Number Rules', link: '/number-rules' },
          { text: 'Array Rules', link: '/array-rules' },
          { text: 'Custom Rules', link: '/custom-rules' },
          { text: 'Enum Validation', link: '/enum-validation' }
        ]
      },
      {
        text: 'Advanced Features',
        items: [
          { text: 'Nested Objects', link: '/nested-objects' },
          { text: 'Custom Error Messages', link: '/custom-messages' },
          { text: 'Partial Validation', link: '/partial-validation' },
          { text: 'Validation Results', link: '/validation-results' }
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'API Reference', link: '/api-reference' },
          { text: 'Built-in Utilities', link: '/built-in-utilities' }
        ]
      },
      {
        text: 'Examples',
        items: [
          { text: 'Common Use Cases', link: '/examples' },
          { text: 'Advanced Examples', link: '/advanced-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/lesha2r/validno' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/validno' }
    ],

    footer: {
      message: 'Released under the ISC License.',
      copyright: 'Copyright © 2024 lesha2r'
    },

    editLink: {
      pattern: 'https://github.com/lesha2r/validno/edit/main/docs/:path'
    },

    search: {
      provider: 'local'
    }
  }
})