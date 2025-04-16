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
    <div className="space-y-6 animate-fade-in text-gray-100">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Idiomas</h2>
        <p className="text-muted-foreground">
          Adicione os idiomas que você conhece e seu nível de proficiência.
        </p>
      </div>

      <div className="space-y-4">
        {languages.map((language, index) => (
          <Card key={index} className="relative overflow-hidden rounded-none border-[#fab73d]/50 bg-[#204c39]">
            <div 
              className="collapsible-card-header bg-[#2a5c4a]"
              onClick={() => toggleCardCollapse(index)}
            >
              <div className="flex items-center gap-2">
                {collapsedCards[index] ? (
                  <PlusCircle className="h-4 w-4 text-[#fab73d]" />
                ) : (
                  <MinusCircle className="h-4 w-4 text-[#fab73d]" />
                )}
                <span className="font-medium text-white">
                  {language.language ? language.language : `Idioma ${index + 1}`}
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
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                {collapsedCards[index] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </div>
            </div>
            
            <div className={`collapsible-card-content ${collapsedCards[index] ? 'collapsed' : 'expanded'}`}>
              <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor={`language-${index}`} className="font-medium text-gray-200">
                    Idioma <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`language-${index}`}
                    value={language.language}
                    onChange={(e) => handleChange(index, 'language', e.target.value)}
                    placeholder="Ex: Inglês, Espanhol, Português"
                    className={`rounded-sm bg-gray-900 border-gray-700 focus:border-[#fab73d] focus:ring-[#fab73d] text-white ${errors[index]?.language ? 'border-destructive' : ''}`}
                  />
                  {errors[index]?.language && (
                    <p className="text-xs text-destructive">{errors[index].language}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`proficiency-${index}`} className="font-medium text-gray-200">
                    Nível de Proficiência
                  </Label>
                  <Select
                    value={language.proficiency}
                    onValueChange={(value) => handleChange(index, 'proficiency', value)}
                  >
                    <SelectTrigger id={`proficiency-${index}`} className="rounded-sm bg-gray-900 border-gray-700 focus:border-[#fab73d] focus:ring-[#fab73d] text-white">
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                    <SelectContent className="rounded-sm bg-gray-900 text-white border-[#fab73d]/50">
                      {languageProficiencyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}

        <Button
          type="button"
          onClick={addLanguage}
          variant="outline"
          className="w-full rounded-sm border-[#fab73d] text-[#fab73d] hover:bg-[#9ec378]/20 hover:text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Adicionar outro idioma
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>Os recrutadores valorizam candidatos que falam mais de um idioma, especialmente para posições internacionais.</p>
      </div>
    </div>
  );
};

export default LanguagesForm;
