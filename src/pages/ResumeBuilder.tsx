import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from 'react-router-dom';
import StepIndicator from "@/components/ui/StepIndicator";
import PersonalInfoForm from "@/components/resume/PersonalInfoForm";
import ObjectiveForm from "@/components/resume/ObjectiveForm";
import ExperienceForm from "@/components/resume/ExperienceForm";
import EducationForm from "@/components/resume/EducationForm";
import SkillsForm from "@/components/resume/SkillsForm";
import LanguagesForm from "@/components/resume/LanguagesForm";
import CertificationsForm from "@/components/resume/CertificationsForm";
import ResumePreview from "@/components/resume/ResumePreview";
import ResumeDropdown from "@/components/resume/ResumeDropdown";
import { generateResumePDF } from '@/lib/pdfGenerator';
import { INITIAL_RESUME_DATA } from '@/lib/resumeHelpers';
import { getSavedResumes, saveResume, loadResume, deleteResume, getResumesList, SavedResume } from '@/lib/storageHelpers';
import { ResumeData } from '@/types/resume';
import { ArrowLeft, ArrowRight, Download, Eye, HelpCircle, Home, Info, Save, List, Clock, Trash2, FileText, MoreHorizontal, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Define initial sections state
const initialSectionsState = {
  objective: true,
  experience: true,
  education: true,
  skills: true,
  languages: true,
  certifications: true,
};

// Example templates
const exampleResumes = [
  {
    title: "Exemplo de Currículo Profissional",
    description: "Modelo para profissionais com mais de 5 anos de experiência",
    preview: "/examples/professional.pdf"
  },
  {
    title: "Exemplo de Primeiro Emprego",
    description: "Ideal para quem está iniciando no mercado de trabalho",
    preview: "/examples/entry-level.pdf"
  },
  {
    title: "Exemplo para Área de TI",
    description: "Estruturado para destacar habilidades técnicas",
    preview: "/examples/tech.pdf"
  }
];

const ResumeBuilder = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [resume, setResume] = useState<ResumeData>(INITIAL_RESUME_DATA);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  // Track which sections are enabled
  const [enabledSections, setEnabledSections] = useState(initialSectionsState);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [examplesOpen, setExamplesOpen] = useState(false);
  const [currentInfo, setCurrentInfo] = useState({
    title: '',
    description: ''
  });
  // Add state to track which sections are visible in the step navigation
  const [sectionsInNav, setSectionsInNav] = useState(initialSectionsState);
  
  // Estados para gerenciar os currículos salvos
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [resumeName, setResumeName] = useState("");
  const [savedResumes, setSavedResumes] = useState<Omit<SavedResume, "data">[]>([]);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);

  // Carregar a lista de currículos salvos
  useEffect(() => {
    const resumes = getResumesList();
    setSavedResumes(resumes);
  }, []);

  // Build steps array based on sections in navigation
  const steps = [
    { id: 'personal-info', title: 'Informações Pessoais', required: true },
  ];

  if (sectionsInNav.objective) {
    steps.push({ id: 'objective', title: 'Objetivo', required: false });
  }
  
  if (sectionsInNav.experience) {
    steps.push({ id: 'experience', title: 'Experiência', required: false });
  }
  
  if (sectionsInNav.education) {
    steps.push({ id: 'education', title: 'Educação', required: false });
  }
  
  if (sectionsInNav.skills) {
    steps.push({ id: 'skills', title: 'Habilidades', required: true });
  }
  
  if (sectionsInNav.languages) {
    steps.push({ id: 'languages', title: 'Idiomas', required: false });
  }
  
  if (sectionsInNav.certifications) {
    steps.push({ id: 'certifications', title: 'Certificações', required: false });
  }

  // Ensure currentStep is valid when steps change
  useEffect(() => {
    if (currentStep >= steps.length) {
      setCurrentStep(steps.length - 1);
    }
  }, [steps, currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Se clicar em "Próximo" no último passo (que agora é "Finalizar e Baixar"),
      // também vai para a preview.
      handleDownload(); 
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDownload = async () => {
    // Esta função no ResumeBuilder agora só lida com o fluxo
    // de clicar em "Finalizar e Baixar"
    if (currentStep === steps.length - 1) {
      setViewMode('preview');
      toast.success('Currículo finalizado! Você pode baixá-lo na visualização.');
    }
    // O download real é tratado pelo botão dentro do ResumePreview
  };

  const showSectionInfo = (title: string, description: string) => {
    setCurrentInfo({ title, description });
    setInfoDialogOpen(true);
  };

  const toggleSection = (section: string, enabled: boolean) => {
    setEnabledSections(prev => ({ ...prev, [section]: enabled }));
    
    // If disabling a section, don't remove it from navigation immediately
    // This allows users to re-enable it
    
    // If disabling the current section, move to next available section
    if (!enabled && steps[currentStep]?.id === section) {
      // Find next enabled section
      let nextStepIndex = currentStep;
      while (nextStepIndex < steps.length - 1) {
        nextStepIndex++;
        if (steps[nextStepIndex]?.id !== section) {
          setCurrentStep(nextStepIndex);
          break;
        }
      }
    }
  };

  // Function to handle navigation visibility of sections
  const toggleSectionInNav = (section: string, visible: boolean) => {
    setSectionsInNav(prev => ({ ...prev, [section]: visible }));
  };

  // Funções para gerenciar currículos salvos
  const handleSaveResume = () => {
    if (!resumeName.trim()) {
      toast.error("Por favor, dê um nome ao seu currículo.");
      return;
    }

    try {
      const saved = saveResume(resumeName, resume);
      setCurrentResumeId(saved.id);
      setSaveDialogOpen(false);
      setResumeName("");
      setSavedResumes(getResumesList());
      toast.success("Currículo salvo com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar o currículo. Tente novamente.");
    }
  };

  const handleLoadResume = (id: string) => {
    try {
      const loaded = loadResume(id);
      if (loaded) {
        setResume(loaded.data);
        setCurrentResumeId(id);
        setLoadDialogOpen(false);
        toast.success(`Currículo "${loaded.name}" carregado com sucesso!`);
      } else {
        toast.error("Não foi possível carregar o currículo.");
      }
    } catch (error) {
      toast.error("Erro ao carregar o currículo. Tente novamente.");
    }
  };

  const confirmDeleteResume = (id: string) => {
    setResumeToDelete(id);
    setConfirmDeleteDialogOpen(true);
  };

  const handleDeleteResume = () => {
    if (!resumeToDelete) return;
    
    try {
      const success = deleteResume(resumeToDelete);
      if (success) {
        if (currentResumeId === resumeToDelete) {
          setCurrentResumeId(null);
        }
        setSavedResumes(getResumesList());
        toast.success("Currículo excluído com sucesso!");
      } else {
        toast.error("Não foi possível excluir o currículo.");
      }
    } catch (error) {
      toast.error("Erro ao excluir o currículo. Tente novamente.");
    } finally {
      setConfirmDeleteDialogOpen(false);
      setResumeToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const renderCurrentStep = () => {
    switch (steps[currentStep]?.id) {
      case 'personal-info':
        return (
          <PersonalInfoForm 
            data={resume.personalInfo} 
            onChange={(personalInfo) => setResume({ ...resume, personalInfo })} 
          />
        );
      case 'objective':
        return (
          <ObjectiveForm 
            objective={resume.objective} 
            onChange={(objective) => setResume({ ...resume, objective })} 
          />
        );
      case 'experience':
        return (
          <ExperienceForm 
            experiences={resume.experiences} 
            onChange={(experiences) => setResume({ ...resume, experiences })} 
          />
        );
      case 'education':
        return (
          <EducationForm 
            education={resume.education} 
            onChange={(education) => setResume({ ...resume, education })} 
          />
        );
      case 'skills':
        return (
          <SkillsForm 
            skills={resume.skills} 
            onChange={(skills) => setResume({ ...resume, skills })} 
          />
        );
      case 'languages':
        return (
          <LanguagesForm 
            languages={resume.languages} 
            onChange={(languages) => setResume({ ...resume, languages })} 
          />
        );
      case 'certifications':
        return (
          <CertificationsForm 
            certifications={resume.certifications} 
            onChange={(certifications) => setResume({ ...resume, certifications })} 
          />
        );
      default:
        return null;
    }
  };

  // Ensure all sections remain in the navigation
  const allSections = [
    { id: 'personal-info', title: 'Informações Pessoais', required: true },
    { id: 'objective', title: 'Objetivo', required: false },
    { id: 'experience', title: 'Experiência', required: false },
    { id: 'education', title: 'Educação', required: false },
    { id: 'skills', title: 'Habilidades', required: true },
    { id: 'languages', title: 'Idiomas', required: false },
    { id: 'certifications', title: 'Certificações', required: false },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">resume</h1>
          <div className="flex gap-2">
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2 text-foreground border-border hover:bg-accent/50 hover:text-foreground rounded-sm">
                <ArrowLeft className="h-4 w-4" /> Voltar
              </Button>
            </Link>
            <Button 
              onClick={() => setViewMode('preview')} 
              disabled={Object.values(resume.personalInfo).every(val => !val)} 
              className="bg-[#fab73d] text-black hover:bg-[#fab73d]/90 rounded-sm"
            >
              <Eye className="mr-2 h-4 w-4" />
              Visualizar
            </Button>
            <ResumeDropdown
              onSave={() => setSaveDialogOpen(true)} 
              onLoad={() => setLoadDialogOpen(true)}
            />
          </div>
        </div>
        
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'edit' | 'preview')} className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="bg-accent border border-border rounded-sm">
              <TabsTrigger value="edit" className="flex items-center gap-2 rounded-sm text-muted-foreground data-[state=active]:bg-[#fab73d] data-[state=active]:text-black">
                <ArrowRight className="h-4 w-4" />
                Editar
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2 rounded-sm text-muted-foreground data-[state=active]:bg-[#fab73d] data-[state=active]:text-black">
                <Eye className="h-4 w-4" />
                Visualizar
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="edit" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <Card className="md:col-span-3 bg-card border border-border h-fit sticky top-4 rounded-none">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-2">
                    {allSections.map((section, index) => (
                      <Button
                        key={section.id}
                        variant={currentStep === index ? "default" : "ghost"}
                        className={`justify-start text-left rounded-sm ${ 
                          currentStep === index 
                            ? "bg-[#fab73d] text-black hover:bg-[#fab73d]/90"
                            : "text-foreground hover:bg-accent/50"
                        } ${!section.required && !sectionsInNav[section.id] && section.id !== 'personal-info' && section.id !== 'skills' ? "opacity-50" : ""}`}
                        onClick={() => {
                          const targetSection = allSections[index].id;
                          if (targetSection === 'personal-info' || targetSection === 'skills' || sectionsInNav[targetSection]) {
                            setCurrentStep(index);
                          }
                        }}
                        disabled={!section.required && !sectionsInNav[section.id] && section.id !== 'personal-info' && section.id !== 'skills'}
                      >
                        {section.title}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-9 bg-card border border-border rounded-none">
                <CardContent className="pt-6">
                  <div className="mt-2">
                    {renderCurrentStep()}
                  </div>
                  
                  <div className="flex justify-between mt-8">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                      className="flex items-center gap-2 text-foreground border-border hover:bg-accent/50 hover:text-foreground rounded-sm"
                    >
                      <ArrowLeft className="h-4 w-4" /> Anterior
                    </Button>
                    <Button
                      onClick={currentStep === steps.length - 1 ? handleDownload : handleNext}
                      className="flex items-center gap-2 bg-[#fab73d] text-black hover:bg-[#fab73d]/90 rounded-sm"
                    >
                      {currentStep === steps.length - 1 ? (
                        <>Finalizar e Baixar <Download className="h-4 w-4" /></>
                      ) : (
                        <>Próximo <ArrowRight className="h-4 w-4" /></>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-0">
            <div className="flex flex-col gap-6 max-w-4xl mx-auto">
              <Card className="bg-card border-border">
                {viewMode === 'preview' && (
                  <ResumePreview 
                    data={resume} 
                    onClose={() => setViewMode('edit')}
                    enabledSections={enabledSections}
                  />
                )}
              </Card>
              
              <div className="flex justify-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setViewMode('edit')} 
                  className="flex items-center gap-2 text-foreground border-border hover:bg-accent/50"
                >
                  <ArrowLeft className="h-4 w-4" /> Voltar para Edição
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Info Dialog */}
        <AlertDialog open={infoDialogOpen} onOpenChange={setInfoDialogOpen}>
          <AlertDialogContent className="bg-card text-foreground border border-border rounded-none">
            <AlertDialogHeader>
              <AlertDialogTitle>{currentInfo.title}</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">{currentInfo.description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction className="bg-[#fab73d] text-black hover:bg-[#fab73d]/90">Entendi</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Save Resume Dialog */}
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogContent className="bg-card text-foreground border border-border rounded-none">
            <DialogHeader>
              <DialogTitle>Salvar Currículo</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Dê um nome ao seu currículo para salvá-lo. Você poderá acessá-lo novamente mais tarde.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="resume-name" className="text-foreground">Nome do Currículo</Label>
                <Input
                  id="resume-name"
                  value={resumeName}
                  onChange={(e) => setResumeName(e.target.value)}
                  placeholder="Ex: Meu Currículo para Desenvolvedor"
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setSaveDialogOpen(false)} variant="outline" className="text-foreground border-border hover:bg-accent/50 rounded-sm">
                Cancelar
              </Button>
              <Button onClick={handleSaveResume} className="bg-[#fab73d] text-black hover:bg-[#fab73d]/90 rounded-sm">
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Load Resume Dialog */}
        <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
          <DialogContent className="bg-card text-foreground border border-border max-w-lg rounded-none">
            <DialogHeader>
              <DialogTitle>Currículos Salvos</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Selecione um currículo salvo para continuar editando.
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[400px] overflow-y-auto">
              {savedResumes.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Você ainda não tem currículos salvos.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedResumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="flex justify-between items-center bg-secondary p-3 rounded-md hover:bg-accent transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{resume.name}</h3>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Atualizado em {formatDate(resume.updatedAt)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLoadResume(resume.id)}
                          className="hover:bg-accent/50 text-foreground"
                        >
                          Carregar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => confirmDeleteResume(resume.id)}
                          className="text-destructive hover:bg-destructive/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setLoadDialogOpen(false)} variant="outline" className="text-foreground border-border hover:bg-accent/50 rounded-sm">
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirm Delete Dialog */}
        <AlertDialog open={confirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
          <AlertDialogContent className="bg-card text-foreground border border-border rounded-none">
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Currículo</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                Tem certeza que deseja excluir este currículo? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="text-foreground border-border hover:bg-accent/50 rounded-sm">Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteResume} className="bg-destructive hover:bg-destructive/90 rounded-sm text-destructive-foreground">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ResumeBuilder;
