import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DIST_DIR = join(__dirname, '..', 'dist');

function walkHtmlFiles(dir, files = []) {
  if (!existsSync(dir)) {
    return files;
  }

  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      walkHtmlFiles(fullPath, files);
      continue;
    }

    if (entry.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

function decodeHtml(value) {
  return String(value || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#x2f;/gi, '/')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));
}

function stripTags(value) {
  // Handles quoted attribute values that may contain '>' (e.g. data-val="a>b")
  return String(value || '').replace(/<(?:[^>"']|"[^"]*"|'[^']*')*>/g, ' ');
}

function normalizeWhitespace(value) {
  return String(value || '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function getAttribute(tag, attribute) {
  // Captures single- or double-quoted attribute values (does not cross quote boundaries)
  const pattern = new RegExp(`\\s${attribute}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i');
  const m = pattern.exec(tag);
  return decodeHtml(m ? (m[1] !== undefined ? m[1] : m[2]) : '');
}

function yamlString(value) {
  return JSON.stringify(String(value || ''));
}

function extractMeta(html) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const metaTags = [...html.matchAll(/<meta\s+[^>]*>/gi)].map(match => match[0]);
  const byName = new Map();
  const byProperty = new Map();

  for (const tag of metaTags) {
    const name = getAttribute(tag, 'name').toLowerCase();
    const property = getAttribute(tag, 'property').toLowerCase();
    const content = getAttribute(tag, 'content');

    if (name && content) {
      byName.set(name, content);
    }

    if (property && content) {
      byProperty.set(property, content);
    }
  }

  return {
    title: byName.get('title') || byProperty.get('og:title') || decodeHtml(stripTags(titleMatch?.[1] || '')),
    description: byName.get('description') || byProperty.get('og:description') || '',
    image: byProperty.get('og:image') || byName.get('image') || '',
    canonical: getCanonical(html),
  };
}

function getCanonical(html) {
  const canonicalTag = html.match(/<link\s+[^>]*rel\s*=\s*["']canonical["'][^>]*>/i)?.[0] || '';
  return getAttribute(canonicalTag, 'href');
}

function extractJsonLd(html) {
  const blocks = [];
  const scripts = html.matchAll(/<script\s+[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);

  for (const match of scripts) {
    const json = match[1]?.trim();
    if (json) {
      blocks.push(json);
    }
  }

  return blocks;
}

function extractBody(html) {
  return html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] || html;
}

function htmlToMarkdown(html) {
  let content = extractBody(html);

  content = content
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '');

  content = content.replace(/<img\s+[^>]*>/gi, tag => {
    const src = getAttribute(tag, 'src');
    if (!src) {
      return '';
    }

    const alt = getAttribute(tag, 'alt') || 'image';
    return `\n![${normalizeWhitespace(alt)}](${src})\n`;
  });

  content = content.replace(/<a\s+[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
    const cleanText = normalizeWhitespace(decodeHtml(stripTags(text)));
    const cleanHref = decodeHtml(href).trim();

    if (!cleanText) {
      return cleanHref;
    }

    return cleanHref ? `[${cleanText}](${cleanHref})` : cleanText;
  });

  for (let level = 6; level >= 1; level -= 1) {
    const hashes = '#'.repeat(level);
    const regex = new RegExp(`<h${level}[^>]*>([\\s\\S]*?)<\\/h${level}>`, 'gi');
    content = content.replace(regex, (_, text) => {
      const heading = normalizeWhitespace(decodeHtml(stripTags(text)));
      return heading ? `\n\n${hashes} ${heading}\n\n` : '\n\n';
    });
  }

  content = content
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, text) => {
      const item = normalizeWhitespace(decodeHtml(stripTags(text)));
      return item ? `\n- ${item}` : '';
    })
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|section|article|main|aside|ul|ol|blockquote)>/gi, '\n')
    .replace(/<(p|div|section|article|main|aside|ul|ol|blockquote)[^>]*>/gi, '\n')
    // Strip remaining inline tags (e.g. <strong>, <em>) without leaving extra spaces
    .replace(/<(?:[^>"']|"[^"]*"|'[^']*')*>/g, '');

  return normalizeWhitespace(decodeHtml(content));
}

function buildMarkdown(html) {
  const meta = extractMeta(html);
  const jsonLdBlocks = extractJsonLd(html);
  const bodyMarkdown = htmlToMarkdown(html);
  const frontmatter = [];

  if (meta.title) frontmatter.push(`title: ${yamlString(meta.title)}`);
  if (meta.description) frontmatter.push(`description: ${yamlString(meta.description)}`);
  if (meta.canonical) frontmatter.push(`canonical: ${yamlString(meta.canonical)}`);
  if (meta.image) frontmatter.push(`image: ${yamlString(meta.image)}`);

  const sections = [];

  if (frontmatter.length > 0) {
    sections.push(`---\n${frontmatter.join('\n')}\n---`);
  }

  if (bodyMarkdown) {
    sections.push(bodyMarkdown);
  }

  for (const block of jsonLdBlocks) {
    // Each JSON-LD block gets its own fenced code block to ensure valid JSON per block
    sections.push(`\n\`\`\`json\n${block}\n\`\`\``);
  }

  return `${sections.join('\n\n')}\n`;
}

function main() {
  const htmlFiles = walkHtmlFiles(DIST_DIR);

  if (htmlFiles.length === 0) {
    console.warn('⚠️ No HTML files found in dist. Run npm run prerender before npm run generate-markdown.');
    return;
  }

  let generated = 0;

  for (const htmlFile of htmlFiles) {
    const html = readFileSync(htmlFile, 'utf8');
    const markdown = buildMarkdown(html);
    const outputPath = htmlFile.replace(/\.html$/i, '.md');

    writeFileSync(outputPath, markdown, 'utf8');
    generated += 1;
  }

  console.log(`🤖 Static Markdown for Agents generated: ${generated} file(s).`);
}

main();
