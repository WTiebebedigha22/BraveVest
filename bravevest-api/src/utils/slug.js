function slugify(str) {
  return String(str || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
}
async function uniqueSlug(prisma, base) {
  let s = slugify(base) || 'project', n = 0;
  while (true) {
    const candidate = n === 0 ? s : s + '-' + n;
    const existing = await prisma.project.findUnique({ where: { slug: candidate } });
    if (!existing) return candidate;
    n += 1;
  }
}
module.exports = { slugify, uniqueSlug };
