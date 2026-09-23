import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminToolbar from '@/components/admin/AdminToolbar';
import AdminTable from '@/components/admin/AdminTable';
import AdminEmpty from '@/components/admin/AdminEmpty';
import Loader from '@/components/shared/Loader';
import Button from '@/components/shared/Button';
import { insightsApi } from '@/api/insights';
import { useToast } from '@/hooks/useToast';

export default function AdminInsights() {
  const nav = useNavigate();
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  function load() {
    setLoading(true);
    insightsApi.adminList({ limit: 100 })
      .then((d) => setItems(d.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let out = items;
    if (filter === 'PUBLISHED') out = out.filter((i) => i.isPublished);
    if (filter === 'DRAFT') out = out.filter((i) => !i.isPublished);
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter((i) =>
        i.title.toLowerCase().includes(q) ||
        (i.category || '').toLowerCase().includes(q)
      );
    }
    return out;
  }, [items, filter, search]);

  async function togglePublish(row) {
    try {
      await insightsApi.toggle(row.id);
      toast.success(row.isPublished ? 'Unpublished' : 'Published');
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed');
    }
  }

  async function remove(row) {
    if (!confirm('Delete "' + row.title + '"?')) return;
    try {
      await insightsApi.remove(row.id);
      toast.success('Deleted');
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed');
    }
  }

  const columns = [
    {
      key: 'title', label: 'Title',
      render: (i) => (
        <div>
          <div style={{ fontWeight: 500 }}>{i.title}</div>
          <div style={{ fontSize: 11.5, color: 'var(--gray-600)', marginTop: 2 }}>{i.category}</div>
        </div>
      ),
    },
    {
      key: 'status', label: 'Status',
      render: (i) => <AdminTable.Status status={i.isPublished ? 'PUBLISHED' : 'DRAFT'} />,
    },
    {
      key: 'date', label: 'Date',
      render: (i) => (
        <span style={{ fontSize: 12, color: 'var(--gray-600)' }}>
          {i.publishedAt
            ? 'Published ' + new Date(i.publishedAt).toLocaleDateString()
            : 'Created ' + new Date(i.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions', label: 'Actions', align: 'right',
      render: (i) => (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
          <button className="insight-action" onClick={(e) => { e.stopPropagation(); nav('/admin/insights/' + i.id + '/edit'); }}>
            Edit
          </button>
          <button className="insight-action" onClick={(e) => { e.stopPropagation(); togglePublish(i); }}>
            {i.isPublished ? 'Unpublish' : 'Publish'}
          </button>
          <button className="insight-action insight-action--danger" onClick={(e) => { e.stopPropagation(); remove(i); }}>
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <div className="text-center py-5"><Loader /></div>;

  const counts = {
    total: items.length,
    published: items.filter((i) => i.isPublished).length,
    draft: items.filter((i) => !i.isPublished).length,
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Admin"
        title="Insights"
        subtitle={counts.total + ' total · ' + counts.published + ' published · ' + counts.draft + ' drafts'}
        right={<Button as={Link} to="/admin/insights/new" variant="primary" size="sm">+ New insight</Button>}
      />

      <AdminToolbar
        right={
          <>
            <AdminToolbar.Pill active={filter === 'ALL'} onClick={() => setFilter('ALL')}>All ({counts.total})</AdminToolbar.Pill>
            <AdminToolbar.Pill active={filter === 'PUBLISHED'} onClick={() => setFilter('PUBLISHED')}>Published ({counts.published})</AdminToolbar.Pill>
            <AdminToolbar.Pill active={filter === 'DRAFT'} onClick={() => setFilter('DRAFT')}>Drafts ({counts.draft})</AdminToolbar.Pill>
          </>
        }
      >
        <AdminToolbar.Search value={search} onChange={setSearch} placeholder="Search by title or category…" />
      </AdminToolbar>

      {filtered.length === 0 ? (
        <AdminEmpty
          title={search ? 'No matches' : 'No insights yet'}
          body={search ? 'Try a different search.' : 'Publish your first market brief to engage investors.'}
          action={<Button as={Link} to="/admin/insights/new" variant="primary" size="md">Write your first insight</Button>}
        />
      ) : (
        <AdminTable columns={columns} rows={filtered} />
      )}

      <style>{`
        .insight-action {
          font-size: 11.5px; padding: 5px 10px;
          border: 1px solid var(--line); border-radius: var(--r-pill);
          background: #fff; color: var(--gray-700);
          transition: all .12s ease;
        }
        .insight-action:hover { border-color: var(--ink); color: var(--ink); }
        .insight-action--danger { color: var(--danger); }
        .insight-action--danger:hover { border-color: var(--danger); }
      `}</style>
    </>
  );
}
