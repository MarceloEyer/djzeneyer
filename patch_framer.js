const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function processDir(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            processDir(filePath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            let content = fs.readFileSync(filePath, 'utf8');
            let modified = false;

            // Replace import { motion } from 'framer-motion'
            // With import { m } from 'framer-motion'
            if (content.includes("from 'framer-motion'")) {
                const importRegex = /import\s+\{\s*([^}]*)\s*\}\s+from\s+['"]framer-motion['"]/;
                const match = content.match(importRegex);

                if (match) {
                    let imports = match[1].split(',').map(s => s.trim());
                    if (imports.includes('motion')) {
                        imports = imports.filter(i => i !== 'motion');
                        imports.push('m');

                        const newImport = `import { ${imports.join(', ')} } from 'framer-motion';`;
                        content = content.replace(match[0], newImport);

                        // Replace <motion. div with <m. div
                        content = content.replace(/<motion\./g, '<m.');
                        content = content.replace(/<\/motion\./g, '</m.');

                        modified = true;
                    }
                }
            }

            if (modified) {
                fs.writeFileSync(filePath, content);
                console.log(`Updated ${filePath}`);
            }
        }
    }
}

processDir(path.join(__dirname, 'src'));
console.log('Framer Motion imports updated.');
