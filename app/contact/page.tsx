export const metadata = {
  title: 'Contact — c mon group',
  description: 'Contact c mon group.'
};

import { ContactRedirect } from './ContactRedirect';

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <ContactRedirect />
      <h1 className="font-heading text-3xl">Contact</h1>
      <p className="text-sm text-muted">
        Opening your email client… If nothing happens, email us at{' '}
        <a href="mailto:hello@cmon.group" className="underline">hello@cmon.group</a>.
      </p>
    </div>
  );
}
