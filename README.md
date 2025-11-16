# 🎓 Sistema de Alocação de Horários - ADS

Sistema web para gerenciamento de disciplinas, horários e professores do curso de Análise e Desenvolvimento de Sistemas da PUC Minas, Trabalho Prático de Banco de Dados.

## ✨ Funcionalidades

### ✅ Implementadas
- **Gestão de Disciplinas**: Adicionar, editar e remover disciplinas
- **Atribuição de Professores**: Seleção dinâmica de professores via dropdown
- **Controle de Horários**: Definição de horários para cada disciplina
- **Interface Responsiva**: Layout adaptável para desktop e mobile
- **Sidebar Navegável**: Navegação entre diferentes seções
- **Validações**: Prevenção de duplicatas e conflitos

### 🚧 Próximas Implementações
- [ ] Integração com Banco de Dados
- [ ] API REST para CRUD completo
- [ ] Autenticação de usuários
- [ ] Calendário de aulas interativo
- [ ] Gerenciamento completo de professores
- [ ] Relatórios e estatísticas

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Framework CSS**: Bootstrap 5.3.1
- **Ícones**: Font Awesome 6.5.0
- **Fontes**: Google Fonts (Poppins)
- **Armazenamento Local**: localStorage (para protótipo)

## 🚀 Como Executar

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/alocacao-horarios-ads.git
   ```

2. **Abra o arquivo** `index.html` em seu navegador preferido

## 💾 Estrutura de Dados

### Disciplinas (localStorage)
```javascript
{
  "disciplinas": [
    {
      "nome": "Banco de Dados",
      "horario": "Segunda 19:00-22:30",
      "professor": "Prof. Carlos Silva"
    }
  ]
}
```

## 🔄 Próximas Etapas - Integração com Banco de Dados

### 1. Backend API (Planejado)
```javascript
// Endpoints previstos
GET    /api/disciplinas        # Listar disciplinas
POST   /api/disciplinas        # Criar disciplina
PUT    /api/disciplinas/:id    # Atualizar disciplina
DELETE /api/disciplinas/:id    # Remover disciplina

GET    /api/professores        # Listar professores
```

### 2. Tecnologias para Integração
- **Backend**: Node.js + Express ou PHP + Laravel
- **Banco de Dados**: MySQL 
- **ORM**: Sequelize (Node.js) ou Eloquent (Laravel)

## 🎯 Como Usar

### Adicionar Disciplina
1. Clique no botão flutuante `+`
2. Preencha o nome da disciplina
3. Defina o horário (opcional)
4. Selecione um professor da lista
5. Clique em "Salvar"

### Editar Disciplina
1. Clique no botão "Editar" no card da disciplina
2. Modifique os dados necessários
3. Clique em "Atualizar"

## 📱 Layout e Design

- **Design System**: Cores institucionais da PUC Minas
- **Responsividade**: Mobile-first approach
- **UX**: Feedback visual com toasts e estados de loading

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Desenvolvido com ❤️ para a PUC Minas - Disciplina de Banco de Dados**

*Sistema em constante evolução - Próximas features incluem integração completa com banco de dados e API RESTful.*
