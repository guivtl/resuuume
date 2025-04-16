import React from 'react';
import { PersonalInfo } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { formatPhoneNumber, validateEmail, validatePhone } from '@/lib/resumeHelpers';

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ data, onChange }) => {
  const [errors, setErrors] = React.useState<Partial<Record<keyof PersonalInfo, string>>>({});

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    let formattedValue = value;

    // Format phone numbers
    if (field === 'phone') {
      formattedValue = formatPhoneNumber(value);
    }

    const newData = { ...data, [field]: formattedValue };
    onChange(newData);
    
    // Clear error when field is changed
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateFields = () => {
    const newErrors: Partial<Record<keyof PersonalInfo, string>> = {};
    
    if (!data.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!data.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(data.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!data.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!validatePhone(data.phone)) {
      newErrors.phone = 'Telefone inválido';
    }
    
    if (!data.location.trim()) {
      newErrors.location = 'Localização é obrigatória';
    }
    
    if (data.linkedin && !data.linkedin.trim().includes('linkedin.com/')) {
      newErrors.linkedin = 'URL do LinkedIn inválida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Expose validation method to parent components
  React.useEffect(() => {
    if (typeof (window as any).__validatePersonalInfo === 'undefined') {
      (window as any).__validatePersonalInfo = validateFields;
    }
    return () => {
      delete (window as any).__validatePersonalInfo;
    };
  }, [data]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Informações Pessoais</h2>
        <p className="text-muted-foreground">
          Forneça suas informações de contato para os recrutadores.
        </p>
      </div>

      <Card className="rounded-none border-gray-700">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-medium">
                Nome Completo <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ex: Maria Silva"
                className={`rounded-sm border-gray-600 ${errors.name ? 'border-destructive' : ''}`}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Ex: maria.silva@email.com"
                className={`rounded-sm border-gray-600 ${errors.email ? 'border-destructive' : ''}`}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="font-medium">
                Telefone <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                value={data.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="Ex: (11) 98765-4321"
                className={`rounded-sm border-gray-600 ${errors.phone ? 'border-destructive' : ''}`}
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="font-medium">
                Localização <span className="text-destructive">*</span>
              </Label>
              <Input
                id="location"
                value={data.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Ex: São Paulo, SP"
                className={`rounded-sm border-gray-600 ${errors.location ? 'border-destructive' : ''}`}
              />
              {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin" className="font-medium">
                LinkedIn (opcional)
              </Label>
              <Input
                id="linkedin"
                value={data.linkedin}
                onChange={(e) => handleChange('linkedin', e.target.value)}
                placeholder="Ex: linkedin.com/in/mariasilva"
                className={`rounded-sm border-gray-600 ${errors.linkedin ? 'border-destructive' : ''}`}
              />
              {errors.linkedin && <p className="text-xs text-destructive">{errors.linkedin}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio" className="font-medium">
                Site ou Portfólio (opcional)
              </Label>
              <Input
                id="portfolio"
                value={data.portfolio}
                onChange={(e) => handleChange('portfolio', e.target.value)}
                placeholder="Ex: mariasilva.com.br"
                className={`rounded-sm border-gray-600 ${errors.portfolio ? 'border-destructive' : ''}`}
              />
              {errors.portfolio && <p className="text-xs text-destructive">{errors.portfolio}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        <p>Os campos marcados com <span className="text-destructive">*</span> são obrigatórios.</p>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
