# 📊 Previsor de Salários - Estrutura do Projeto

## Visão Geral
Aplicação web para previsão de salários em profissões de TI, desenvolvida com HTML, CSS e JavaScript puro.

## 📁 Estrutura de Pastas

```
salary-predict-web/
├── index.html                  # Arquivo HTML principal da aplicação
├── README.md                   # Documentação do projeto
├── LICENSE                     # Licença MIT do projeto
├── css/
│   └── style.css              # Estilos CSS (variáveis, layouts, componentes, responsividade)
├── js/
│   └── app.js                 # Lógica JavaScript (cálculos, interações, renderização de gráficos)
├── package/
│   └── package.json           # Metadados do projeto e dependências
├── .git/                       # Repositório Git (versionamento)
├── .github/
│   └── workflows/
│       └── deploy.yml         # Workflow de automação para deploy no GitHub Pages
└── assets/                     # Pasta reservada para futuros recursos (imagens, ícones, etc)
```

## 📄 Descrição dos Arquivos

### `index.html`
- Estrutura HTML da aplicação
- Header com navegação
- Formulário de entrada de dados (sidebar)
- Painel de resultados
- Referencia o arquivo CSS e JavaScript externos

### `css/style.css`
- Variáveis de cores e temas
- Estilos responsivos (mobile, tablet, desktop)
- Componentes:
  - Header e navegação
  - Formulários e inputs
  - Cards de salário
  - Gráficos de barras
  - Tabelas de comparação
  - Animações e transições
  - Estados: tooltip, loading, empty state, tabs

### `js/app.js`
- Base de dados de salários por cargo e nível
- Multiplicadores por região, formação, tamanho de empresa e idiomas
- Multiplicadores de habilidades técnicas
- Funções principais:
  - `calcularSalario()` - Calcula salário estimado
  - `formatCurrency()` - Formata valores em moeda
  - `preverSalario()` - Executa previsão e atualiza UI
  - `renderFactors()` - Renderiza fatores de impacto
  - `renderBarChart()` - Gráfico comparativo por região
  - `renderEvolutionChart()` - Gráfico de evolução por nível
  - `renderDetailsTable()` - Tabela de detalhes do cálculo
  - `renderHeatmap()` - Heatmap de demanda sazonal
  - `switchTab()` - Alterna abas de conteúdo
  - `limparForm()` - Reseta formulário

## 🎨 Tema de Cores
- **Primary**: #6366f1 (Azul/Índigo)
- **Secondary**: #10b981 (Verde)
- **Background**: #0f172a (Azul escuro)
- **Surface**: #1e293b (Superfície)
- **Text**: #f8fafc (Branco)
- **Danger**: #ef4444 (Vermelho)
- **Warning**: #f59e0b (Amarelo)

## 💼 Tecnologias Utilizadas
- **HTML5** - Estrutura semântica
- **CSS3** - Estilos responsivos e animações
- **JavaScript Vanilla** - Lógica pura (sem frameworks)
- **Google Fonts** - Font 'Inter'

## 📱 Responsividade
- Desktop (1024px+): Layout com sidebar + results side-by-side
- Tablet (640px-1024px): Grid 2 colunas
- Mobile (< 640px): Layout em coluna única

## 🚀 Como Usar
1. Abra `index.html` em um navegador
2. Preencha os dados pessoais no formulário
3. Clique em "🔮 Calcular Previsão"
4. Veja os resultados e análises

## 🌐 Acesso via GitHub Pages

A aplicação está hospedada automaticamente no **GitHub Pages** para acesso online:

### 📍 URL da Aplicação
```
https://<seu-usuario>.github.io/salary-predict-web
```

Substitua `<seu-usuario>` pelo seu nome de usuário do GitHub.

### 🔄 Deployment Automático
- A aplicação é **automaticamente deployada** no GitHub Pages a cada `git push` para a branch `main`
- Workflow de automação: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
- Tempo de deployment: ~1-2 minutos após o push
- Sem necessidade de build - a aplicação usa arquivos estáticos (HTML, CSS, JS)

### ✅ Verificar Status do Deploy
1. Acesse a aba **"Actions"** no repositório GitHub
2. Procure pelo workflow **"Deploy to GitHub Pages"**
3. Verifique se o último push passou no workflow
4. Após sucesso, a aplicação estará disponível na URL acima

### 💻 Executar Localmente
Para testar a aplicação em seu computador:
```bash
# Clone o repositório
git clone https://github.com/<seu-usuario>/salary-predict-web.git

# Abra o arquivo index.html em um navegador
# Opção 1: Clique duplo no arquivo index.html
# Opção 2: Use um servidor local (Python, Node.js, etc)
python -m http.server 8000  # Python 3
# ou
npx http-server           # Node.js
```

## 📊 Dados de Cálculo
O cálculo leva em consideração:
- **Cargo** (16 opções)
- **Nível de Experiência** (4 níveis)
- **Anos de Experiência** (interpolação entre níveis)
- **Região** (11 opções com multiplicadores)
- **Formação Acadêmica** (5 níveis)
- **Tamanho da Empresa** (5 categorias)
- **Idiomas** (4 opções)
- **Habilidades Técnicas** (12 tecnologias com multiplicadores)
- **Ajuste de Mercado 2026** (+8%)

## 🔄 Fluxo de Dados
1. Usuário preenche o formulário
2. JavaScript coleta os valores dos inputs
3. `calcularSalario()` aplica multiplicadores
4. Resultado é renderizado em múltiplas visualizações:
   - Card principal de salário
   - Stats (percentil, confiança, regime)
   - Gráficos comparativos
   - Tabela de detalhes
   - Heatmap sazonal

## ✨ Recursos
- ✅ Cálculo de salário com múltiplos fatores
- ✅ Visualizações interativas (gráficos, tabelas)
- ✅ Interface escura e moderna
- ✅ Totalmente responsivo
- ✅ Sem dependências externas (vanilla JS)
- ✅ Animações suaves

## 📝 Notas
- Todos os valores salariais são em **R$ (Reais)**
- Os salários são mensais, com cálculo de anual (×13)
- O percentil calcula a posição comparada ao mercado
- A confiança reflete a precisão baseada em dados inseridos

---

**Desenvolvido em 2026** - Previsor de Salários