import { useState } from 'react';
import { AccessCodeForm } from '@/components/AccessCodeForm';
import { DigitalLibrary } from '@/components/DigitalLibrary';

const Index = () => {
  const [accessCode, setAccessCode] = useState<string | null>(null);

  const handleAccessGranted = (code: string) => {
    setAccessCode(code);
  };

  const handleLogout = () => {
    setAccessCode(null);
  };

  if (!accessCode) {
    return <AccessCodeForm onAccessGranted={handleAccessGranted} />;
  }

  return <DigitalLibrary accessCode={accessCode} onLogout={handleLogout} />;
};

export default Index;
