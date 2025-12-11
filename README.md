<h1 align="center">Growtwitter 🐦</h1>

<p align="center">
  <strong>Frontend responsivo do clone do Twitter. Uma experiência completa com temas Dark/Light, animações exclusivas e interação em tempo real.</strong>
</p>

<p align="center">
  🔗 <strong>Repositório da API (Backend):</strong> 
  <a href="https://github.com/danieleksantos/API-GrowTwitter" target="_blank">github.com/danieleksantos/API-GrowTwitter</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Material%20UI-007FFF?style=for-the-badge&logo=mui&logoColor=white" />
  <img src="https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
</p>

<hr />

<h2>✨ Funcionalidades Principais</h2>

<ul>
  <li><strong>📱 Layout Responsivo:</strong> Adaptação total para Celulares (Menu Inferior), Tablets e Desktops (Sidebar e Trends).</li>
  <li><strong>🎨 Temas (Dark/Light):</strong> Alternância de tema com persistência de preferência do usuário.</li>
  <li><strong>🔐 Autenticação com Animações:</strong> Páginas de Login e Registro com animações de entrada (apenas Desktop).</li>
  <li><strong>🌍 Feed & Trends:</strong> 
    <ul>
      <li><strong>Feed Pessoal:</strong> Tweets de quem você segue.</li>
      <li><strong>O que está acontecendo (Global):</strong> Tweets recentes de toda a rede.</li>
    </ul>
  </li>
  <li><strong>⚡ Interatividade (Optimistic UI):</strong> Feedback visual instantâneo ao curtir, comentar ou seguir usuários.</li>
  <li><strong>👤 Perfil Completo:</strong> Edição de foto/nome, listagem de tweets próprios e contadores de seguidores.</li>
</ul>

<hr />

<h2>🛠 Tecnologias Utilizadas</h2>

<ul>
  <li><strong>React</strong> & <strong>Vite</strong> - Base da aplicação e Build tool.</li>
  <li><strong>TypeScript</strong> - Tipagem estática para maior segurança.</li>
  <li><strong>Material UI</strong> - Biblioteca de componentes e sistema de Grid Responsivo.</li>
  <li><strong>Redux Toolkit</strong> & <strong>Redux Persist</strong> - Gerenciamento de estado global e persistência de sessão.</li>
  <li><strong>Axios</strong> - Cliente HTTP para comunicação com a API.</li>
  <li><strong>SweetAlert2</strong> - Modais de confirmação e alertas elegantes.</li>
</ul>

<hr />

<h2>🚀 Instalação e Execução</h2>

<p>Siga os passos abaixo para rodar o projeto localmente.</p>

<h3>1. Clonar o repositório</h3>
<pre>
<code>git clone https://github.com/danieleksantos/grow-twitter.git
cd grow-twitter
npm install
</code>
</pre>

<h3>2. Configurar Variáveis de Ambiente</h3>
<p>Crie um arquivo <code>.env</code> na raiz do projeto para apontar para sua API local:</p>
<pre>
<code>VITE_API_URL="http://localhost:3333"
</code>
</pre>

<h3>3. Iniciar a aplicação</h3>
<pre>
<code>npm run dev</code>
</pre>
<p>A aplicação estará disponível em <code>http://localhost:5173</code> (ou a porta indicada pelo terminal).</p>

<hr />

<h2>📂 Estrutura do Projeto</h2>

<pre>
src/
  ├── components/   # Componentes modulares (Sidebar, Trends, MobileMenu, TweetCard...)
  ├── layouts/      # Layouts de página (DefaultLayout com Grid Responsivo)
  ├── pages/        # Páginas (Login, Register, Home, Profile, Explore)
  ├── services/     # Configuração da API (Axios)
  ├── store/        # Estado Global (Redux Auth Slice)
  ├── theme/        # Configuração de Paleta de Cores (Dark/Light)
  └── types/        # Interfaces TypeScript globais
</pre>

<hr />

<p align="center">Desenvolvido com 💙 no desafio Growtwitter 🚀</p>
