// bravevest-web/src/data/faq.js
// Single source of truth for FAQ content.
// Used by src/pages/Faq.jsx AND FloatingAIChat in AppEnhancements.jsx.

import {
  MessageCircle, FileText, Wallet, Shield, TrendingUp, Globe, Layers,
} from 'lucide-react';

export const FAQ_CATEGORIES = [
  { id: 'general',   label: 'General',           icon: MessageCircle },
  { id: 'investing', label: 'Investing',         icon: FileText },
  { id: 'wallet',    label: 'Wallet & Payments', icon: Wallet },
  { id: 'security',  label: 'Security & KYC',    icon: Shield },
  { id: 'taxation',  label: 'Returns & Taxation', icon: TrendingUp },
  { id: 'diaspora',  label: 'Diaspora',          icon: Globe },
  { id: 'products',  label: 'Products',          icon: Layers },
];

export const FAQS = [
  { cat: 'general',   q: 'What is BraveVest?', a: '…' },
  { cat: 'general',   q: 'Who can invest on BraveVest?', a: '…' },
  // …paste every entry exactly as it is in Faq.jsx today…
  { cat: 'products',  q: 'Abuja Real Estate Note — what is it?', a: '…' },
];

// Question strings only — used for chat suggestion chips
export const FAQ_QUESTIONS = FAQS.map((f) => f.q);

// Flat { question, answer } pairs — used as chat context
export const FAQ_CONTEXT = FAQS.map((f) => ({ question: f.q, answer: f.a }));