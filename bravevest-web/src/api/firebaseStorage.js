// src/api/firebaseStorage.js — Firebase Storage uploads
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';

/* ── Upload a KYC document ── */
export async function uploadKycDocument(uid, file, type) {
  const path = `kyc/${uid}/${type}-${Date.now()}-${file.name}`;
  const r = ref(storage, path);
  await uploadBytes(r, file, { contentType: file.type });
  const url = await getDownloadURL(r);
  return { path, url, fileName: file.name, size: file.size, mime: file.type };
}

/* ── Upload a project image (admin) ── */
export async function uploadProjectImage(file, slug) {
  const path = `projects/${slug}/${Date.now()}-${file.name}`;
  const r = ref(storage, path);
  await uploadBytes(r, file, { contentType: file.type });
  const url = await getDownloadURL(r);
  return { path, url };
}

/* ── Delete a file ── */
export async function deleteFile(path) {
  const r = ref(storage, path);
  await deleteObject(r);
}
