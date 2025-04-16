import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FileText, Save, List } from 'lucide-react';

interface ResumeDropdownProps {
  onSave: () => void;
  onLoad: () => void;
}

const ResumeDropdown: React.FC<ResumeDropdownProps> = ({ onSave, onLoad }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FileText className="h-4 w-4" /> Currículos
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Gerenciar Currículos</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={onSave}
        >
          <Save className="h-4 w-4 mr-2" /> Salvar atual
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-accent focus:bg-accent"
          onClick={onLoad}
        >
          <List className="h-4 w-4 mr-2" /> Carregar salvo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ResumeDropdown; 