import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const LOGO_URL = 'https://media.base44.com/images/public/6a9fa0eaed1bc73f6d4dc233/979a01085_Adwordixblacklogo.png';

export default function Logo({ dark = false, className }) {
  return (
    <Link to="/" className={cn('flex items-center', className)}>
      <img src={LOGO_URL} alt="Adwordix — AI Based SEO" className="h-9 w-auto object-contain" />
    </Link>
  );
}