import React, { useState } from 'react';
import { Certification } from '@/types/resume';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, ChevronDown, ChevronUp, MinusCircle, PlusCircle } from 'lucide-react';
import { generateId } from '@/lib/resumeHelpers';

interface CertificationsFormProps {
  certifications: Certification[];
  onChange: (certifications: Certification[]) => void;
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

const CertificationsForm: React.FC<CertificationsFormProps> = ({
  certifications,
  onChange,
}) => {
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});
  const [collapsedCards, setCollapsedCards] = useState<Record<string, boolean>>({});
  const [rawDateInputs, setRawDateInputs] = useState<Record<string, string | undefined>>({});

  React.useEffect(() => {
    const initialRawDates: Record<string, string | undefined> = {};
    certifications.forEach(cert => {
      initialRawDates[cert.id] = formatStoredToInputDate(cert.date);
    });
    setRawDateInputs(initialRawDates);
  }, [certifications]);

  const toggleCardCollapse = (id: string) => {
    setCollapsedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRawDateChange = (id: string, rawValue: string) => {
    setRawDateInputs(prev => ({ ...prev, [id]: rawValue }));
    if (errors[id]?.date) {
      setErrors(prev => ({ ...prev, [id]: { ...prev[id], date: '' } }));
    }
  };

  const handleDateBlur = (id: string) => {
    const rawValue = rawDateInputs[id] || '';
    const storedValue = formatInputToStoredDate(rawValue);
    handleChange(id, 'date', storedValue);
    setRawDateInputs(prev => ({ ...prev, [id]: formatStoredToInputDate(storedValue) }));
  };

  const handleChange = (id: string, field: keyof Certification, value: string) => {
    if (field === 'date') {
      const updatedCertifications = certifications.map(cert => 
        cert.id === id ? { ...cert, date: value } : cert
      );
      onChange(updatedCertifications);
      return;
    }

    const updatedCertifications = certifications.map(cert => {
      if (cert.id === id) {
        return { ...cert, [field]: value };
      }
      return cert;
    });
    
    onChange(updatedCertifications);
    
    // Clear error for the field if it exists
    if (errors[id]?.[field]) {
      setErrors(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: '',
        },
      }));
    }
  };

  const addCertification = () => {
    const newCertification: Certification = {
      id: generateId(),
      name: '',
      issuer: '',
      date: '',
      url: '',
    };
    
    // Auto-collapse other cards when adding a new one
    const newCollapsedState: Record<string, boolean> = {};
    certifications.forEach(cert => {
      newCollapsedState[cert.id] = true;
    });
    setCollapsedCards(newCollapsedState);
    
    onChange([...certifications, newCertification]);
  };

  const removeCertification = (id: string) => {
    if (certifications.length === 1) {
      // If it's the last one, just clear it instead of removing
      const clearedCertification: Certification = {
        id: generateId(),
        name: '',
        issuer: '',
        date: '',
        url: '',
      };
      onChange([clearedCertification]);
    } else {
      onChange(certifications.filter(cert => cert.id !== id));
      
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
    
    certifications.forEach(cert => {
      const certErrors: Record<string, string> = {};
      
      if (!cert.name.trim()) {
        certErrors.name = 'Nome da certificação é obrigatório';
        isValid = false;
      }
      
      if (!cert.issuer.trim()) {
        certErrors.issuer = 'Emissor é obrigatório';
        isValid = false;
      }
      
      if (Object.keys(certErrors).length > 0) {
        newErrors[cert.id] = certErrors;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  // Expose validation method to parent components
  React.useEffect(() => {
    if (typeof (window as any).__validateCertifications === 'undefined') {
      (window as any).__validateCertifications = validateFields;
    }
    return () => {
      delete (window as any).__validateCertifications;
    };
  }, [certifications]);

  return (
    <div className="space-y-6 animate-fade-in text-gray-100">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Certificações</h2>
        <p className="text-muted-foreground">
          Adicione suas certificações e formações complementares.
        </p>
      </div>

      <div className="space-y-4">
        {certifications.map((certification, index) => (
          <Card key={certification.id} className="relative overflow-hidden rounded-none border-[#fab73d]/50 bg-[#204c39]">
            <div 
              className="collapsible-card-header bg-[#2a5c4a]"
              onClick={() => toggleCardCollapse(certification.id)}
            >
              <div className="flex items-center gap-2">
                {collapsedCards[certification.id] ? (
                  <PlusCircle className="h-4 w-4 text-[#fab73d]" />
                ) : (
                  <MinusCircle className="h-4 w-4 text-[#fab73d]" />
                )}
                <span className="font-medium text-white">
                  {certification.name ? certification.name : `Certificação ${index + 1}`}
                  {certification.issuer && ` - ${certification.issuer}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {certifications.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCertification(certification.id);
                    }}
                    title="Remover certificação"
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                {collapsedCards[certification.id] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </div>
            </div>
            
            <div className={`collapsible-card-content ${collapsedCards[certification.id] ? 'collapsed' : 'expanded'}`}>
              <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor={`name-${certification.id}`} className="font-medium text-gray-200">
                    Nome da Certificação <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`name-${certification.id}`}
                    value={certification.name}
                    onChange={(e) => handleChange(certification.id, 'name', e.target.value)}
                    placeholder="Ex: Certified Scrum Master (CSM)"
                    className={`rounded-sm bg-gray-900 border-gray-700 focus:border-[#fab73d] focus:ring-[#fab73d] text-white ${errors[certification.id]?.name ? 'border-destructive' : ''}`}
                  />
                  {errors[certification.id]?.name && (
                    <p className="text-xs text-destructive">{errors[certification.id].name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`issuer-${certification.id}`} className="font-medium text-gray-200">
                    Emissor <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`issuer-${certification.id}`}
                    value={certification.issuer}
                    onChange={(e) => handleChange(certification.id, 'issuer', e.target.value)}
                    placeholder="Ex: Scrum Alliance"
                    className={`rounded-sm bg-gray-900 border-gray-700 focus:border-[#fab73d] focus:ring-[#fab73d] text-white ${errors[certification.id]?.issuer ? 'border-destructive' : ''}`}
                  />
                  {errors[certification.id]?.issuer && (
                    <p className="text-xs text-destructive">{errors[certification.id].issuer}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`date-${certification.id}`} className="font-medium text-gray-200">
                    Data
                  </Label>
                  <Input
                    id={`date-${certification.id}`}
                    type="text"
                    value={rawDateInputs[certification.id] ?? ''} 
                    onChange={(e) => handleRawDateChange(certification.id, e.target.value)} 
                    onBlur={() => handleDateBlur(certification.id)} 
                    placeholder="MM/YYYY"
                    maxLength={7}
                    className={`rounded-sm bg-gray-900 border-gray-700 focus:border-[#fab73d] focus:ring-[#fab73d] text-white`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`url-${certification.id}`} className="font-medium text-gray-200">
                    URL (opcional)
                  </Label>
                  <Input
                    id={`url-${certification.id}`}
                    value={certification.url}
                    onChange={(e) => handleChange(certification.id, 'url', e.target.value)}
                    placeholder="Ex: https://www.credential.net/abc123"
                    className={`rounded-sm bg-gray-900 border-gray-700 focus:border-[#fab73d] focus:ring-[#fab73d] text-white`}
                  />
                </div>
              </CardContent>
            </div>
          </Card>
        ))}

        <Button
          type="button"
          onClick={addCertification}
          variant="outline"
          className="w-full rounded-sm border-[#fab73d] text-[#fab73d] hover:bg-[#9ec378]/20 hover:text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Adicionar outra certificação
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>Certifique-se de incluir certificações relevantes para a posição desejada.</p>
      </div>
    </div>
  );
};

export default CertificationsForm;
