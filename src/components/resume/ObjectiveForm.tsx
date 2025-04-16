import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ObjectiveFormProps {
  objective: string;
  onChange: (objective: string) => void;
}

const ObjectiveForm: React.FC<ObjectiveFormProps> = ({ objective, onChange }) => {
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (value: string) => {
    onChange(value);
    if (error) setError(null);
  };

  const validateFields = () => {
    if (!objective.trim()) {
      setError('O objetivo profissional é obrigatório');
      return false;
    }
    return true;
  };

  // Expose validation method to parent components
  React.useEffect(() => {
    if (typeof (window as any).__validateObjective === 'undefined') {
      (window as any).__validateObjective = validateFields;
    }
    return () => {
      delete (window as any).__validateObjective;
    };
  }, [objective]);

  const suggestions = [
    "Desenvolvedor Full Stack com 3 anos de experiência em React, Node.js e MongoDB, buscando uma posição que me permita aplicar meu conhecimento técnico em projetos desafiadores e inovadores.",
    "Engenheiro de Software especializado em desenvolvimento back-end com Python e Django, buscando posição onde possa contribuir para sistemas escaláveis e de alta performance.",
    "Desenvolvedor Front-end experiente em React, TypeScript e UI/UX, procurando integrar uma equipe ágil onde possa criar interfaces intuitivas e acessíveis para melhorar a experiência do usuário.",
    "Analista de Sistemas com experiência em metodologias ágeis, procurando utilizar minhas habilidades técnicas e interpessoais para contribuir com projetos de transformação digital.",
    "Desenvolvedor Mobile especializado em React Native e aplicações híbridas, buscando aplicar minha experiência no desenvolvimento de aplicativos que ofereçam excelente desempenho e experiência do usuário."
  ];

  const applyExample = (example: string) => {
    onChange(example);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Objetivo Profissional</h2>
        <p className="text-muted-foreground">
          Descreva brevemente seu objetivo de carreira e o que você busca em sua próxima posição.
        </p>
      </div>

      <Card className="bg-card border border-border">
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="objective" className="text-foreground">
              Objetivo <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="objective"
              value={objective}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Ex: Desenvolvedor React com 2 anos de experiência buscando posição que me permita aprimorar minhas habilidades em frontend e contribuir para projetos inovadores."
              className={`min-h-[120px] mt-1 bg-input border-border text-foreground ${error ? 'border-destructive' : ''}`}
            />
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
          </div>

          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  className="text-sm flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-accent/50"
                >
                  <Lightbulb className="h-4 w-4" />
                  Ver exemplos
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 border border-border bg-popover text-popover-foreground">
                <div className="bg-muted p-3 border-b border-border">
                  <h4 className="font-medium text-sm">Exemplos de Objetivos Profissionais</h4>
                </div>
                <div className="p-3 space-y-3 text-sm max-h-[300px] overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="p-3 border border-border bg-background rounded-md">
                      <p>{suggestion}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => applyExample(suggestion)}
                        className="mt-2 text-xs text-primary hover:bg-accent/50 hover:text-primary"
                      >
                        Usar este exemplo
                      </Button>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ObjectiveForm;
