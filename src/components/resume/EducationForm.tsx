import React, { useState } from 'react';
import { Education } from '@/types/resume';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ChevronDown, ChevronUp, MinusCircle, PlusCircle } from 'lucide-react';
import { generateId } from '@/lib/resumeHelpers';

interface EducationFormProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

// Helper function to format date string from MM/YYYY to YYYY-MM
const formatInputToStoredDate = (input: string): string => {
  const parts = input.replace(/[^\d]/g, '').match(/(\d{1,2})(\d{4})/);
  if (parts && parts.length === 3) {
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    if (parseInt(month) >= 1 && parseInt(month) <= 12) {
      return `${year}-${month}`;
    }
  }
  return '';
};

// Helper function to format stored date YYYY-MM to MM/YYYY for display
const formatStoredToInputDate = (stored: string): string => {
  if (!stored || !/^\d{4}-\d{2}$/.test(stored)) return '';
  const [year, month] = stored.split('-');
  return `${month}/${year}`;
};

const EducationForm: React.FC<EducationFormProps> = ({ education, onChange }) => {
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});
  const [collapsedCards, setCollapsedCards] = useState<Record<string, boolean>>({});
  const [rawDateInputs, setRawDateInputs] = useState<Record<string, {startDate?: string; endDate?: string}>>({});

  React.useEffect(() => {
    const initialRawDates: Record<string, {startDate?: string; endDate?: string}> = {};
    education.forEach(edu => {
      initialRawDates[edu.id] = {
        startDate: formatStoredToInputDate(edu.startDate),
        endDate: formatStoredToInputDate(edu.endDate)
      };
    });
    setRawDateInputs(initialRawDates);
  }, [education]);

  const toggleCardCollapse = (id: string) => {
    setCollapsedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRawDateChange = (id: string, field: 'startDate' | 'endDate', rawValue: string) => {
    setRawDateInputs(prev => ({ ...prev, [id]: { ...prev[id], [field]: rawValue } }));
    if (errors[id]?.[field]) {
      setErrors(prev => ({ ...prev, [id]: { ...prev[id], [field]: '' } }));
    }
  };

  const handleDateBlur = (id: string, field: 'startDate' | 'endDate') => {
    const rawValue = rawDateInputs[id]?.[field] || '';
    const storedValue = formatInputToStoredDate(rawValue);
    handleChange(id, field, storedValue);
    setRawDateInputs(prev => ({ ...prev, [id]: { ...prev[id], [field]: formatStoredToInputDate(storedValue) } }));
  };

  const handleChange = (id: string, field: keyof Education, value: any) => {
    if (field === 'startDate' || field === 'endDate') {
       const updatedEducation = education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      );
      onChange(updatedEducation);
      return; 
    }

    const updatedEducation = education.map(edu => {
      if (edu.id === id) {
        if (field === 'current' && value === true) {
          setRawDateInputs(prev => ({ ...prev, [id]: { ...prev[id], endDate: '' } }));
          return { ...edu, [field]: value, endDate: '' };
        }
        return { ...edu, [field]: value };
      }
      return edu;
    });
    
    onChange(updatedEducation);
    
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

  const addEducation = () => {
    const newEducation: Education = {
      id: generateId(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    
    // Auto-collapse other cards when adding a new one
    const newCollapsedState: Record<string, boolean> = {};
    education.forEach(edu => {
      newCollapsedState[edu.id] = true;
    });
    setCollapsedCards(newCollapsedState);
    
    onChange([...education, newEducation]);
  };

  const removeEducation = (id: string) => {
    if (education.length === 1) {
      // If it's the last one, just clear it instead of removing
      const clearedEducation: Education = {
        id: generateId(),
        institution: '',
        degree: '',
        field: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
      };
      onChange([clearedEducation]);
    } else {
      onChange(education.filter(edu => edu.id !== id));
      
      // Remove the collapsed state for this id
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
    
    education.forEach(edu => {
      const eduErrors: Record<string, string> = {};
      
      if (!edu.institution.trim()) {
        eduErrors.institution = 'Instituição é obrigatória';
        isValid = false;
      }
      
      if (!edu.degree.trim()) {
        eduErrors.degree = 'Grau é obrigatório';
        isValid = false;
      }
      
      if (!edu.startDate.trim()) {
        eduErrors.startDate = 'Data de início é obrigatória';
        isValid = false;
      }
      
      if (!edu.current && !edu.endDate.trim()) {
        eduErrors.endDate = 'Data de término é obrigatória';
        isValid = false;
      }
      
      if (Object.keys(eduErrors).length > 0) {
        newErrors[edu.id] = eduErrors;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  // Expose validation method to parent components
  React.useEffect(() => {
    if (typeof (window as any).__validateEducation === 'undefined') {
      (window as any).__validateEducation = validateFields;
    }
    return () => {
      delete (window as any).__validateEducation;
    };
  }, [education]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Formação Acadêmica</h2>
        <p className="text-muted-foreground">
          Adicione sua formação acadêmica e cursos relevantes.
        </p>
      </div>

      <div className="space-y-4">
        {education.map((edu, index) => (
          <Card key={edu.id} className="bg-card border border-border overflow-hidden">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-muted/50"
              onClick={() => toggleCardCollapse(edu.id)}
            >
              <div className="flex items-center gap-2">
                {collapsedCards[edu.id] ? (
                  <PlusCircle className="h-5 w-5 text-primary" />
                ) : (
                  <MinusCircle className="h-5 w-5 text-primary" />
                )}
                <span className="text-lg font-medium text-foreground">
                  {edu.institution || `Formação ${index + 1}`}
                  {edu.degree && ` - ${edu.degree}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {education.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeEducation(edu.id);
                    }}
                    title="Remover formação"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
                {collapsedCards[edu.id] ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>
            
            <CardContent className={`pt-4 px-4 pb-6 border-t border-border ${collapsedCards[edu.id] ? 'hidden' : 'block'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor={`institution-${edu.id}`} className="text-foreground">
                    Instituição <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`institution-${edu.id}`}
                    value={edu.institution}
                    onChange={(e) => handleChange(edu.id, 'institution', e.target.value)}
                    placeholder="Ex: Universidade Federal..."
                    className={`mt-1 bg-input border-border text-foreground ${errors[edu.id]?.institution ? 'border-destructive' : ''}`}
                  />
                  {errors[edu.id]?.institution && (
                    <p className="text-sm text-destructive mt-1">{errors[edu.id].institution}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`degree-${edu.id}`} className="text-foreground">
                    Grau <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`degree-${edu.id}`}
                    value={edu.degree}
                    onChange={(e) => handleChange(edu.id, 'degree', e.target.value)}
                    placeholder="Ex: Bacharelado, Técnico"
                    className={`mt-1 bg-input border-border text-foreground ${errors[edu.id]?.degree ? 'border-destructive' : ''}`}
                  />
                  {errors[edu.id]?.degree && (
                    <p className="text-sm text-destructive mt-1">{errors[edu.id].degree}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`field-${edu.id}`} className="text-foreground">Área de Estudo</Label>
                  <Input
                    id={`field-${edu.id}`}
                    value={edu.field}
                    onChange={(e) => handleChange(edu.id, 'field', e.target.value)}
                    placeholder="Ex: Ciência da Computação"
                    className="mt-1 bg-input border-border text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`location-${edu.id}`} className="text-foreground">Localização</Label>
                  <Input
                    id={`location-${edu.id}`}
                    value={edu.location}
                    onChange={(e) => handleChange(edu.id, 'location', e.target.value)}
                    placeholder="Ex: Rio de Janeiro, RJ"
                    className="mt-1 bg-input border-border text-foreground"
                  />
                </div>

                <div className="space-y-2">
                   <Label htmlFor={`startDate-${edu.id}`} className="text-foreground">Data de Início*</Label>
                   <Input
                    id={`startDate-${edu.id}`}
                    type="text"
                    value={rawDateInputs[edu.id]?.startDate || ''}
                    onChange={(e) => handleRawDateChange(edu.id, 'startDate', e.target.value)}
                    onBlur={() => handleDateBlur(edu.id, 'startDate')}
                    placeholder="MM/YYYY"
                    maxLength={7}
                    className={`mt-1 bg-input border-border text-foreground ${errors[edu.id]?.startDate ? 'border-destructive' : ''}`}
                  />
                  {errors[edu.id]?.startDate && <p className="text-sm text-destructive mt-1">{errors[edu.id].startDate}</p>}
                </div>

                <div className="space-y-2">
                   <Label htmlFor={`endDate-${edu.id}`} className="text-foreground">Data de Término*</Label>
                   <Input
                    id={`endDate-${edu.id}`}
                    type="text"
                    value={edu.current ? '' : (rawDateInputs[edu.id]?.endDate || '')}
                    onChange={(e) => handleRawDateChange(edu.id, 'endDate', e.target.value)}
                    onBlur={() => handleDateBlur(edu.id, 'endDate')}
                    placeholder="MM/YYYY"
                    disabled={edu.current}
                    maxLength={7}
                     className={`mt-1 bg-input border-border text-foreground ${edu.current ? 'disabled:opacity-50 disabled:cursor-not-allowed' : ''} ${errors[edu.id]?.endDate ? 'border-destructive' : ''}`}
                  />
                   {errors[edu.id]?.endDate && <p className="text-sm text-destructive mt-1">{errors[edu.id].endDate}</p>}
                </div>
              </div>
               <div className="flex items-center space-x-2 mt-4 mb-4">
                 <Switch 
                  id={`current-${edu.id}`} 
                  checked={edu.current}
                  onCheckedChange={(checked) => handleChange(edu.id, 'current', checked)}
                  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted"
                />
                <Label htmlFor={`current-${edu.id}`} className="text-foreground">Cursando Atualmente</Label>
              </div>
               <div className="space-y-2">
                 <Label htmlFor={`description-${edu.id}`} className="text-foreground">Descrição (Opcional)</Label>
                 <Textarea
                  id={`description-${edu.id}`}
                  value={edu.description}
                  onChange={(e) => handleChange(edu.id, 'description', e.target.value)}
                  placeholder="Descreva atividades extracurriculares, prêmios ou projetos relevantes."
                  rows={3}
                  className="mt-1 bg-input border-border text-foreground"
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Button 
          type="button" 
          onClick={addEducation} 
          className="mt-4 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Adicionar Formação
        </Button>
      </div>
    </div>
  );
};

export default EducationForm;
