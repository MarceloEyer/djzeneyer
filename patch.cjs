const fs = require('fs');
const file = 'src/pages/FAQPage.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("import React, { useState, memo } from 'react';", "import React, { useState, memo, useMemo } from 'react';");

const faqDataMatch = `  const faqData = categories.map(cat => ({`;
const faqDataReplacement = `  const faqData = useMemo(() => categories.map(cat => ({`;
content = content.replace(faqDataMatch, faqDataReplacement);

const faqDataEndMatch = `    }))\n  }));`;
const faqDataEndReplacement = `    }))\n  })), [t]);`;
content = content.replace(faqDataEndMatch, faqDataEndReplacement);

const faqSchemaMatch = `  const faqSchema = {\n    "@context": "https://schema.org",`;
const faqSchemaReplacement = `  const faqSchema = useMemo(() => ({\n    "@context": "https://schema.org",`;
content = content.replace(faqSchemaMatch, faqSchemaReplacement);

const faqSchemaEndMatch = `        ]\n      }\n    ]\n  };`;
const faqSchemaEndReplacement = `        ]\n      }\n    ]\n  }), [currentUrl, faqData]);`;
content = content.replace(faqSchemaEndMatch, faqSchemaEndReplacement);

fs.writeFileSync(file, content);
console.log('Patched');
