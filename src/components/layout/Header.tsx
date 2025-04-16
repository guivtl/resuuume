
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-6 border-b border-border/40 bg-background/95 backdrop-blur-sm fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-medium">EasyCV</h1>
          <div className="hidden md:flex ml-6">
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
              ATS Otimizado
            </span>
          </div>
        </div>
        <nav className="flex items-center gap-6">
          <Button variant="link" className="text-muted-foreground">
            Como funciona
          </Button>
          <Button variant="link" className="text-muted-foreground">
            Modelos
          </Button>
          <Button variant="link" className="text-muted-foreground">
            Dicas
          </Button>
          <Button variant="outline" className="hidden md:flex">
            Iniciar
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
