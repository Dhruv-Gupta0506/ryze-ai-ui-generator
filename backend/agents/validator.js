// ✅ SECURITY: Component Whitelist Enforcement
const ALLOWED_COMPONENTS = [
  'Card', 'Button', 'Input', 'Table', 
  'Navbar', 'Sidebar', 'Modal', 'Chart', 
  'Badge', 'Alert'
];

const validateUI = (uiSchema) => {
  if (!Array.isArray(uiSchema)) {
    return { valid: false, error: 'UI must be an array' };
  }

  for (const item of uiSchema) {
    // Check if component is allowed
    if (!ALLOWED_COMPONENTS.includes(item.component)) {
      return { 
        valid: false, 
        error: `Unauthorized component: ${item.component}` 
      };
    }

    // Recursively validate children
    if (item.children && Array.isArray(item.children)) {
      const childValidation = validateUI(item.children);
      if (!childValidation.valid) return childValidation;
    }
  }

  return { valid: true };
};

module.exports = { validateUI, ALLOWED_COMPONENTS };