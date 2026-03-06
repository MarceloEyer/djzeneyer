const fs = require('fs');
const file = 'src/pages/FAQPage.tsx';
let content = fs.readFileSync(file, 'utf8');

// Adiciona useMemo no import do react
content = content.replace("import React, { useState, memo } from 'react';", "import React, { useState, memo, useMemo } from 'react';");

// Memoize faqData
const faqDataMatch = `  const faqData = categories.map(cat => ({`;
const faqDataReplacement = `  const faqData = useMemo(() => categories.map(cat => ({`;
content = content.replace(faqDataMatch, faqDataReplacement);

const faqDataEndMatch = `    }))\n  }));`;
const faqDataEndReplacement = `    }))\n  })), [t]);`;
content = content.replace(faqDataEndMatch, faqDataEndReplacement);

// Memoize faqSchema
const faqSchemaMatch = `  const faqSchema = {`;
const faqSchemaReplacement = `  const faqSchema = useMemo(() => ({`;
content = content.replace(faqSchemaMatch, faqSchemaReplacement);

const faqSchemaEndMatch = `    ]\n  };`;
const faqSchemaEndReplacement = `    ]\n  }), [currentUrl, faqData]);`;
content = content.replace(faqSchemaEndMatch, faqSchemaEndReplacement);

fs.writeFileSync(file, content);
console.log('Patched');
