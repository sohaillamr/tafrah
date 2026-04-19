import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="#8B5CF6" fillOpacity="0.2" />
      <path d="M100 40L150 140H50L100 40Z" fill="#5B21B6" />
      <circle cx="100" cy="110" r="20" fill="#F3F4F6" />
    </svg>
  );
};
