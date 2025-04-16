import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ResumeTemplateType } from '@/types/resume';

const TemplateSelector: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-4">Modelo ATS Otimizado</h2>
        <p className="mb-6 text-muted-foreground">
          Este modelo foi desenvolvido para maximizar a compatibilidade com sistemas ATS (Applicant Tracking Systems),
          garantindo que seu currículo seja lido corretamente pelos sistemas de recrutamento automatizados.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="overflow-hidden border-primary">
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <h3 className="font-medium">Modelo Clássico ATS</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Design limpo e tradicional, otimizado para sistemas ATS. Utiliza fonte Times New Roman e estrutura padronizada.
              </p>
            </div>
            <div className="p-6 bg-gray-50 flex justify-center items-center">
              <div className="w-full max-w-xs aspect-[210/297] bg-white shadow-sm overflow-hidden">
                <div className="p-4 text-xs">
                  <div className="text-center pb-2 border-b border-black">
                    <div className="font-bold uppercase">NOME COMPLETO</div>
                    <div className="mt-1 flex justify-center flex-wrap gap-2">
                      <span>email@exemplo.com</span>
                      <span>(00) 00000-0000</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="font-bold uppercase border-b border-black pb-1">OBJETIVO</div>
                    <div className="mt-1">
                      Descrição breve do seu objetivo profissional
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="font-bold uppercase border-b border-black pb-1">EXPERIÊNCIA</div>
                    <div className="mt-1">
                      <div className="font-bold">Cargo</div>
                      <div>Empresa | Local</div>
                      <div className="mt-1">Descrição das responsabilidades e conquistas</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-slate-800 p-4 rounded-lg mt-6">
        <h3 className="font-medium text-white">Vantagens do Modelo ATS Otimizado:</h3>
        <ul className="list-disc pl-5 mt-2 text-white text-sm space-y-1">
          <li>Estrutura clara e organizada para facilitar a leitura por sistemas automatizados</li>
          <li>Fonte Times New Roman para máxima compatibilidade</li>
          <li>Formatação simples sem elementos gráficos que podem confundir o ATS</li>
          <li>Títulos de seção em destaque para melhor indexação de palavras-chave</li>
          <li>Alinhamento e espaçamento otimizados para leitura eficiente</li>
        </ul>
      </div>
    </div>
  );
};

export default TemplateSelector;
