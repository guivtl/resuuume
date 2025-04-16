export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  portfolio?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Language {
  language: string;
  proficiency: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface AdditionalSection {
  id: string;
  title: string;
  content: string[];
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  objective: string;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  languages: Language[];
  certifications: Certification[];
  additionalSections: AdditionalSection[];
}

export enum ResumeTemplateType {
  CLASSIC = 'classic',
}

export interface ResumeTemplate {
  id: ResumeTemplateType;
  name: string;
  description: string;
  color: string;
}

export interface ThemeOption {
  id: string;
  name: string;
  fontFamily: string;
  primaryColor: string;
  preview: React.ReactNode;
}
