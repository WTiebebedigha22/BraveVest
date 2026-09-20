// src/api/firebaseDb.js — Firestore reads (mirrors the Postgres API)
import {
  collection, doc, getDoc, getDocs, query, where, orderBy, limit as qLimit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

/* ── Projects (public read) ── */
export async function fbListProjects({ category, featured, limit = 20 } = {}) {
  const clauses = [where('status', '==', 'OPEN')];
  if (category) clauses.push(where('category', '==', category));
  if (featured) clauses.push(where('isFeatured', '==', true));
  clauses.push(orderBy('createdAt', 'desc'));
  clauses.push(qLimit(limit));

  const snap = await getDocs(query(collection(db, 'projects'), ...clauses));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function fbGetProject(slug) {
  const snap = await getDoc(doc(db, 'projects', slug));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/* ── User profile ── */
export async function fbGetUser(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/* ── User investments ── */
export async function fbListInvestments(uid) {
  const snap = await getDocs(
    query(
      collection(db, 'investments'),
      where('userId', '==', uid),
      orderBy('createdAt', 'desc')
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/* ── User transactions ── */
export async function fbListTransactions(uid) {
  const snap = await getDocs(
    query(
      collection(db, 'transactions'),
      where('userId', '==', uid),
      orderBy('createdAt', 'desc')
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
