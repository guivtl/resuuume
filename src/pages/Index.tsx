import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="text-center space-y-6 flex flex-col items-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Crie seu currículo rapidamente.
        </h1>
        <Link to="/resume-builder">
          <Button 
            size="default" 
            className="bg-white text-black hover:bg-gray-200 flex items-center gap-2 rounded-sm"
          >
            <FileText className="h-4 w-4" />
            Começar Agora :)
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
