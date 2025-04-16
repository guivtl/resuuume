import { ResumeData } from '@/types/resume';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Generates a PDF from the resume data with editable text, optimized for ATS
 */
export const generateResumePDF = async (data: ResumeData): Promise<void> => {
  console.log('Gerando PDF do currículo');
  
  // Configurações do modelo Clássico (ATS otimizado)
  const titleFont = 'times';
  const contentFont = 'times';
  const headingSize = 14;
  const contentSize = 10;
  const nameSize = 18;
  const margin = 20; // Margem padrão para ATS
  
  // Criar documento PDF
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  // Definir fonte padrão
  doc.setFont(contentFont);
  
  // Funções auxiliares para formatação
  const formatDate = (dateString: string): string => {
    if (!dateString || !/^\d{4}-\d{2}$/.test(dateString)) return '';
    // dateString está no formato YYYY-MM
    try {
      // Adiciona T00:00:00Z para especificar UTC
      const date = new Date(`${dateString}-01T00:00:00Z`); 
      // Formata para MM/yyyy
      return format(date, 'MM/yyyy');
    } catch (error) {
      console.error('Erro ao formatar data no PDF:', dateString, error);
      // Tenta formatar manualmente como fallback
      const [year, month] = dateString.split('-');
      return `${month}/${year}`;
    }
  };
  
  // Iniciar posição Y para adicionar conteúdo
  let yPos = margin;
  
  // Adicionar informações pessoais
  doc.setFont(titleFont, 'bold');
  doc.setFontSize(nameSize);
  const nameWidth = doc.getTextWidth(data.personalInfo.name);
  doc.text(data.personalInfo.name, (doc.internal.pageSize.width - nameWidth) / 2, yPos);
  
  yPos += 10;
  
  // Adicionar informações de contato
  doc.setFont(contentFont, 'normal');
  doc.setFontSize(contentSize);
  
  const contactInfo: string[] = [];
  
  if (data.personalInfo.email) contactInfo.push(`E-mail: ${data.personalInfo.email}`);
  if (data.personalInfo.phone) contactInfo.push(`Telefone: ${data.personalInfo.phone}`);
  if (data.personalInfo.location) contactInfo.push(`Localização: ${data.personalInfo.location}`);
  
  if (contactInfo.length > 0) {
    const contactText = contactInfo.join('  |  ');
    const contactWidth = doc.getTextWidth(contactText);
    doc.text(contactText, (doc.internal.pageSize.width - contactWidth) / 2, yPos);
    yPos += 5;
  }
  
  // Adicionar links
  const linkInfo: string[] = [];
  
  if (data.personalInfo.linkedin) linkInfo.push(`LinkedIn: ${data.personalInfo.linkedin}`);
  if (data.personalInfo.portfolio) linkInfo.push(`Portfolio: ${data.personalInfo.portfolio}`);
  
  if (linkInfo.length > 0) {
    const linkText = linkInfo.join('  |  ');
    const linkWidth = doc.getTextWidth(linkText);
    doc.text(linkText, (doc.internal.pageSize.width - linkWidth) / 2, yPos);
    yPos += 10;
    } else {
    yPos += 5;
  }
  
  // Adicionar linha horizontal após informações pessoais
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, doc.internal.pageSize.width - margin, yPos);
  yPos += 5;
  
  // Adicionar seção de objetivo
  if (data.objective) {
    doc.setFont(titleFont, 'bold');
    doc.setFontSize(headingSize);
    doc.text('OBJETIVO PROFISSIONAL', margin, yPos);
    yPos += 2;
    
    // Linha sob o título
    doc.setLineWidth(0.2);
    doc.line(margin, yPos, doc.internal.pageSize.width - margin, yPos);
    yPos += 5;
    
    doc.setFont(contentFont, 'normal');
    doc.setFontSize(contentSize);
    
    const splitObjective = doc.splitTextToSize(data.objective, doc.internal.pageSize.width - (2 * margin));
    doc.text(splitObjective, margin, yPos);
    yPos += (splitObjective.length * 5) + 5;
  }
  
  // Adicionar seção de experiência
  if (data.experiences.some(exp => exp.company || exp.position)) {
    doc.setFont(titleFont, 'bold');
    doc.setFontSize(headingSize);
    doc.text('EXPERIÊNCIA PROFISSIONAL', margin, yPos);
    yPos += 2;
    
    // Linha sob o título
    doc.setLineWidth(0.2);
    doc.line(margin, yPos, doc.internal.pageSize.width - margin, yPos);
    yPos += 5;
    
    // Filtrar experiências válidas e ordená-las
    const validExperiences = data.experiences
      .filter(exp => exp.company || exp.position)
      .sort((a, b) => {
        const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
        const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
        return dateB - dateA;
      });
    
    for (const experience of validExperiences) {
      doc.setFont(contentFont, 'bold');
      doc.setFontSize(contentSize);
      doc.text(experience.position || '', margin, yPos);
      
      const dateText = `${formatDate(experience.startDate)} - ${experience.current ? 'Presente' : formatDate(experience.endDate)}`;
      const dateWidth = doc.getTextWidth(dateText);
      doc.setFont(contentFont, 'normal');
      doc.text(dateText, doc.internal.pageSize.width - margin - dateWidth, yPos);
      yPos += 5;
      
      const companyLocationText = `${experience.company}${experience.location ? ` | ${experience.location}` : ''}`;
      doc.setFont(contentFont, 'bold');
      doc.text(companyLocationText, margin, yPos);
      yPos += 5;
      
      if (experience.description) {
        doc.setFont(contentFont, 'normal');
        const splitDescription = doc.splitTextToSize(experience.description, doc.internal.pageSize.width - (2 * margin));
        doc.text(splitDescription, margin, yPos);
        yPos += (splitDescription.length * 5);
      }
      
      if (experience.achievements.filter(Boolean).length > 0) {
        yPos += 2;
        
        const validAchievements = experience.achievements.filter(Boolean);
        doc.setFont(contentFont, 'normal');
        
        for (let i = 0; i < validAchievements.length; i++) {
          const achievement = validAchievements[i];
          
          // Verificar se precisamos de uma nova página
          if (yPos > doc.internal.pageSize.height - margin) {
            doc.addPage();
            yPos = margin;
          }
          
          // Adicionar marcador e texto
          doc.text('•', margin, yPos);
          const bulletTextMargin = margin + 5;
          const splitAchievement = doc.splitTextToSize(achievement, doc.internal.pageSize.width - bulletTextMargin - margin);
          doc.text(splitAchievement, bulletTextMargin, yPos);
          
          yPos += (splitAchievement.length * 5);
        }
      }
      
      yPos += 5;
      
      // Verificar se precisamos de uma nova página para a próxima experiência
      if (yPos > doc.internal.pageSize.height - margin - 15) {
        doc.addPage();
        yPos = margin;
      }
    }
  }
  
  // Adicionar seção de educação
  if (data.education.some(edu => edu.institution || edu.degree)) {
    // Verificar se precisamos de uma nova página
    if (yPos > doc.internal.pageSize.height - margin - 30) {
      doc.addPage();
      yPos = margin;
    }
    
    doc.setFont(titleFont, 'bold');
    doc.setFontSize(headingSize);
    doc.text('FORMAÇÃO ACADÊMICA', margin, yPos);
    yPos += 2;
    
    // Linha sob o título
    doc.setLineWidth(0.2);
    doc.line(margin, yPos, doc.internal.pageSize.width - margin, yPos);
    yPos += 5;
    
    // Filtrar educação válida e ordená-la
    const validEducation = data.education
        .filter(edu => edu.institution || edu.degree)
        .sort((a, b) => {
        const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
        const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
        return dateB - dateA;
      });
    
    for (const education of validEducation) {
      doc.setFont(contentFont, 'bold');
      doc.setFontSize(contentSize);
      const degreeText = `${education.degree || ''}${education.field ? ` em ${education.field}` : ''}`;
      doc.text(degreeText, margin, yPos);
      
      const dateText = `${formatDate(education.startDate)} - ${education.current ? 'Presente' : formatDate(education.endDate)}`;
      const dateWidth = doc.getTextWidth(dateText);
      doc.setFont(contentFont, 'normal');
      doc.text(dateText, doc.internal.pageSize.width - margin - dateWidth, yPos);
      yPos += 5;
      
      const institutionLocationText = `${education.institution || ''}${education.location ? ` | ${education.location}` : ''}`;
      doc.setFont(contentFont, 'bold');
      doc.text(institutionLocationText, margin, yPos);
      yPos += 5;
      
      if (education.description) {
        doc.setFont(contentFont, 'normal');
        const splitDescription = doc.splitTextToSize(education.description, doc.internal.pageSize.width - (2 * margin));
        doc.text(splitDescription, margin, yPos);
        yPos += (splitDescription.length * 5);
      }
      
      yPos += 5;
      
      // Verificar se precisamos de uma nova página para a próxima educação
      if (yPos > doc.internal.pageSize.height - margin - 15) {
        doc.addPage();
        yPos = margin;
      }
    }
  }
  
  // Adicionar seção de habilidades
  if (data.skills.filter(Boolean).length > 0) {
    // Verificar se precisamos de uma nova página
    if (yPos > doc.internal.pageSize.height - margin - 20) {
      doc.addPage();
      yPos = margin;
    }
    
    doc.setFont(titleFont, 'bold');
    doc.setFontSize(headingSize);
    doc.text('HABILIDADES', margin, yPos);
    yPos += 2;
    
    // Linha sob o título
    doc.setLineWidth(0.2);
    doc.line(margin, yPos, doc.internal.pageSize.width - margin, yPos);
    yPos += 5;
    
    const validSkills = data.skills.filter(Boolean);
    
    // Remover loop e juntar habilidades em uma string
    doc.setFont(contentFont, 'normal');
    doc.setFontSize(contentSize);

    const skillsString = validSkills.join('  •  '); // Junta com um separador
    const splitSkills = doc.splitTextToSize(skillsString, doc.internal.pageSize.width - (2 * margin));
    
    doc.text(splitSkills, margin, yPos);
    yPos += (splitSkills.length * 5); // Ajusta yPos baseado nas linhas geradas
    
    yPos += 5; // Espaço extra após a seção
  }
  
  // Adicionar seção de idiomas
  if (data.languages.some(lang => lang.language)) {
    // Verificar se precisamos de uma nova página
    if (yPos > doc.internal.pageSize.height - margin - 30) {
      doc.addPage();
      yPos = margin;
    }
    
    doc.setFont(titleFont, 'bold');
    doc.setFontSize(headingSize);
    doc.text('IDIOMAS', margin, yPos);
    yPos += 2;
    
    // Linha sob o título
    doc.setLineWidth(0.2);
    doc.line(margin, yPos, doc.internal.pageSize.width - margin, yPos);
    yPos += 5;
    
    const validLanguages = data.languages.filter(lang => lang.language);
    
    // Usar uma coluna única com bullets
    doc.setFont(contentFont, 'normal');
    doc.setFontSize(contentSize);
    
    for (let i = 0; i < validLanguages.length; i++) {
      // Verificar se precisamos de uma nova página
      if (yPos > doc.internal.pageSize.height - margin) {
        doc.addPage();
        yPos = margin;
      }
      
      const language = validLanguages[i];
      const langText = `• ${language.language}${language.proficiency ? ` (${language.proficiency})` : ''}`;
      doc.text(langText, margin, yPos);
      yPos += 5;
    }
    
    yPos += 5; // Espaço extra após a seção
  }
  
  // Adicionar seção de certificações
  if (data.certifications.some(cert => cert.name || cert.issuer)) {
    // Verificar se precisamos de uma nova página
    if (yPos > doc.internal.pageSize.height - margin - 30) {
      doc.addPage();
      yPos = margin;
    }
    
    doc.setFont(titleFont, 'bold');
    doc.setFontSize(headingSize);
    doc.text('CERTIFICAÇÕES', margin, yPos);
    yPos += 2;
    
    // Linha sob o título
    doc.setLineWidth(0.2);
    doc.line(margin, yPos, doc.internal.pageSize.width - margin, yPos);
    yPos += 5;
    
    const validCertifications = data.certifications.filter(cert => cert.name || cert.issuer);
    
    doc.setFont(contentFont, 'normal');
    doc.setFontSize(contentSize);
    
    for (const certification of validCertifications) {
      // Verificar se precisamos de uma nova página
      if (yPos > doc.internal.pageSize.height - margin) {
        doc.addPage();
        yPos = margin;
      }
      
      doc.setFont(contentFont, 'bold');
      const certText = `${certification.name || ''}`;
      doc.text(certText, margin, yPos);
      
      let textWidth = doc.getTextWidth(certText);
      
      if (certification.issuer) {
        doc.setFont(contentFont, 'normal');
        const issuerText = ` - ${certification.issuer}`;
        doc.text(issuerText, margin + textWidth, yPos);
        textWidth += doc.getTextWidth(issuerText);
      }
      
      if (certification.date) {
        const dateText = formatDate(certification.date);
        const dateWidth = doc.getTextWidth(dateText);
        doc.text(dateText, doc.internal.pageSize.width - margin - dateWidth, yPos);
      }
      
      yPos += 5;
    }
    
    yPos += 5;
  }
  
  // Adicionar seções adicionais
  if (data.additionalSections && data.additionalSections.length > 0) {
    for (const section of data.additionalSections) {
      // Verificar se precisamos de uma nova página
      if (yPos > doc.internal.pageSize.height - margin - 30) {
        doc.addPage();
        yPos = margin;
      }
      
      doc.setFont(titleFont, 'bold');
      doc.setFontSize(headingSize);
      doc.text(section.title.toUpperCase(), margin, yPos);
      yPos += 2;
      
      // Linha sob o título
      doc.setLineWidth(0.2);
      doc.line(margin, yPos, doc.internal.pageSize.width - margin, yPos);
      yPos += 5;
      
      doc.setFont(contentFont, 'normal');
      doc.setFontSize(contentSize);
      
      for (const item of section.content) {
        // Verificar se precisamos de uma nova página
        if (yPos > doc.internal.pageSize.height - margin) {
          doc.addPage();
          yPos = margin;
        }
        
        // Adicionar marcador e texto
        doc.text('•', margin, yPos);
        const bulletTextMargin = margin + 5;
        const splitItem = doc.splitTextToSize(item, doc.internal.pageSize.width - bulletTextMargin - margin);
        doc.text(splitItem, bulletTextMargin, yPos);
        
        yPos += (splitItem.length * 5);
      }
      
      yPos += 5;
    }
  }
  
  // Salvar o arquivo
  doc.save(`CV_${data.personalInfo.name.replace(/\s+/g, '_')}.pdf`);
};
