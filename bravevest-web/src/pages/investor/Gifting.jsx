import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminCard from '@/components/admin/AdminCard';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import { useState } from 'react';
import { useToast } from '@/hooks/useToast';

export default function Gifting() {
  const toast = useToast();
  const [handle, setHandle] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  function submit(e) {
    e.preventDefault();
    toast.success('Gift request queued — this feature ships in Phase 3');
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Investor"
        title="Gift an Investment"
        subtitle="Send an investment to a friend or family member using their BraveVest handle"
      />

      <AdminCard padded={false}>
        <AdminCard.Header title="Send a gift" subtitle="They get an investment, not cash" />
        <AdminCard.Body>
          <form onSubmit={submit}>
            <Input
              label="Recipient handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@ukoekpe"
              hint="Ask them for their BraveVest handle (found on their profile)"
              required
            />
            <Input
              label="Amount (₦)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <Input
              label="Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Happy birthday!"
            />
            <Button type="submit" variant="primary" size="lg">Continue</Button>
          </form>
        </AdminCard.Body>
      </AdminCard>

      <div className="mt-3 text-muted" style={{ fontSize: 13, textAlign: 'center' }}>
        Full gifting flow ships in Phase 3. For now, you can share your referral link from the Referrals page.
      </div>
    </>
  );
}
