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
    <div className="space-y-6 animate-fade-in text-gray-100">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Experiência Profissional</h2>
        <p className="text-muted-foreground">
          Adicione suas experiências profissionais mais relevantes.
        </p>
      </div>

      <div className="space-y-4">
        {experiences.map((experience, index) => (
          <Card key={experience.id} className="relative overflow-hidden rounded-none border-[#fab73d]/50 bg-[#204c39]">
            <div 
              className="collapsible-card-header bg-[#2a5c4a]"
              onClick={() => toggleCardCollapse(experience.id)}
            >
              <div className="flex items-center gap-2">
                {collapsedCards[experience.id] ? (
                  <PlusCircle className="h-4 w-4 text-[#fab73d]" />
                ) : (
                  <MinusCircle className="h-4 w-4 text-[#fab73d]" />
                )}
                <span className="font-medium text-white">
                  {experience.company ? experience.company : `Experiência ${index + 1}`}
                  {experience.position && ` - ${experience.position}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {experiences.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeExperience(experience.id);
                    }}
                    title="Remover experiência"
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                {collapsedCards[experience.id] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </div>
            </div>
            
            <div className={`collapsible-card-content ${collapsedCards[experience.id] ? 'collapsed' : 'expanded'}`}>
              <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor={`company-${experience.id}`} className="font-medium text-gray-200">
                    Empresa <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`company-${experience.id}`}
                    value={experience.company}
                    onChange={(e) => handleChange(experience.id, 'company', e.target.value)}
                    placeholder="Ex: Empresa ABC Ltda."
                    className={`rounded-sm bg-gray-900 border-gray-700 focus:border-[#fab73d] focus:ring-[#fab73d] text-white ${errors[experience.id]?.company ? 'border-destructive' : ''}`}
                  />
                  {errors[experience.id]?.company && (
                    <p className="text-xs text-destructive">{errors[experience.id].company}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`position-${experience.id}`} className="font-medium text-gray-200">
                    Cargo <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`position-${experience.id}`}
                    value={experience.position}
                    onChange={(e) => handleChange(experience.id, 'position', e.target.value)}
                    placeholder="Ex: Gerente de Marketing"
                    className={`rounded-sm bg-gray-900 border-gray-700 focus:border-[#fab73d] focus:ring-[#fab73d] text-white ${errors[experience.id]?.position ? 'border-destructive' : ''}`}
                  />
                  {errors[experience.id]?.position && (
                    <p className="text-xs text-destructive">{errors[experience.id].position}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`location-${experience.id}`} className="font-medium text-gray-200">
                    Localização
                  </Label>
                  <Input
                    id={`location-${experience.id}`}
                    value={experience.location}
                    onChange={(e) => handleChange(experience.id, 'location', e.target.value)}
                    placeholder="Ex: São Paulo, SP"
                    className={`rounded-sm bg-gray-900 border-gray-700 focus:border-[#fab73d] focus:ring-[#fab73d] text-white ${errors[experience.id]?.location ? 'border-destructive' : ''}`}
                  />
                </div>

                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`startDate-${experience.id}`} className="font-medium text-gray-200">
                      Data de Início <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`startDate-${experience.id}`}
                      type="text"
                      value={rawDateInputs[experience.id]?.startDate ?? ''}
                      onChange={(e) => handleRawDateChange(experience.id, 'startDate', e.target.value)}
                      onBlur={() => handleDateBlur(experience.id, 'startDate')}
                      placeholder="MM/YYYY"
                      maxLength={7}
                      className={`rounded-sm bg-gray-900 border-gray-700 focus:border-[#fab73d] focus:ring-[#fab73d] text-white ${errors[experience.id]?.startDate ? 'border-destructive' : ''}`}
                    />
                    {errors[experience.id]?.startDate && (
                      <p className="text-xs text-destructive">{errors[experience.id].startDate}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`endDate-${experience.id}`} className="font-medium text-gray-200">
                      Data de Término {!experience.current && <span className="text-destructive">*</span>}
                    </Label>
                    <Input
                      id={`endDate-${experience.id}`}
                      type="text"
                      value={rawDateInputs[experience.id]?.endDate ?? ''}
                      onChange={(e) => handleRawDateChange(experience.id, 'endDate', e.target.value)}
                      onBlur={() => handleDateBlur(experience.id, 'endDate')}
                      placeholder="MM/YYYY"
                      maxLength={7}
                      disabled={experience.current}
                      className={`rounded-sm bg-gray-900 border-gray-700 focus:border-[#fab73d] focus:ring-[#fab73d] text-white ${errors[experience.id]?.endDate ? 'border-destructive' : 'disabled:opacity-50'}`}
                    />
                    {errors[experience.id]?.endDate && (
                      <p className="text-xs text-destructive">{errors[experience.id].endDate}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id={`current-${experience.id}`}
                    checked={experience.current}
                    onCheckedChange={(checked) => handleChange(experience.id, 'current', checked)}
                  />
                  <Label htmlFor={`current-${experience.id}`} className="font-medium cursor-pointer text-gray-200">
                    Emprego Atual
                  </Label>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`description-${experience.id}`} className="font-medium text-gray-200">
                      Descrição da Função
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-xs flex items-center gap-1 rounded-sm border-[#fab73d]/80 text-gray-300 hover:bg-[#9ec378]/20"
                        >
                          <Lightbulb className="h-3 w-3" />
                          Sugestões
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-96">
                        <div className="p-3 border-b bg-muted/50">
                          <p className="font-medium text-sm">Sugestões para descrição:</p>
                        </div>
                        <div className="p-2 max-h-[250px] overflow-y-auto">
                          <div className="space-y-2">
                            {JOB_DESCRIPTION_SUGGESTIONS.map((suggestion, idx) => (
                              <div 
                                key={idx} 
                                className="p-2 bg-background border rounded hover:border-primary cursor-pointer"
                                onClick={() => applySuggestion(experience.id, suggestion)}
                              >
                                <p className="text-sm">{suggestion}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Textarea
                    id={`description-${experience.id}`}
                    value={experience.description}
                    onChange={(e) => handleChange(experience.id, 'description', e.target.value)}
                    placeholder="Descreva suas responsabilidades e realizações neste cargo"
                    className="min-h-[100px] rounded-sm bg-gray-900 border-gray-700 focus:border-[#fab73d] focus:ring-[#fab73d] text-white"
                  />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <Label className="font-medium text-gray-200">Conquistas e Realizações</Label>
                  
                  {experience.achievements.map((achievement, achievementIndex) => (
                    <div key={achievementIndex} className="flex gap-2 items-start">
                      <Input
                        value={achievement}
                        onChange={(e) => handleAchievementChange(experience.id, achievementIndex, e.target.value)}
                        placeholder="Ex: Aumentei as vendas em 30% no primeiro trimestre"
                        className="flex-1 rounded-sm bg-gray-900 border-gray-700 focus:border-[#fab73d] focus:ring-[#fab73d] text-white"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAchievement(experience.id, achievementIndex)}
                        disabled={experience.achievements.length === 1}
                        title="Remover conquista"
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addAchievement(experience.id)}
                    className="flex items-center gap-1 rounded-sm border-[#fab73d]/80 text-gray-300 hover:bg-[#9ec378]/20"
                  >
                    <Plus className="h-4 w-4" /> Adicionar conquista
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}

        <Button
          type="button"
          onClick={addExperience}
          variant="outline"
          className="w-full rounded-sm border-[#fab73d] text-[#fab73d] hover:bg-[#9ec378]/20 hover:text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Adicionar outra experiência
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>Inclua detalhes relevantes sobre cada posição, usando os campos de "Conquistas" para destacar resultados mensuráveis.</p>
      </div>
    </div>
  );
};

export default ExperienceForm;
