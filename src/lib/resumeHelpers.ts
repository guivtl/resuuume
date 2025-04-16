import { ResumeData } from '@/types/resume';

export const INITIAL_RESUME_DATA: ResumeData = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
  },
  objective: '',
  experiences: [
    {
      id: '1',
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [''],
    },
  ],
  education: [
    {
      id: '1',
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    },
  ],
  skills: [''],
  languages: [
    {
      language: '',
      proficiency: 'Básico',
    },
  ],
  certifications: [
    {
      id: '1',
      name: '',
      issuer: '',
      date: '',
      url: '',
    },
  ],
  additionalSections: [],
};

// For backwards compatibility
export const InitialResumeState = INITIAL_RESUME_DATA;

export const SKILL_SUGGESTIONS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Angular',
  'Vue.js',
  'Node.js',
  'Express',
  'Next.js',
  'Python',
  'Django',
  'Flask',
  'Java',
  'Spring Boot',
  'C#',
  '.NET Core',
  'PHP',
  'Laravel',
  'Ruby on Rails',
  'SQL',
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Firebase',
  'Redis',
  'GraphQL',
  'REST API',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'Google Cloud',
  'CI/CD',
  'Git',
  'GitHub Actions',
  'Jest',
  'Cypress',
  'TDD',
  'Scrum',
  'Kanban',
  'UI/UX Design',
  'Figma',
  'Responsive Design',
  'HTML5',
  'CSS3',
  'SASS/SCSS',
  'Tailwind CSS',
  'Bootstrap',
  'Material UI',
  'Web Accessibility',
  'Microservices',
  'Performance Optimization',
  'WebSockets',
  'PWA',
  'Mobile Development',
  'React Native',
  'Flutter',
  'Swift',
  'Kotlin',
  'DevOps',
  'Linux',
  'Bash Scripting',
  'Blockchain',
  'Machine Learning',
  'TensorFlow',
];

export const JOB_DESCRIPTION_SUGGESTIONS = [
  'Desenvolvi e mantive aplicações web com React.js, Node.js e PostgreSQL, atendendo a mais de X usuários ativos mensais.',
  'Implementei arquitetura de microserviços que reduziu o tempo de carregamento da aplicação em X% e aumentou a escalabilidade do sistema.',
  'Liderei a migração de uma aplicação legada para tecnologias modernas (React, TypeScript, GraphQL), melhorando a performance em X% e reduzindo bugs em Y%.',
  'Colaborei com equipes multidisciplinares em metodologia ágil para entregar recursos de alta qualidade, seguindo padrões de código e prazos estabelecidos.',
  'Desenvolvi APIs RESTful escaláveis e seguras que processam X requisições diárias e mantêm latência média abaixo de Y milissegundos.',
  'Implementei estratégia de testes automatizados (unitários, integração e e2e) que aumentou a cobertura de código para X% e reduziu regressões em Y%.',
  'Otimizei consultas de banco de dados e estruturas de dados que reduziram tempo de resposta em X% e melhoraram a experiência do usuário.',
  'Participei ativamente em code reviews, mentoria de desenvolvedores júnior e documentação de processos e frameworks utilizados.',
  'Conduzi a implementação de CI/CD com GitHub Actions, reduzindo o tempo de deploy em X% e aumentando a frequência de entregas em Y%.',
  'Desenvolvi e implementei recursos de acessibilidade (WCAG) que ampliaram o alcance da aplicação e melhoraram a experiência para todos os usuários.',
  'Refatorei sistemas legados para arquiteturas modernas, melhorando a manutenibilidade e permitindo a implementação de novos recursos de forma mais eficiente.',
  'Projetei e implementei soluções em nuvem (AWS/Azure/GCP) que reduziram custos de infraestrutura em X% e melhoraram a disponibilidade para Y%.',
];

export const languageProficiencyOptions = [
  { value: 'Básico', label: 'Básico' },
  { value: 'Intermediário', label: 'Intermediário' },
  { value: 'Avançado', label: 'Avançado' },
  { value: 'Fluente', label: 'Fluente' },
  { value: 'Nativo', label: 'Nativo' },
];

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Basic validation for Brazilian phone numbers
  const re = /^\(?(\d{2})\)?[-. ]?(\d{4,5})[-. ]?(\d{4})$/;
  return re.test(phone);
};

export const formatPhoneNumber = (value: string): string => {
  if (!value) return value;
  
  // Remove all non-digit characters
  const phoneNumber = value.replace(/[^\d]/g, '');
  
  // Format based on the number length
  if (phoneNumber.length <= 2) {
    return `(${phoneNumber}`;
  }
  if (phoneNumber.length <= 6) {
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
  }
  if (phoneNumber.length <= 10) {
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 6)}-${phoneNumber.slice(6, 10)}`;
  }
  return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};
