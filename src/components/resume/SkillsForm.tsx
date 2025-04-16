import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Lightbulb } from 'lucide-react';
import { SKILL_SUGGESTIONS } from '@/lib/resumeHelpers';

interface SkillsFormProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

const SkillsForm: React.FC<SkillsFormProps> = ({ skills, onChange }) => {
  const [currentSkill, setCurrentSkill] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddSkill = () => {
    if (!currentSkill.trim()) {
      return;
    }
    
    const trimmedSkill = currentSkill.trim();
    
    if (skills.some(skill => skill.toLowerCase() === trimmedSkill.toLowerCase())) {
      setError('Esta habilidade já foi adicionada');
      return;
    }
    
    onChange([...skills.filter(Boolean), trimmedSkill]);
    setCurrentSkill('');
    setError(null);
  };

  const handleRemoveSkill = (index: number) => {
    const newSkills = [...skills.filter(Boolean)];
    newSkills.splice(index, 1);
    onChange(newSkills.length > 0 ? newSkills : []);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const addSuggestion = (skill: string) => {
    if (skills.some(existingSkill => existingSkill.toLowerCase() === skill.toLowerCase())) {
      setError('Esta habilidade já foi adicionada');
      return;
    }
    
    onChange([...skills.filter(Boolean), skill]);
    setError(null);
  };

  const validateFields = () => {
    const validSkills = skills.filter(Boolean);
    if (validSkills.length === 0) {
      setError('Adicione pelo menos uma habilidade');
      return false;
    }
    setError(null);
    return true;
  };

  React.useEffect(() => {
    if (typeof (window as any).__validateSkills === 'undefined') {
      (window as any).__validateSkills = validateFields;
    }
    return () => {
      delete (window as any).__validateSkills;
    };
  }, [skills]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Habilidades</h2>
        <p className="text-muted-foreground">
          Adicione suas principais habilidades técnicas e competências.
        </p>
      </div>

      <Card className="bg-card border border-border">
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="skills" className="text-foreground">
                Habilidades <span className="text-destructive">*</span>
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                <Lightbulb className="h-3 w-3" />
                Sugestões
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 min-h-[60px] p-3 border border-input rounded-md bg-background">
              {skills.filter(Boolean).map((skill, index) => (
                <Badge key={index} variant="default" className="px-3 py-1.5 gap-2 rounded-sm bg-primary text-primary-foreground">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-2 mt-3">
              <Input
                id="skills"
                value={currentSkill}
                onChange={(e) => {
                  setCurrentSkill(e.target.value);
                  if (error) setError(null);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Digite uma habilidade e pressione Enter"
                className={`mt-1 bg-input border-border text-foreground ${error ? 'border-destructive' : ''}`}
              />
              <Button 
                type="button" 
                onClick={handleAddSkill} 
                size="icon" 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
          </div>
          
          {showSuggestions && (
            <div className="border border-border rounded-md overflow-hidden bg-background mt-4">
              <div className="bg-muted p-3 border-b border-border">
                <h4 className="font-medium text-sm text-foreground">Sugestões de Habilidades</h4>
              </div>
              <div className="p-3 flex flex-wrap gap-2 max-h-[200px] overflow-y-auto">
                {SKILL_SUGGESTIONS.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="px-3 py-1.5 cursor-pointer rounded-sm border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={() => addSuggestion(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillsForm;
