import React from 'react';
import { Link } from 'react-router-dom';
import { NeonButton } from '@/components/ui/neon-button';
import { FileText, Plus } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="text-center space-y-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold">
          <span className="text-foreground">res</span><span className="text-primary">uuu</span><span className="text-foreground">me.</span>
        </h1>
        <h2 className="text-xl font-semibold tracking-tight">
          Crie seu currículo rapidamente.
        </h2>
        <Link to="/resume-builder">
          <NeonButton 
            size="default" 
          >
            <span className="font-semibold">Criar</span>
          </NeonButton>
        </Link>
      </div>
    </div>
  );
};

export default Index;
