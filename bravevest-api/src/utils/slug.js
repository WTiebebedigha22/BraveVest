// src/utils/slug.js
function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
async function uniqueSlug(prisma, base) {
  let s = slugify(base) || 'project';
  let n = 0;
  // Small loop — collision-free enough for MVP
  while (true) {
    const existing = await prisma.project.findUnique({ where: { slug: n === 0 ? s : `${s}-${n}` } });
    if (!existing) return n === 0 ? s : `${s}-${n}`;
    n += 1;
  }
}
module.exports = { slugify, uniqueSlug };
