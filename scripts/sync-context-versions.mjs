import fs from 'fs';
import path from 'path';

/**
 * sync-context-versions.mjs
 * 
 * Sincroniza as versões do package.json com as tabelas de stack nos arquivos de persona.
 * Isso garante que CLAUDE.md e GEMINI.md reflitam sempre a realidade técnica.
 */

const PACKAGE_JSON_PATH = path.resolve('package.json');
const CLAUDE_MD_PATH = path.resolve('.agents/personas/CLAUDE.md');
const GEMINI_MD_PATH = path.resolve('.agents/personas/GEMINI.md');

function sync() {
    try {
        const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };

        // 1. Atualizar CLAUDE.md
        if (fs.existsSync(CLAUDE_MD_PATH)) {
            let claudeContent = fs.readFileSync(CLAUDE_MD_PATH, 'utf8');
            
            // Versões principais
            const stackLine = `| Frontend | React ${deps['react']?.replace('^', '')}, React DOM ${deps['react-dom']?.replace('^', '')}, TypeScript ${deps['typescript']?.replace('^', '')}, Vite ${deps['vite']?.replace('^', '')}, Tailwind ${deps['tailwindcss']?.replace('^', '')}, React Query ${deps['@tanstack/react-query']?.replace('^', '')}, React Router ${deps['react-router-dom']?.replace('^', '')}, i18next ${deps['i18next']?.replace('^', '')}, react-i18next ${deps['react-i18next']?.replace('^', '')}, Framer Motion ${deps['framer-motion']?.replace('^', '')} |`;
            const buildLine = `| Build e qualidade | ESLint ${deps['eslint']?.replace('^', '')}, Prettier ${deps['prettier']?.replace('^', '')}, Puppeteer ${deps['puppeteer']?.replace('^', '')}, OXC como minificador padrao do Vite 8 |`;
            const baseDepsLine = `| Dependencias basicas | dompurify ${deps['dompurify']?.replace('^', '')}, zod ${deps['zod']?.replace('^', '')}, lucide-react ${deps['lucide-react']?.replace('^', '')} |`;

            claudeContent = claudeContent.replace(/\| Frontend \| React.*\|/, stackLine);
            claudeContent = claudeContent.replace(/\| Build e qualidade \| ESLint.*\|/, buildLine);
            claudeContent = claudeContent.replace(/\| Dependencias basicas \| dompurify.*\|/, baseDepsLine);

            // Overrides
            let overridesBlock = 'Overrides atualmente presentes em `package.json`:\n';
            if (pkg.overrides) {
                Object.entries(pkg.overrides).forEach(([name, version]) => {
                    overridesBlock += `- \`${name}\`: \`${version}\`\n`;
                });
            }
            claudeContent = claudeContent.replace(/Overrides atualmente presentes em `package\.json`:\n(- `.*`:\n)*/g, overridesBlock);

            fs.writeFileSync(CLAUDE_MD_PATH, claudeContent);
            console.log('✅ CLAUDE.md sincronizado.');
        }

        // 2. Atualizar GEMINI.md
        if (fs.existsSync(GEMINI_MD_PATH)) {
            let geminiContent = fs.readFileSync(GEMINI_MD_PATH, 'utf8');
            
            const stackLine = `| Frontend | React ${deps['react']?.replace('^', '')}, TypeScript ${deps['typescript']?.replace('^', '')}, Vite ${deps['vite']?.replace('^', '')}, Tailwind ${deps['tailwindcss']?.replace('^', '')}, React Query ${deps['@tanstack/react-query']?.replace('^', '')}, React Router ${deps['react-router-dom']?.replace('^', '')}, i18next ${deps['i18next']?.replace('^', '')} |`;
            const buildLine = `| Build | ESLint ${deps['eslint']?.replace('^', '')}, Prettier ${deps['prettier']?.replace('^', '')}, Puppeteer ${deps['puppeteer']?.replace('^', '')}, OXC como minificador padrao |`;

            geminiContent = geminiContent.replace(/\| Frontend \| React.*\|/, stackLine);
            geminiContent = geminiContent.replace(/\| Build \| ESLint.*\|/, buildLine);

            fs.writeFileSync(GEMINI_MD_PATH, geminiContent);
            console.log('✅ GEMINI.md sincronizado.');
        }

    } catch (err) {
        console.error('❌ Erro na sincronização:', err.message);
        process.exit(1);
    }
}

sync();
