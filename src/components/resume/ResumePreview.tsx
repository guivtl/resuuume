import React, { useState } from 'react';
import { ResumeData } from '@/types/resume';
import { Download, Eye, X, Maximize, ArrowLeft, Linkedin, Twitter, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateResumePDF } from '@/lib/pdfGenerator';
import PreDownloadModal from '@/components/shared/PreDownloadModal';

// Adiciona estilos para a fonte Times New Roman na preview
import './ResumePreview.css';

interface ResumePreviewProps {
  data: ResumeData;
  onClose: () => void;
  enabledSections?: {
    objective: boolean;
    experience: boolean;
    education: boolean;
    skills: boolean;
    languages: boolean;
    certifications: boolean;
  };
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ 
  data, 
  onClose,
  enabledSections = { objective: true, experience: true, education: true, skills: true, languages: true, certifications: true }
}) => {
  const [expanded, setExpanded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isPreDownloadModalOpen, setIsPreDownloadModalOpen] = useState(false);

  const startActualDownload = async () => {
    try {
      setDownloading(true);
      console.log('Iniciando geração do PDF...');
      await generateResumePDF(data);
      console.log('PDF gerado e download iniciado.');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadClick = () => {
    if (downloading) return;
    setIsPreDownloadModalOpen(true);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString || !/^\d{4}-\d{2}$/.test(dateString)) return '';
    // dateString está no formato YYYY-MM
    try {
      const [year, month] = dateString.split('-');
      // Cria a data formatada manualmente para MM/yyyy
      return `${month}/${year}`; // Já estava correto para MM/YYYY
    } catch (error) {
      console.error('Erro ao formatar data na Preview:', dateString, error);
      return dateString; // Retorna a string original em caso de erro
    }
  };

  const renderClassicTemplate = () => {
    return (
      <div className="space-y-6 resume-classic resume-preview-font text-black">
        <div className="text-center border-b-2 border-black pb-4">
          <h1 className="text-2xl font-bold tracking-tight uppercase">{data.personalInfo.name || 'SEU NOME'}</h1>
          
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm mt-2">
            {data.personalInfo.email && (
              <span className="flex items-center">
                <span className="font-medium mr-1">E-mail:</span> {data.personalInfo.email}
              </span>
            )}
            {data.personalInfo.phone && (
              <span className="flex items-center">
                <span className="font-medium mr-1">Telefone:</span> {data.personalInfo.phone}
              </span>
            )}
            {data.personalInfo.location && (
              <span className="flex items-center">
                <span className="font-medium mr-1">Localização:</span> {data.personalInfo.location}
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm mt-1">
            {data.personalInfo.linkedin && (
              <span className="flex items-center">
                <span className="font-medium mr-1">LinkedIn:</span> {data.personalInfo.linkedin}
              </span>
            )}
            {data.personalInfo.portfolio && (
              <span className="flex items-center">
                <span className="font-medium mr-1">Portfolio:</span> {data.personalInfo.portfolio}
              </span>
            )}
          </div>
        </div>
        
        {enabledSections.objective && data.objective && (
          <div className="space-y-2">
            <h2 className="text-lg font-bold uppercase border-b border-black pb-1">OBJETIVO PROFISSIONAL</h2>
            <p className="text-sm">{data.objective}</p>
          </div>
        )}
        
        {enabledSections.experience && data.experiences.some(exp => exp.company || exp.position) && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold uppercase border-b border-black pb-1">EXPERIÊNCIA PROFISSIONAL</h2>
            
            {data.experiences
              .filter(exp => exp.company || exp.position)
              .map((experience, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{experience.position}</h3>
                      <p className="text-sm font-medium">{experience.company}{experience.location ? ` | ${experience.location}` : ''}</p>
                    </div>
                    <p className="text-sm whitespace-nowrap font-medium">
                      {formatDate(experience.startDate)} - {experience.current ? 'Presente' : formatDate(experience.endDate)}
                    </p>
                  </div>
                  
                  {experience.description && (
                    <p className="text-sm mt-1">{experience.description}</p>
                  )}
                  
                  {experience.achievements.filter(Boolean).length > 0 && (
                    <ul className="text-sm list-disc pl-5 space-y-1 mt-2">
                      {experience.achievements.filter(Boolean).map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
          </div>
        )}
        
        {enabledSections.education && data.education.some(edu => edu.institution || edu.degree) && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold uppercase border-b border-black pb-1">FORMAÇÃO ACADÊMICA</h2>
            
            {data.education
              .filter(edu => edu.institution || edu.degree)
              .map((education, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">
                        {education.degree}{education.field ? ` em ${education.field}` : ''}
                      </h3>
                      <p className="text-sm font-medium">
                        {education.institution}{education.location ? ` | ${education.location}` : ''}
                      </p>
                    </div>
                    <p className="text-sm whitespace-nowrap font-medium">
                      {formatDate(education.startDate)} - {education.current ? 'Presente' : formatDate(education.endDate)}
                    </p>
                  </div>
                  
                  {education.description && (
                    <p className="text-sm mt-1">{education.description}</p>
                  )}
                </div>
              ))}
          </div>
        )}
        
        {data.skills.filter(Boolean).length > 0 && (
          <div className="space-y-2">
            <h2 className="text-lg font-bold uppercase border-b border-black pb-1">HABILIDADES</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.filter(Boolean).map((skill, index) => (
                <span key={index} className="inline-block bg-gray-100 px-3 py-1 rounded-sm text-sm border border-gray-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {enabledSections.languages && data.languages.some(lang => lang.language) && (
          <div className="space-y-2">
            <h2 className="text-lg font-bold uppercase border-b border-black pb-1">IDIOMAS</h2>
            <div className="grid grid-cols-2 gap-2">
              {data.languages
                .filter(lang => lang.language)
                .map((language, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-bold">{language.language}</span>
                    {language.proficiency && (
                      <span> - {language.proficiency}</span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
        
        {enabledSections.certifications && data.certifications.some(cert => cert.name || cert.issuer) && (
          <div className="space-y-2">
            <h2 className="text-lg font-bold uppercase border-b border-black pb-1">CERTIFICAÇÕES</h2>
            <div className="space-y-2">
              {data.certifications
                .filter(cert => cert.name || cert.issuer)
                .map((certification, index) => (
                  <div key={index} className="text-sm flex justify-between">
                    <div>
                      <span className="font-bold">{certification.name}</span>
                      {certification.issuer && (
                        <span> - {certification.issuer}</span>
                      )}
                    </div>
                    {certification.date && (
                      <span>{formatDate(certification.date)}</span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
        
        {data.additionalSections.length > 0 && (
          <div className="space-y-4">
            {data.additionalSections.map((section, index) => (
              <div key={index} className="space-y-2">
                <h2 className="text-lg font-bold uppercase border-b border-black pb-1">{section.title}</h2>
                <ul className="text-sm list-disc pl-5 space-y-1">
                  {section.content.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center transition-all duration-300 ${expanded ? 'p-0' : 'p-4'}`}>
      <div className={`bg-gray-900 text-white shadow-xl overflow-hidden transition-all duration-300 flex flex-col rounded-none ${expanded ? 'w-full h-full' : 'max-w-6xl w-full max-h-[90vh]'}`}>
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-gray-300" />
            <h2 className="font-semibold text-gray-100">Pré-visualização</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setExpanded(!expanded)}
              title={expanded ? 'Reduzir' : 'Expandir'}
              className="text-gray-300 hover:bg-gray-700 rounded-sm"
            >
              {expanded ? <X className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              title="Fechar"
              className="text-gray-300 hover:bg-gray-700 rounded-sm"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col flex-1 overflow-auto p-6 bg-gray-700">
          <div className="resume-preview-content max-w-5xl mx-auto bg-white border border-gray-300 p-8 min-h-[842px] shadow-md overflow-y-auto flex-1 rounded-none">
            {renderClassicTemplate()}
          </div>
          <div className="text-center mt-4 text-sm text-gray-300">
            <p>O PDF será gerado em preto e branco com fonte Times New Roman.</p>
          </div>
        </div>
        
        <div className="flex justify-center py-4 border-t border-gray-700 bg-gray-900 gap-4">
          <Button 
            onClick={onClose} 
            variant="outline" 
            className="flex items-center gap-2 text-white border-gray-600 hover:bg-gray-700 rounded-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
          
          <Button 
            onClick={handleDownloadClick}
            className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 rounded-sm" 
            disabled={downloading}
          >
            <Download className="h-4 w-4" /> 
            {downloading 
              ? "Gerando PDF..." 
              : "Baixar PDF"}
          </Button>
        </div>
      </div>

      <PreDownloadModal 
        isOpen={isPreDownloadModalOpen} 
        onClose={() => setIsPreDownloadModalOpen(false)} 
        onDownloadStart={startActualDownload}
      />
    </div>
  );
};

export default ResumePreview;
