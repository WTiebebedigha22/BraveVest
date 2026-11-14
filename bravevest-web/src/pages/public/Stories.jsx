import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/shared/Button';
import PageShell from '@/components/shared/PageShell';
import Loader from '@/components/shared/Loader';
import { useCurrency } from '@/context/CurrencyContext';
import { useSEO } from '@/hooks/useSEO';
import { storiesApi } from '@/api/stories';

const CSS = `
.stories {
  --st-bg: var(--bv-bg);
  --st-card: var(--bv-bg-elevated);
  --st-line: var(--bv-border);
  --st-text: var(--bv-text);
  --st-mute: var(--bv-text-muted);
  --st-yellow: var(--bv-accent);
  --st-amber: #C27C00;

  background: var(--st-bg);
  color: var(--st-text);
  font-family: 'Inter','Helvetica Neue',Arial,sans-serif;
  padding: 72px 0 96px;
}
.stories * { box-sizing: border-box; }
.stories__wrap { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

.stories__head { text-align: center; margin-bottom: 56px; }
.stories__eyebrow {
  display: inline-flex; padding: 6px 14px; border-radius: 6px;
  background: rgba(240,185,11,0.12); border: 1px solid rgba(240,185,11,0.28);
  font-size: 12px; font-weight: 700; color: var(--st-yellow);
  text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px;
}
.stories__title {
  font-size: clamp(32px, 4.5vw, 48px); font-weight: 800;
  letter-spacing: -0.03em; margin: 0 0 16px; line-height: 1.12;
  color: var(--st-text);
}
.stories__sub {
  font-size: 16px; color: var(--st-mute); max-width: 620px;
  margin: 0 auto; line-height: 1.6;
}

.stories__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-bottom: 56px;
}

.story {
  position: relative;
  padding: 32px;
  background: var(--st-card);
  border: 1px solid var(--st-line);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 10px 30px -10px rgba(18,18,20,0.04);
}
.story:hover {
  border-color: var(--st-yellow);
  transform: translateY(-2px);
  box-shadow: 0 20px 40px -15px rgba(240,185,11,0.15);
}
.story--feature {
  grid-column: 1 / -1;
  padding: 44px 48px;
}
@media (min-width: 901px) {
  .story--feature { grid-column: span 2; }
}

.story__quote-mark {
  font-size: 56px; font-weight: 800; line-height: 1;
  color: var(--st-yellow); opacity: 0.35; margin-bottom: 8px;
}
.story__quote {
  font-size: 16px; line-height: 1.7; color: var(--st-text);
  margin: 0 0 20px; flex: 1; font-style: italic;
}
.story--feature .story__quote { font-size: 20px; line-height: 1.6; }

.story__highlight {
  display: inline-block; align-self: flex-start;
  padding: 6px 12px;
  background: rgba(240,185,11,0.10);
  border: 1px solid rgba(240,185,11,0.25);
  border-radius: 6px;
  font-size: 13px; font-weight: 700;
  color: var(--st-yellow);
  margin-bottom: 20px;
}

.story__author {
  display: flex; align-items: center; gap: 12px;
  padding-top: 20px; border-top: 1px solid var(--st-line);
}
.story__avatar {
  width: 44px; height: 44px; border-radius: 50%;
  background: var(--st-yellow); color: #000;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 14px; flex-shrink: 0;
}
.story__name {
  font-size: 14px; font-weight: 700; color: var(--st-text);
}
.story__role {
  font-size: 12px; color: var(--st-mute);
}

.stories__cta {
  padding: 40px;
  background: var(--st-card);
  border: 1px solid var(--st-line);
  border-radius: 16px;
  display: flex; gap: 24px; align-items: center;
  justify-content: space-between; flex-wrap: wrap;
  margin-bottom: 24px;
}
.stories__cta-title {
  font-size: 22px; font-weight: 800;
  color: var(--st-text); margin-bottom: 6px;
}
.stories__cta-body {
  font-size: 15px; color: var(--st-mute); margin: 0;
}
.stories__cta-actions {
  display: flex; gap: 12px; flex-wrap: wrap;
}

.stories__note {
  font-size: 12px; color: var(--st-mute);
  text-align: center; opacity: 0.75;
}

.stories__empty {
  padding: 60px 20px; text-align: center;
  color: var(--st-mute);
  background: var(--st-card);
  border: 1px solid var(--st-line);
  border-radius: 12px;
}

@media (max-width: 900px) {
  .stories { padding: 48px 0 64px; }
  .stories__grid { grid-template-columns: 1fr; }
  .story--feature { padding: 32px 24px; }
  .stories__cta { padding: 28px 20px; }
  .stories__cta-title { font-size: 18px; }
}
`;

export default function Stories() {
  const { format } = useCurrency();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSEO({
    title: 'Investor Stories',
    description: 'Real investors sharing their experience with BraveVest — from ₦100k pilots to ₦8M cooperative pools.',
    canonical: '/stories',
  });

  useEffect(() => {
    let cancelled = false;
    storiesApi.listPublished()
      .then((d) => { if (!cancelled) setStories(Array.isArray(d) ? d : []); })
      .catch((e) => { if (!cancelled) setError(e?.response?.data?.error || 'Could not load stories.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <PageShell theme="light" ticker>
        <div style={{ padding: 80, display: 'flex', justifyContent: 'center' }}>
          <Loader />
        </div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell theme="light" ticker>
        <style>{CSS}</style>
        <div className="stories">
          <div className="stories__wrap">
            <div className="stories__empty" style={{ color: 'var(--bv-negative)' }}>
              {error}
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell theme="light" ticker>
      <style>{CSS}</style>
      <div className="stories">
        <div className="stories__wrap">
          <header className="stories__head">
            <div className="stories__eyebrow">Investor Stories</div>
            <h1 className="stories__title">Real people, real returns.</h1>
            <p className="stories__sub">
              From first-time investors to cooperatives and diaspora communities — how people are using BraveVest.
            </p>
          </header>

          {stories.length === 0 ? (
            <div className="stories__empty">
              No stories published yet. Check back soon.
            </div>
          ) : (
            <div className="stories__grid">
              {stories.map((s, i) => {
                const avatar = s.avatarText || s.name.split(' ').map((x) => x[0]).join('').toUpperCase();
                return (
                  <div key={s.id} className={`story ${i === 0 && s.isFeatured ? 'story--feature' : ''}`}>
                    <div className="story__quote-mark">"</div>
                    <blockquote className="story__quote">{s.quote}</blockquote>
                    {s.highlight && <div className="story__highlight">{s.highlight}</div>}
                    <div className="story__author">
                      <div className="story__avatar">{avatar}</div>
                      <div>
                        <div className="story__name">{s.name}</div>
                        <div className="story__role">{s.role}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="stories__cta">
            <div>
              <div className="stories__cta-title">Ready to write your own story?</div>
              <p className="stories__cta-body">Start with as little as {format(50000)} in a verified opportunity.</p>
            </div>
            <div className="stories__cta-actions">
              <Button as={Link} to="/marketplace" variant="secondary" size="lg">Browse projects</Button>
              <Button as={Link} to="/register" variant="primary" size="lg">Create account</Button>
            </div>
          </div>

          <div className="stories__note">
            Stories are illustrative. Returns and experiences vary by investor and project.
          </div>
        </div>
      </div>
    </PageShell>
  );
}