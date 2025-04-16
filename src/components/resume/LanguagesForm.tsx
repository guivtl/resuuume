import React, { useState } from 'react';
import { Language } from '@/types/resume';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, ChevronDown, ChevronUp, MinusCircle, PlusCircle } from 'lucide-react';
import { languageProficiencyOptions } from '@/lib/resumeHelpers';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LanguagesFormProps {
  languages: Language[];
  onChange: (languages: Language[]) => void;
}

const LanguagesForm: React.FC<LanguagesFormProps> = ({ languages, onChange }) => {
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>({});
  const [collapsedCards, setCollapsedCards] = useState<Record<number, boolean>>({});

  const toggleCardCollapse = (index: number) => {
    setCollapsedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleChange = (index: number, field: keyof Language, value: string) => {
    const updatedLanguages = [...languages];
    updatedLanguages[index] = { ...updatedLanguages[index], [field]: value };
    onChange(updatedLanguages);
    
    // Clear error for the field if it exists
    if (errors[index]?.[field]) {
      setErrors(prev => ({
        ...prev,
        [index]: {
          ...prev[index],
          [field]: '',
        },
      }));
    }
  };

  const addLanguage = () => {
    // Auto-collapse other cards when adding a new one
    const newCollapsedState: Record<number, boolean> = {};
    languages.forEach((_, index) => {
      newCollapsedState[index] = true;
    });
    setCollapsedCards(newCollapsedState);
    
    onChange([...languages, { language: '', proficiency: 'Básico' }]);
  };

  const removeLanguage = (index: number) => {
    if (languages.length === 1) {
      // If it's the last one, just clear it instead of removing
      onChange([{ language: '', proficiency: 'Básico' }]);
    } else {
      const updatedLanguages = [...languages];
      updatedLanguages.splice(index, 1);
      onChange(updatedLanguages);
      
      // Update collapsed states after removal
      const newCollapsedState: Record<number, boolean> = {};
      Object.keys(collapsedCards).forEach(key => {
        const keyNum = parseInt(key);
        if (keyNum < index) {
          newCollapsedState[keyNum] = collapsedCards[keyNum];
        } else if (keyNum > index) {
          newCollapsedState[keyNum - 1] = collapsedCards[keyNum];
        }
      });
      setCollapsedCards(newCollapsedState);
    }
  };

  const validateFields = () => {
    let isValid = true;
    const newErrors: Record<number, Record<string, string>> = {};
    
    languages.forEach((lang, index) => {
      const langErrors: Record<string, string> = {};
      
      if (!lang.language.trim()) {
        langErrors.language = 'Idioma é obrigatório';
        isValid = false;
      }
      
      if (Object.keys(langErrors).length > 0) {
        newErrors[index] = langErrors;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  // Expose validation method to parent components
  React.useEffect(() => {
    if (typeof (window as any).__validateLanguages === 'undefined') {
      (window as any).__validateLanguages = validateFields;
    }
    return () => {
      delete (window as any).__validateLanguages;
    };
  }, [languages]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Idiomas</h2>
        <p className="text-muted-foreground">
          Adicione os idiomas que você conhece e seu nível de proficiência.
        </p>
      </div>

      <div className="space-y-4">
        {languages.map((language, index) => (
          <Card key={index} className="bg-card border border-border overflow-hidden">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-muted/50"
              onClick={() => toggleCardCollapse(index)}
            >
              <div className="flex items-center gap-2">
                {collapsedCards[index] ? (
                  <PlusCircle className="h-5 w-5 text-primary" />
                ) : (
                  <MinusCircle className="h-5 w-5 text-primary" />
                )}
                <span className="text-lg font-medium text-foreground">
                  {language.language || `Idioma ${index + 1}`}
                  {language.proficiency && ` - ${language.proficiency}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {languages.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeLanguage(index);
                    }}
                    title="Remover idioma"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
                {collapsedCards[index] ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>
            
            <CardContent className={`pt-4 px-4 pb-6 border-t border-border ${collapsedCards[index] ? 'hidden' : 'block'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor={`language-${index}`} className="text-foreground">
                    Idioma <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`language-${index}`}
                    value={language.language}
                    onChange={(e) => handleChange(index, 'language', e.target.value)}
                    placeholder="Ex: Inglês, Espanhol, Português"
                    className={`mt-1 bg-input border-border text-foreground ${errors[index]?.language ? 'border-destructive' : ''}`}
                  />
                  {errors[index]?.language && (
                    <p className="text-sm text-destructive mt-1">{errors[index].language}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`proficiency-${index}`} className="text-foreground">
                    Nível de Proficiência
                  </Label>
                  <Select
                    value={language.proficiency}
                    onValueChange={(value) => handleChange(index, 'proficiency', value)}
                  >
                    <SelectTrigger id={`proficiency-${index}`} className="mt-1 bg-input border-border text-foreground">
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border text-popover-foreground">
                      {languageProficiencyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="cursor-pointer hover:bg-accent focus:bg-accent">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          onClick={addLanguage}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Adicionar Idioma
        </Button>
      </div>
    </div>
  );
};

export default LanguagesForm;
