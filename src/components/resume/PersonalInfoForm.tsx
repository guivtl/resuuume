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
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">Informações Pessoais</h2>
      <p className="text-muted-foreground">Preencha seus dados básicos.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName" className="text-foreground">Nome Completo*</Label>
          <Input
            id="fullName"
            value={data.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Seu nome completo"
            className="mt-1 bg-input border-border text-foreground"
            required
          />
        </div>
        <div>
          <Label htmlFor="email" className="text-foreground">Email*</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="seu.email@exemplo.com"
            className="mt-1 bg-input border-border text-foreground"
            required
          />
        </div>
        <div>
          <Label htmlFor="phone" className="text-foreground">Telefone*</Label>
          <Input
            id="phone"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="(XX) XXXXX-XXXX"
            className="mt-1 bg-input border-border text-foreground"
            required
          />
        </div>
        <div>
          <Label htmlFor="location" className="text-foreground">Localização*</Label>
          <Input
            id="location"
            value={data.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="Cidade, Estado"
            className="mt-1 bg-input border-border text-foreground"
            required
          />
        </div>
        <div>
          <Label htmlFor="linkedin" className="text-foreground">LinkedIn</Label>
          <Input
            id="linkedin"
            value={data.linkedin}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            placeholder="linkedin.com/in/seu-perfil"
            className="mt-1 bg-input border-border text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="website" className="text-foreground">Website/Portfólio</Label>
          <Input
            id="website"
            value={data.portfolio}
            onChange={(e) => handleChange('portfolio', e.target.value)}
            placeholder="seusite.com"
            className="mt-1 bg-input border-border text-foreground"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
