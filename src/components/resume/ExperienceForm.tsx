import React, { useState } from 'react';
import { Experience } from '@/types/resume';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Lightbulb, Plus, Trash2, ChevronDown, ChevronUp, MinusCircle, PlusCircle } from 'lucide-react';
import { JOB_DESCRIPTION_SUGGESTIONS, generateId } from '@/lib/resumeHelpers';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ExperienceFormProps {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
}

// Helper function to format date string from MM/YYYY to YYYY-MM
const formatInputToStoredDate = (input: string): string => {
  const parts = input.replace(/[^\d]/g, '').match(/(\d{1,2})(\d{4})/);
  if (parts && parts.length === 3) {
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    // Basic validation for month
    if (parseInt(month) >= 1 && parseInt(month) <= 12) {
      return `${year}-${month}`;
    }
  }
  return ''; // Return empty if invalid
};

// Helper function to format stored date YYYY-MM to MM/YYYY for display
const formatStoredToInputDate = (stored: string): string => {
  if (!stored || !/^\d{4}-\d{2}$/.test(stored)) return '';
  const [year, month] = stored.split('-');
  return `${month}/${year}`;
};

const ExperienceForm: React.FC<ExperienceFormProps> = ({ experiences, onChange }) => {
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});
  const [collapsedCards, setCollapsedCards] = useState<Record<string, boolean>>({});
  const [rawDateInputs, setRawDateInputs] = useState<Record<string, {startDate?: string; endDate?: string}>>({});

  React.useEffect(() => {
    const initialRawDates: Record<string, {startDate?: string; endDate?: string}> = {};
    experiences.forEach(exp => {
      initialRawDates[exp.id] = {
        startDate: formatStoredToInputDate(exp.startDate),
        endDate: formatStoredToInputDate(exp.endDate)
      };
    });
    setRawDateInputs(initialRawDates);
  }, [experiences]);

  const handleRawDateChange = (id: string, field: 'startDate' | 'endDate', rawValue: string) => {
    setRawDateInputs(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: rawValue }
    }));
    if (errors[id]?.[field]) {
      setErrors(prev => ({
        ...prev,
        [id]: { ...prev[id], [field]: '' },
      }));
    }
  };

  const handleDateBlur = (id: string, field: 'startDate' | 'endDate') => {
    const rawValue = rawDateInputs[id]?.[field] || '';
    const storedValue = formatInputToStoredDate(rawValue);
    
    handleChange(id, field, storedValue);

    setRawDateInputs(prev => ({
        ...prev,
        [id]: { ...prev[id], [field]: formatStoredToInputDate(storedValue) }
    }));
  };

  const handleChange = (id: string, field: keyof Experience, value: any) => {
    if (field === 'startDate' || field === 'endDate') {
      const updatedExperiences = experiences.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      );
      onChange(updatedExperiences);
      return;
    }

    const updatedExperiences = experiences.map(exp => {
      if (exp.id === id) {
        if (field === 'current' && value === true) {
          setRawDateInputs(prev => ({ ...prev, [id]: { ...prev[id], endDate: '' } }));
          return { ...exp, [field]: value, endDate: '' };
        }
        return { ...exp, [field]: value };
      }
      return exp;
    });
    
    onChange(updatedExperiences);
    
    if (errors[id]?.[field as string]) {
      setErrors(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: '',
        },
      }));
    }
  };

  const handleAchievementChange = (experienceId: string, index: number, value: string) => {
    const updatedExperiences = experiences.map(exp => {
      if (exp.id === experienceId) {
        const newAchievements = [...exp.achievements];
        newAchievements[index] = value;
        return { ...exp, achievements: newAchievements };
      }
      return exp;
    });
    
    onChange(updatedExperiences);
  };

  const addAchievement = (experienceId: string) => {
    const updatedExperiences = experiences.map(exp => {
      if (exp.id === experienceId) {
        return { ...exp, achievements: [...exp.achievements, ''] };
      }
      return exp;
    });
    
    onChange(updatedExperiences);
  };

  const removeAchievement = (experienceId: string, index: number) => {
    const updatedExperiences = experiences.map(exp => {
      if (exp.id === experienceId) {
        const newAchievements = [...exp.achievements];
        newAchievements.splice(index, 1);
        return { ...exp, achievements: newAchievements.length ? newAchievements : [''] };
      }
      return exp;
    });
    
    onChange(updatedExperiences);
  };

  const addExperience = () => {
    const newExperience: Experience = {
      id: generateId(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [''],
    };
    
    const newCollapsedState: Record<string, boolean> = {};
    experiences.forEach(exp => {
      newCollapsedState[exp.id] = true;
    });
    setCollapsedCards(newCollapsedState);
    
    onChange([...experiences, newExperience]);
  };

  const removeExperience = (id: string) => {
    if (experiences.length === 1) {
      const clearedExperience: Experience = {
        id: generateId(),
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        achievements: [''],
      };
      onChange([clearedExperience]);
    } else {
      onChange(experiences.filter(exp => exp.id !== id));
      
      setCollapsedCards(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  const validateFields = () => {
    let isValid = true;
    const newErrors: Record<string, Record<string, string>> = {};
    
    experiences.forEach(exp => {
      const expErrors: Record<string, string> = {};
      
      if (!exp.company.trim()) {
        expErrors.company = 'Empresa é obrigatória';
        isValid = false;
      }
      
      if (!exp.position.trim()) {
        expErrors.position = 'Cargo é obrigatório';
        isValid = false;
      }
      
      if (!exp.startDate.trim()) {
        expErrors.startDate = 'Data de início é obrigatória';
        isValid = false;
      }
      
      if (!exp.current && !exp.endDate.trim()) {
        expErrors.endDate = 'Data de término é obrigatória';
        isValid = false;
      }
      
      if (Object.keys(expErrors).length > 0) {
        newErrors[exp.id] = expErrors;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  React.useEffect(() => {
    if (typeof (window as any).__validateExperiences === 'undefined') {
      (window as any).__validateExperiences = validateFields;
    }
    return () => {
      delete (window as any).__validateExperiences;
    };
  }, [experiences]);

  const applySuggestion = (experienceId: string, suggestion: string) => {
    handleChange(experienceId, 'description', suggestion.replace(/\[X\]|\[Y\]%/g, '___'));
  };

  const toggleCardCollapse = (id: string) => {
    setCollapsedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">Experiência Profissional</h2>
      <p className="text-muted-foreground">Adicione suas experiências profissionais mais relevantes.</p>
      
      {experiences.map((exp, index) => {
        const isCollapsed = collapsedCards[exp.id];
        return (
          <Card key={exp.id} className="bg-card border border-border overflow-hidden">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-muted/50" 
              onClick={() => toggleCardCollapse(exp.id)}
            >
              <h3 className="text-lg font-medium text-foreground">
                {exp.position || `Experiência ${index + 1}`}
                {exp.company ? ` at ${exp.company}` : ''}
              </h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); removeExperience(exp.id); }}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
                {isCollapsed ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> : <ChevronUp className="h-5 w-5 text-muted-foreground" />}
              </div>
            </div>

            <CardContent className={`pt-4 px-4 pb-6 border-t border-border ${isCollapsed ? 'hidden' : 'block'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor={`company-${exp.id}`} className="text-foreground">Empresa*</Label>
                  <Input
                    id={`company-${exp.id}`}
                    value={exp.company}
                    onChange={(e) => handleChange(exp.id, 'company', e.target.value)}
                    placeholder="Ex: Empresa ABC Ltda."
                    className="mt-1 bg-input border-border text-foreground"
                  />
                  {errors[exp.id]?.company && <p className="text-sm text-destructive mt-1">{errors[exp.id].company}</p>}
                </div>
                <div>
                  <Label htmlFor={`position-${exp.id}`} className="text-foreground">Cargo*</Label>
                  <Input
                    id={`position-${exp.id}`}
                    value={exp.position}
                    onChange={(e) => handleChange(exp.id, 'position', e.target.value)}
                    placeholder="Ex: Gerente de Marketing"
                    className="mt-1 bg-input border-border text-foreground"
                  />
                  {errors[exp.id]?.position && <p className="text-sm text-destructive mt-1">{errors[exp.id].position}</p>}
                </div>
                <div>
                  <Label htmlFor={`location-${exp.id}`} className="text-foreground">Localização</Label>
                  <Input
                    id={`location-${exp.id}`}
                    value={exp.location}
                    onChange={(e) => handleChange(exp.id, 'location', e.target.value)}
                    placeholder="Ex: São Paulo, SP"
                    className="mt-1 bg-input border-border text-foreground"
                  />
                </div>
                <div></div> 
                <div>
                  <Label htmlFor={`startDate-${exp.id}`} className="text-foreground">Data de Início*</Label>
                  <Input
                    id={`startDate-${exp.id}`}
                    type="text"
                    value={rawDateInputs[exp.id]?.startDate || ''}
                    onChange={(e) => handleRawDateChange(exp.id, 'startDate', e.target.value)}
                    onBlur={() => handleDateBlur(exp.id, 'startDate')}
                    placeholder="MM/YYYY"
                    maxLength={7}
                    className="mt-1 bg-input border-border text-foreground"
                  />
                  {errors[exp.id]?.startDate && <p className="text-sm text-destructive mt-1">{errors[exp.id].startDate}</p>}
                </div>
                <div>
                  <Label htmlFor={`endDate-${exp.id}`} className="text-foreground">Data de Término*</Label>
                  <Input
                    id={`endDate-${exp.id}`}
                    type="text"
                    value={exp.current ? '' : (rawDateInputs[exp.id]?.endDate || '')}
                    onChange={(e) => handleRawDateChange(exp.id, 'endDate', e.target.value)}
                    onBlur={() => handleDateBlur(exp.id, 'endDate')}
                    placeholder="MM/YYYY"
                    disabled={exp.current}
                    maxLength={7}
                    className={`mt-1 bg-input border-border text-foreground ${exp.current ? 'disabled:opacity-50 disabled:cursor-not-allowed' : ''}`}
                  />
                   {errors[exp.id]?.endDate && <p className="text-sm text-destructive mt-1">{errors[exp.id].endDate}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <Switch 
                  id={`current-${exp.id}`} 
                  checked={exp.current}
                  onCheckedChange={(checked) => handleChange(exp.id, 'current', checked)}
                  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
                />
                <Label htmlFor={`current-${exp.id}`} className="text-foreground">Emprego Atual</Label>
              </div>

              <div className="mb-4">
                <Label htmlFor={`description-${exp.id}`} className="text-foreground">Descrição da Função</Label>
                <Textarea
                  id={`description-${exp.id}`}
                  value={exp.description}
                  onChange={(e) => handleChange(exp.id, 'description', e.target.value)}
                  placeholder="Descreva suas principais responsabilidades e realizações neste cargo."
                  rows={4}
                  className="mt-1 bg-input border-border text-foreground"
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-2 text-xs text-muted-foreground">
                      <Lightbulb className="mr-1 h-3 w-3" /> Sugestões
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-popover border-border">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none text-popover-foreground">Sugestões de Descrição</h4>
                        <p className="text-sm text-muted-foreground">
                          Clique para aplicar uma sugestão inicial.
                        </p>
                      </div>
                      <div className="grid gap-2 max-h-48 overflow-y-auto">
                        {JOB_DESCRIPTION_SUGGESTIONS.map((sugg, i) => (
                          <Button 
                            key={i} 
                            variant="ghost" 
                            size="sm"
                            className="justify-start text-left h-auto whitespace-normal text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                            onClick={() => applySuggestion(exp.id, sugg)}
                          >
                            {sugg.length > 50 ? sugg.substring(0, 50) + '...' : sugg}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label className="text-foreground">Principais Realizações (Opcional)</Label>
                <p className="text-xs text-muted-foreground mb-2">Liste conquistas quantificáveis ou projetos notáveis.</p>
                {exp.achievements.map((achievement, achIndex) => (
                  <div key={achIndex} className="flex items-center gap-2 mb-2">
                    <Input
                      type="text"
                      value={achievement}
                      onChange={(e) => handleAchievementChange(exp.id, achIndex, e.target.value)}
                      placeholder={`Ex: Aumentei as vendas em 15% em 6 meses`}
                      className="flex-grow bg-input border-border text-foreground"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeAchievement(exp.id, achIndex)} 
                      disabled={exp.achievements.length === 1}
                      className="text-muted-foreground hover:text-destructive disabled:opacity-50"
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addAchievement(exp.id)} className="mt-1 text-xs">
                  <PlusCircle className="mr-1 h-3 w-3" /> Adicionar Realização
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Button variant="secondary" onClick={addExperience} className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Adicionar Experiência
      </Button>
    </div>
  );
};

export default ExperienceForm;
