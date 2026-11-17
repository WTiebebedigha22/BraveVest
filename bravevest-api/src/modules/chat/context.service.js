const fs = require('fs');
const path = require('path');
const prisma = require('../../config/database');

let cachedStaticContent = null;

/**
 * Recursively scans directories to find frontend files
 */
function scanDir(dir, baseDir = dir, results = []) {
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (['node_modules', '.git', 'dist', 'build', '.next'].includes(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      scanDir(fullPath, baseDir, results);
    } else if (/\.(js|jsx|ts|tsx|md)$/.test(entry.name)) {
      results.push({ relPath, fullPath });
    }
  }
  return results;
}

/**
 * Preloads and caches static frontend content (FAQ, How It Works, Marketplace)
 */
function loadStaticSiteContent() {
  if (cachedStaticContent) return cachedStaticContent;

  const apiRoot = path.resolve(__dirname, '../../..');
  const workspaceRoot = path.resolve(apiRoot, '..');
  const webSrc = path.join(workspaceRoot, 'bravevest-web', 'src');

  if (!fs.existsSync(webSrc)) return [];

  const files = scanDir(webSrc);
  const targetKeywords = ['faq', 'how', 'market', 'landing', 'project', 'invest', 'wallet', 'withdraw', 'kyc'];
  const snippets = [];

  for (const file of files) {
    if (targetKeywords.some((kw) => file.relPath.toLowerCase().includes(kw))) {
      try {
        const content = fs.readFileSync(file.fullPath, 'utf8');
        const cleanText = content
          .replace(/<[^>]*>/g, ' ')
          .replace(/[{}[\](),;]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        snippets.push({
          source: file.relPath,
          text: cleanText,
        });
      } catch (_) {
        // Skip unreadable files
      }
    }
  }

  cachedStaticContent = snippets;
  return cachedStaticContent;
}

/**
 * Scans user message keywords against static docs and live projects
 */
async function getTargetedKnowledgeBase(userMessage = '') {
  const staticSnippets = loadStaticSideContent = loadStaticSiteContent();
  const queryWords = userMessage
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .split(/\s+/)
    .filter((w) => w.length > 2); // Filter out tiny words

  // 1. Score and filter static snippets (FAQ, How it works, etc.)
  const scoredSnippets = staticSnippets.map((snippet) => {
    let score = 0;
    const lowerText = snippet.text.toLowerCase();
    for (const word of queryWords) {
      if (lowerText.includes(word)) score += 1;
      if (snippet.source.toLowerCase().includes(word)) score += 2;
    }
    return { ...snippet, score };
  });

  scoredSnippets.sort((a, b) => b.score - a.score);
  const topStatic = scoredSnippets.slice(0, 3).filter((s) => s.score > 0 || queryWords.length === 0);

  // 2. Query live database for matching projects or info
  let relevantProjects = [];
  try {
    // If user query contains specific keywords, search title/category
    const whereClause = queryWords.length > 0 ? {
      OR: queryWords.map((word) => ({
        OR: [
          { title: { contains: word, mode: 'insensitive' } },
          { category: { contains: word, mode: 'insensitive' } },
          { location: { contains: word, mode: 'insensitive' } },
        ],
      })),
    } : {};

    relevantProjects = await prisma.project.findMany({
      where: whereClause,
      take: 5,
      select: {
        title: true,
        category: true,
        targetAmount: true,
        raisedAmount: true,
        minInvestment: true,
        expectedRoi: true,
        durationMonths: true,
        status: true,
        location: true,
      },
    });

    // Fallback: if keyword search returns nothing, grab active default projects
    if (relevantProjects.length === 0) {
      relevantProjects = await prisma.project.findMany({
        take: 5,
        select: { title: true, category: true, minInvestment: true, expectedRoi: true, location: true },
      });
    }
  } catch (err) {
    console.error('[context] DB query error:', err.message);
  }

  return `
=== RELEVANT SITE GUIDES & FAQS ===
${topStatic.length ? topStatic.map((s) => `[${s.source}]:\n${s.text.slice(0, 800)}`).join('\n\n') : 'No specific guide matched.'}

=== MATCHING MARKETPLACE OPPORTUNITIES ===
${JSON.stringify(relevantProjects, null, 2)}
  `.trim();
}

module.exports = { getTargetedKnowledgeBase };