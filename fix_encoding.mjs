import fs from 'fs';

const filePath = 'd:/DJ/Scripts/djzeneyer/src/locales/pt/translation.json';
// Read as buffer to be safe with any strange encoding
const buffer = fs.readFileSync(filePath);
let content = buffer.toString('utf8');

// The file is double-encoded or has UTF-8 bytes interpreted as ISO-8859-1.
// We'll use a more robust regex-based approach for the common patterns found in the file.

const map = {
    'MÃºsica': 'Música',
    'MÃºsicas': 'Músicas',
    'NavegaÃ§Ã£o': 'Navegação',
    'ProgressÃ£o': 'Progressão',
    'AÃ§Ãµes': 'Ações',
    'RÃ¡pidas': 'Rápidas',
    'atrÃ¡s': 'atrás',
    'RelÃ­quias': 'Relíquias',
    'NÃ­vel': 'Nível',
    'AscensÃ£o': 'Ascensão',
    'estÃ¡': 'está',
    'vocÃª': 'você',
    'nÃ£o': 'não',
    'seguranÃ§a': 'segurança',
    'MÃ©todo': 'Método',
    'finalizaÃ§Ã£o': 'finalização',
    'confirmaÃ§Ã£o': 'confirmação',
    'disponÃ­vel': 'disponível',
    'informaÃ§Ãµes': 'informações',
    'sÃ£o': 'são',
    'EndereÃ§o': 'Endereço',
    'PaÃ­s': 'País',
    'PolÃ­tica': 'Política',
    'conexÃ£o': 'conexão',
    'atravÃ©s': 'através',
    'mÃºsica': 'música',
    'RÃ¡pidos': 'Rápidos',
    'NotÃ­cias': 'Notícias',
    'MÃ­dia': 'Mídia',
    'InscriÃ§Ã£o': 'Inscrição',
    'inscriÃ§Ã£o': 'inscrição',
    'prÃ³ximo': 'próximo',
    'JoÃ£o': 'João',
    'Junte-se Ã ': 'Junte-se à',
    'conteÃºdo': 'conteúdo',
    'MÃ­nimo': 'Mínimo',
    'obrigatÃ³rio': 'obrigatório',
    'invÃ¡lido': 'inválido',
    'verificaÃ§Ã£o': 'verificação',
    'autenticaÃ§Ã£o': 'autenticação',
    'vÃ¡lido': 'válido',
    'OuÃ§a': 'Ouça',
    'CampeÃ£o': 'Campeão',
    'BicampeÃ£o': 'Bicampeão',
    'PromoÃ§Ã£o': 'Promoção',
    'Ãºltimas': 'últimas',
    'Ãšltimas': 'Últimas',
    'histÃ³rias': 'histórias',
    'produÃ§Ã£o': 'produção',
    'LanÃ§amento': 'Lançamento',
    'DuraÃ§Ã£o': 'Duração',
    'InformaÃ§Ãµes': 'Informações',
    'ExperiÃªncia': 'Experiência',
    'TurnÃªs': 'Turnês',
    'TÃ­tulos': 'Títulos',
    'ResoluÃ§Ã£o': 'Resolução',
    'TÃ©cnico': 'Técnico',
    'Ãštil': 'Útil',
    'Ãšteis': 'Úteis',
    'famÃ­lia': 'família',
    'benefÃ­cios': 'benefícios',
    'incrÃ­veis': 'incríveis',
    'aÃ§Ã£o': 'ação',
    'atÃ©': 'até',
    'colecionÃ¡veis': 'colecionáveis',
    'SequÃªncia': 'Sequência',
    'DiÃ¡rias': 'Diárias',
    'bÃ´nus': 'bônus',
    'NÃ£o': 'Não',
    'TraduÃ§Ãµes': 'Traduções',
    'portuguÃªs': 'português',
    'Ã ': 'à',
    'Ã¡': 'á',
    'Ã¢': 'â',
    'Ã£': 'ã',
    'Ã§': 'ç',
    'Ã©': 'é',
    'Ãª': 'ê',
    'Ã­': 'í',
    'Ã³': 'ó',
    'Ã´': 'ô',
    'Ãµ': 'õ',
    'Ãº': 'ú',
    'Ã ': 'à'
};

for (const [key, value] of Object.entries(map)) {
    const regex = new RegExp(key, 'g');
    content = content.replace(regex, value);
}

// Special case for the broken characters in error_loading
content = content.replace(/Nï¿½o foi possï¿½vel/g, 'Não foi possível');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully fixed encoding in translation.json');
