'use client';
import { useEffect } from 'react';

export function ContactRedirect() {
  useEffect(() => {
    window.location.href = 'mailto:hello@cmon.group';
  }, []);
  return null;
}
