import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import readline from 'readline';

const GREEN = '\x1b[32m';
const BLUE = '\x1b[34m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const NC = '\x1b[0m';

console.log(`${BLUE}═══════════════════════════════════════════════════════════════${NC}`);
console.log(`${BLUE}⏪ DJ ZEN EYER - Rollback (dist-prev -> dist)${NC}`);
console.log(`${BLUE}═══════════════════════════════════════════════════════════════${NC}\n`);

if (!existsSync('.env')) {
    console.error(`${RED}❌ Arquivo .env não encontrado. Crie um baseado no .env.example.${NC}`);
    process.exitCode = 1;
} else {
    const envVars = {};
    readFileSync('.env', 'utf-8').split('\n').forEach(line => {
        if (line && !line.startsWith('#')) {
            const [key, ...rest] = line.split('=');
            if (key) envVars[key.trim()] = rest.join('=').trim();
        }
    });

    const requiredVars = ['SSH_HOST', 'SSH_USER', 'REMOTE_ROOT', 'THEME_NAME'];
    let missingVars = false;

    requiredVars.forEach(v => {
        if (!envVars[v]) {
            console.error(`${RED}❌ Variável ${v} não está definida no .env${NC}`);
            missingVars = true;
        }
    });

    if (missingVars) {
        console.log(`\n${YELLOW}Certifique-se de preencher as variáveis no arquivo .env.${NC}`);
        process.exitCode = 1;
    } else {
        const PORT = envVars['SSH_PORT'] || '22';
        const SSH_HOST = envVars['SSH_HOST'];
        const SSH_USER = envVars['SSH_USER'];
        const REMOTE_ROOT = envVars['REMOTE_ROOT'];
        const THEME_NAME = envVars['THEME_NAME'];

        console.log(`${YELLOW}⚠️  Atenção: Isso irá reverter o frontend em produção para o último build anterior (dist-prev).${NC}`);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Deseja continuar? (y/N): ', (answer) => {
            if (answer.toLowerCase() !== 'y') {
                console.log(`${RED}Rollback cancelado.${NC}`);
                rl.close();
                process.exitCode = 0;
            } else {

                console.log(`\n${BLUE}🔌 Conectando via SSH (${SSH_USER}@${SSH_HOST}:${PORT})...${NC}`);

                const remoteScript = `
set -e
THEME_PATH="${REMOTE_ROOT}/wp-content/themes/${THEME_NAME}"
PREV_DIST_PATH="\${THEME_PATH}/dist-prev"
LIVE_DIST_PATH="\${THEME_PATH}/dist"
BROKEN_DIST_PATH="\${THEME_PATH}/dist-broken-\$(date +%s)"

echo "🔍 Verificando estrutura remota..."

if [ ! -d "\${PREV_DIST_PATH}" ]; then
    echo "❌ ERRO: O diretório dist-prev não existe. Impossível fazer rollback."
    kill -INT \$\$
fi

if [ ! -f "\${PREV_DIST_PATH}/index.html" ]; then
    echo "❌ ERRO: O diretório dist-prev/index.html não foi encontrado. O backup parece estar corrompido."
    kill -INT \$\$
fi

echo "📦 Movendo a versão atual (dist) para backup temporário..."
if [ -d "\${LIVE_DIST_PATH}" ]; then
    mv "\${LIVE_DIST_PATH}" "\${BROKEN_DIST_PATH}"
    echo "✅ dist renomeado para \$(basename \${BROKEN_DIST_PATH})"
else
    echo "⚠️ dist atual não encontrado (nada para fazer backup)"
fi

echo "⏪ Restaurando dist-prev para dist..."
cp -r "\${PREV_DIST_PATH}" "\${LIVE_DIST_PATH}"

echo ""
echo "🎉 ROLLBACK CONCLUÍDO COM SUCESSO! 🎉"
echo "========================================="
`;

                try {
                    execSync(`ssh -p "${PORT}" "${SSH_USER}@${SSH_HOST}" "bash -s"`, {
                        input: remoteScript,
                        stdio: ['pipe', 'inherit', 'inherit']
                    });
                    console.log(`\n${GREEN}✅ Rollback finalizado no servidor.${NC}`);
                    console.log(`${YELLOW}🌐 Limpe o cache do site se necessário.${NC}\n`);
                } catch (error) {
                    console.error(`\n${RED}❌ Falha ao realizar rollback remoto.${NC}\n`);
                    process.exitCode = 1;
                }
                rl.close();
            }
        });
    }
}
