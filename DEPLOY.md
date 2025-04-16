# Deploy na Vercel

Este guia descreve como fazer o deploy desta aplicação React (Vite) na Vercel.

## Pré-requisitos

*   Conta gratuita na [Vercel](https://vercel.com/).
*   Seu código no GitHub, GitLab ou Bitbucket.
*   [Git](https://git-scm.com/) instalado localmente (se você ainda não versionou seu código).

## Passos para o Deploy

1.  **Conecte seu Repositório:**
    *   Acesse seu [Dashboard da Vercel](https://vercel.com/dashboard).
    *   Clique em "Add New..." -> "Project".
    *   Importe o repositório Git onde seu projeto está hospedado.

2.  **Configure o Projeto:**
    *   A Vercel geralmente detecta que é um projeto Vite automaticamente.
    *   **Framework Preset:** Verifique se está selecionado "Vite".
    *   **Build and Output Settings:**
        *   **Build Command:** `npm run build` (ou `yarn build` se você usa Yarn). Deixe o override desmarcado se for o comando padrão.
        *   **Output Directory:** `dist`. Deixe o override desmarcado se for o diretório padrão do Vite.
        *   **Install Command:** `npm install` (ou `yarn install`). Deixe o override desmarcado.
    *   **Environment Variables:** Para este projeto frontend simples, provavelmente não são necessárias variáveis de ambiente específicas para o build ou runtime na Vercel.

3.  **Deploy:**
    *   Clique no botão "Deploy".
    *   A Vercel fará o build e o deploy da sua aplicação.
    *   Após a conclusão, você receberá uma URL pública (ex: `seu-projeto.vercel.app`).

## Deploy Automático (CI/CD)

Por padrão, a Vercel configura o deploy automático. Qualquer `push` para a branch principal (geralmente `main` ou `master`) acionará um novo build e deploy automaticamente.

## Domínio Customizado (Opcional)

Se você possui um domínio próprio, pode configurá-lo facilmente nas configurações do seu projeto na Vercel ("Settings" -> "Domains").

Pronto! Sua aplicação Resuuume estará online. 