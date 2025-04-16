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
    <div className="space-y-6 animate-fade-in text-gray-100">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Formação Acadêmica</h2>
        <p className="text-muted-foreground">
          Adicione sua formação acadêmica e cursos relevantes.
        </p>
      </div>

      <div className="space-y-4">
        {education.map((edu, index) => (
          <Card key={edu.id} className="relative overflow-hidden rounded-none border-[#fab73d]/50 bg-[#204c39]">
            <div 
              className="collapsible-card-header bg-[#2a5c4a]"
              onClick={() => toggleCardCollapse(edu.id)}
            >
              <div className="flex items-center gap-2">
                {collapsedCards[edu.id] ? (
                  <PlusCircle className="h-4 w-4 text-[#fab73d]" />
                ) : (
                  <MinusCircle className="h-4 w-4 text-[#fab73d]" />
                )}
                <span className="font-medium text-white">
                  {edu.institution ? edu.institution : `Formação ${index + 1}`}
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
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                {collapsedCards[edu.id] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </div>
            </div>
            
            <div className={`collapsible-card-content ${collapsedCards[edu.id] ? 'collapsed' : 'expanded'}`}>
              <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor={`institution-${edu.id}`} className="font-medium text-gray-200">
                    Instituição <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`institution-${edu.id}`}
                    value={edu.institution}
                    onChange={(e) => handleChange(edu.id, 'institution', e.target.value)}
                    placeholder="Ex: Universidade de São Paulo"
                    className={`rounded-sm bg-gray-900 border-gray-700 focus:border-[#fab73d] focus:ring-[#fab73d] text-white ${errors[edu.id]?.institution ? 'border-destructive' : ''}`}
                  />
                  {errors[edu.id]?.institution && (
                    <p className="text-xs text-destructive">{errors[edu.id].institution}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`degree-${edu.id}`} className="font-medium text-gray-200">
                    Grau <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`degree-${edu.id}`}
                    value={edu.degree}
                    onChange={(e) => handleChange(edu.id, 'degree', e.target.value)}
                    placeholder="Ex: Bacharelado, Mestrado, Técnico"
                    className={`rounded-sm bg-gray-900 border-gray-700 focus:border-[#fab73d] focus:ring-[#fab73d] text-white ${errors[edu.id]?.degree ? 'border-destructive' : ''}`}
                  />
                  {errors[edu.id]?.degree && (
                    <p className="text-xs text-destructive">{errors[edu.id].degree}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`field-${edu.id}`} className="font-medium text-gray-200">
                    Área de Estudo
                  </Label>
                  <Input
                    id={`field-${edu.id}`}
                    value={edu.field}
                    onChange={(e) => handleChange(edu.id, 'field', e.target.value)}
                    placeholder="Ex: Administração, Ciência da Computação"
                    className={`rounded-sm bg-gray-900 border-gray-700 focus:border-[#fab73d] focus:ring-[#fab73d] text-white ${errors[edu.id]?.field ? 'border-destructive' : ''}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`location-${edu.id}`} className="font-medium text-gray-200">
                    Localização
                  </Label>
                  <Input
                    id={`location-${edu.id}`}
                    value={edu.location}
                    onChange={(e) => handleChange(edu.id, 'location', e.target.value)}
                    placeholder="Ex: São Paulo, SP"
                    className={`rounded-sm bg-gray-900 border-gray-700 focus:border-[#fab73d] focus:ring-[#fab73d] text-white ${errors[edu.id]?.location ? 'border-destructive' : ''}`}
                  />
                </div>

                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`startDate-${edu.id}`} className="font-medium text-gray-200">
                      Data de Início <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`startDate-${edu.id}`}
                      type="text"
                      value={rawDateInputs[edu.id]?.startDate ?? ''} 
                      onChange={(e) => handleRawDateChange(edu.id, 'startDate', e.target.value)} 
                      onBlur={() => handleDateBlur(edu.id, 'startDate')} 
                      placeholder="MM/YYYY"
                      maxLength={7}
                      className={`rounded-sm bg-gray-900 border-gray-700 focus:border-[#fab73d] focus:ring-[#fab73d] text-white ${errors[edu.id]?.startDate ? 'border-destructive' : ''}`}
                    />
                    {errors[edu.id]?.startDate && (
                      <p className="text-xs text-destructive">{errors[edu.id].startDate}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`endDate-${edu.id}`} className="font-medium text-gray-200">
                      Data de Término {!edu.current && <span className="text-destructive">*</span>}
                    </Label>
                    <Input
                      id={`endDate-${edu.id}`}
                      type="text"
                      value={rawDateInputs[edu.id]?.endDate ?? ''} 
                      onChange={(e) => handleRawDateChange(edu.id, 'endDate', e.target.value)} 
                      onBlur={() => handleDateBlur(edu.id, 'endDate')} 
                      placeholder="MM/YYYY"
                      maxLength={7}
                      disabled={edu.current}
                      className={`rounded-sm bg-gray-900 border-gray-700 focus:border-[#fab73d] focus:ring-[#fab73d] text-white ${errors[edu.id]?.endDate ? 'border-destructive' : 'disabled:opacity-50'}`}
                    />
                    {errors[edu.id]?.endDate && (
                      <p className="text-xs text-destructive">{errors[edu.id].endDate}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id={`current-${edu.id}`}
                    checked={edu.current}
                    onCheckedChange={(checked) => handleChange(edu.id, 'current', checked)}
                  />
                  <Label htmlFor={`current-${edu.id}`} className="font-medium cursor-pointer text-gray-200">
                    Em andamento
                  </Label>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor={`description-${edu.id}`} className="font-medium text-gray-200">
                    Descrição (opcional)
                  </Label>
                  <Textarea
                    id={`description-${edu.id}`}
                    value={edu.description}
                    onChange={(e) => handleChange(edu.id, 'description', e.target.value)}
                    placeholder="Descreva destaques acadêmicos, projetos relevantes, etc."
                    className="min-h-[100px] rounded-sm bg-gray-900 border-gray-700 focus:border-[#fab73d] focus:ring-[#fab73d] text-white"
                  />
                </div>
              </CardContent>
            </div>
          </Card>
        ))}

        <Button
          type="button"
          onClick={addEducation}
          variant="outline"
          className="w-full rounded-sm border-[#fab73d] text-[#fab73d] hover:bg-[#9ec378]/20 hover:text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Adicionar outra formação
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>Liste suas formações da mais recente para a mais antiga.</p>
      </div>
    </div>
  );
};

export default EducationForm;
