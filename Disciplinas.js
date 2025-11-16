document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar") || document.getElementById("sidebar");
  const overlay = document.querySelector(".overlay") || document.getElementById("sidebar-overlay");
  const btnToggleSidebar = document.getElementById("toggle-sidebar-mobile");
  const btnFecharSidebar = document.getElementById("btn-fechar-sidebar");
  const menuItems = document.querySelectorAll(".menu-item, .nav-link");
  const secoes = document.querySelectorAll(".conteudo-secao, section");
  const disciplinasContainer = document.getElementById("disciplinas-container");
  const resumo = document.getElementById("resumo");
  const btnFloatAdd = document.getElementById("btn-float-add");
  
  // Elementos do modal de adicionar disciplina
  const modalAddDisciplina = new bootstrap.Modal(document.getElementById("addDisciplinaModal"));
  const modalInputDisciplina = document.getElementById("modal-nome-disciplina");
  const modalInputHorario = document.getElementById("modal-horario-disciplina");
  const modalSelectProfessor = document.getElementById("modal-professor-disciplina");
  const disciplinaForm = document.getElementById("disciplina-form");
  
  // Elementos do modal de editar disciplina
  const modalEditDisciplina = new bootstrap.Modal(document.getElementById("editDisciplinaModal"));
  const editDisciplinaForm = document.getElementById("edit-disciplina-form");
  const editInputDisciplina = document.getElementById("edit-nome-disciplina");
  const editInputHorario = document.getElementById("edit-horario-disciplina");
  const editSelectProfessor = document.getElementById("edit-professor-disciplina");
  const editDisciplinaIndex = document.getElementById("edit-disciplina-index");

  // ==========================
  // 1️⃣ INICIALIZAÇÃO - Abrir na aba de Disciplina
  // ==========================
  function inicializarPagina() {
    // Ativar a aba de disciplina por padrão
    const menuDisciplina = document.querySelector('.menu-item[data-nav="disciplina"]');
    const secaoDisciplinas = document.getElementById("secao-disciplinas");
    
    if (menuDisciplina && secaoDisciplinas) {
      menuItems.forEach(item => item.classList.remove("ativo"));
      menuDisciplina.classList.add("ativo");
      
      secoes.forEach(secao => secao.classList.add("d-none"));
      secaoDisciplinas.classList.remove("d-none");
      secaoDisciplinas.style.opacity = 1;
      
      renderDisciplinas();
    }
  }

  // ==========================
  // 2️⃣ Toggle Sidebar
  // ==========================
  function toggleSidebar() {
    sidebar?.classList.toggle("aberta");
    overlay?.classList.toggle("ativo");
  }

  btnToggleSidebar?.addEventListener("click", toggleSidebar);
  btnFecharSidebar?.addEventListener("click", toggleSidebar);
  overlay?.addEventListener("click", toggleSidebar);

  // ==========================
  // 3️⃣ Fade-in suave nas seções
  // ==========================
  function mostrarSecaoComTransicao(secao) {
    secoes.forEach(s => s.classList.add("d-none"));
    secao.classList.remove("d-none");
    secao.style.opacity = 0;
    setTimeout(() => (secao.style.transition = "opacity 0.4s ease", secao.style.opacity = 1), 50);
  }

  // ==========================
  // 4️⃣ Menu de Navegação
  // ==========================
  menuItems.forEach(item => {
    item.addEventListener("click", e => {
      e.preventDefault();
      const nav = item.dataset.nav;

      menuItems.forEach(i => i.classList.remove("ativo"));
      item.classList.add("ativo");

      const secao =
        document.getElementById(`secao-${nav}`) ||
        document.getElementById(`secao-${nav}s`) ||
        document.querySelector(`[data-section='${nav}']`);

      if (secao) {
        mostrarSecaoComTransicao(secao);

        if (nav === "disciplina" || nav === "disciplinas") {
          renderDisciplinas();
        }
      }

      if (window.innerWidth <= 991 && sidebar?.classList.contains("aberta")) {
        toggleSidebar();
      }
    });
  });

  // ==========================
  // 5️⃣ VALIDAÇÕES
  // ==========================
  
  // Verifica se disciplina já existe (case insensitive)
  function disciplinaJaExiste(nomeDisciplina, indexIgnorar = -1) {
    const disciplinas = JSON.parse(localStorage.getItem("disciplinas")) || [];
    return disciplinas.some((disc, index) => 
      index !== indexIgnorar && 
      disc.nome.toLowerCase().trim() === nomeDisciplina.toLowerCase().trim()
    );
  }

  // Verifica se professor já está atribuído a outra disciplina
  function professorJaAtribuido(nomeProfessor, indexIgnorar = -1) {
    const disciplinas = JSON.parse(localStorage.getItem("disciplinas")) || [];
    return disciplinas.some((disc, index) => 
      index !== indexIgnorar &&
      disc.professor && disc.professor.toLowerCase().trim() === nomeProfessor.toLowerCase().trim()
    );
  }

  // ==========================
  // 6️⃣ Função para Renderizar Disciplinas
  // ==========================
  function renderDisciplinas() {
    if (!disciplinasContainer) return;
    const disciplinas = JSON.parse(localStorage.getItem("disciplinas")) || [];

    disciplinasContainer.innerHTML = "";
    resumo.innerHTML = "";

    if (disciplinas.length === 0) {
      disciplinasContainer.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-book-open fa-3x mb-3"></i>
          <h4>Nenhuma disciplina adicionada ainda</h4>
          <p>Clique no botão + para adicionar sua primeira disciplina</p>
        </div>
      `;
      return;
    }

    disciplinas.forEach((disc, index) => {
      const card = document.createElement("div");
      card.classList.add("disciplina-card");
      card.innerHTML = `
        <div class="disciplina-card-header">
          <h5>${disc.nome}</h5>
        </div>
        <div class="disciplina-card-body">
          <div class="horario-info">
            <i class="fas fa-clock"></i>
            <div>
              <strong>Horário:</strong><br>
              <span class="${!disc.horario ? 'sem-horario' : ''}">
                ${disc.horario || "Não definido"}
              </span>
            </div>
          </div>
          <div class="professor-info">
            <i class="fas fa-chalkboard-teacher"></i>
            <div>
              <strong>Professor:</strong><br>
              <span class="${!disc.professor ? 'sem-professor' : ''}">
                ${disc.professor || "Não atribuído"}
              </span>
            </div>
          </div>
          <div class="disciplina-actions">
            <button class="btn btn-sm btn-editar" data-index="${index}">
              <i class="fas fa-edit"></i> Editar
            </button>
            <button class="btn btn-sm btn-remover" data-index="${index}">
              <i class="fas fa-trash"></i> 
            </button>
          </div>
        </div>
      `;
      disciplinasContainer.appendChild(card);
    });

    resumo.innerHTML = `
      <div class="alert alert-info d-flex align-items-center">
        <i class="fas fa-info-circle me-2"></i>
        <div>
          <strong>Total de disciplinas:</strong> ${disciplinas.length}
        </div>
      </div>
    `;
  }

  // ==========================
  // 7️⃣ Botão Flutuante para Abrir Modal
  // ==========================
  btnFloatAdd?.addEventListener("click", () => {
    // Carregar professores no select (simulação do banco)
    carregarProfessores(modalSelectProfessor);
    
    modalInputDisciplina.value = "";
    modalInputHorario.value = "";
    modalSelectProfessor.value = "";
    modalAddDisciplina.show();
    setTimeout(() => modalInputDisciplina.focus(), 300);
  });

  // ==========================
  // 8️⃣ Carregar Professores do Banco (simulação)
  // ==========================
  function carregarProfessores(selectElement) {
    // SIMULAÇÃO DE BANCO DE DADOS
    // Em produção, isso viria de uma API/backend
    const professores = [
      { id: 1, nome: "Prof. Carlos Silva", especialidade: "Banco de Dados" },
      { id: 2, nome: "Prof. Maria Santos", especialidade: "Programação" },
      { id: 3, nome: "Prof. João Oliveira", especialidade: "Redes" },
      { id: 4, nome: "Prof. Ana Costa", especialidade: "Engenharia de Software" },
      { id: 5, nome: "Prof. Pedro Almeida", especialidade: "Inteligência Artificial" },
      { id: 6, nome: "Prof. Juliana Pereira", especialidade: "Segurança" },
      { id: 7, nome: "Prof. Ricardo Lima", especialidade: "Mobile" }
    ];
    
    // Salvar no localStorage para simular banco (em produção viria da API)
    localStorage.setItem("professores", JSON.stringify(professores));
    
    selectElement.innerHTML = '<option value="">Selecione um professor</option>';
    
    professores.forEach(prof => {
      const option = document.createElement("option");
      option.value = prof.nome;
      option.textContent = prof.nome;
      option.setAttribute("data-especialidade", prof.especialidade);
      selectElement.appendChild(option);
    });
  }

  // ==========================
  // 9️⃣ Adicionar Disciplina via Modal
  // ==========================
  disciplinaForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const nome = modalInputDisciplina.value.trim();
    const horario = modalInputHorario.value.trim();
    const professor = modalSelectProfessor.value;
    
    if (!nome) {
      alert("Digite o nome da disciplina!");
      return;
    }

    // Valida se disciplina já existe
    if (disciplinaJaExiste(nome)) {
      alert(`❌ A disciplina "${nome}" já existe!`);
      return;
    }

    const disciplinas = JSON.parse(localStorage.getItem("disciplinas")) || [];
    disciplinas.push({ 
      nome, 
      horario: horario || "", 
      professor: professor || "" 
    });
    localStorage.setItem("disciplinas", JSON.stringify(disciplinas));

    modalAddDisciplina.hide();
    renderDisciplinas();
    
    // Feedback visual
    mostrarToast('Disciplina adicionada com sucesso!', 'success');
  });

  // ==========================
  // 🔟 Editar Disciplina
  // ==========================
  function abrirModalEditar(index) {
    const disciplinas = JSON.parse(localStorage.getItem("disciplinas")) || [];
    const disciplina = disciplinas[index];
    
    if (!disciplina) return;
    
    // Preencher o formulário com os dados atuais
    editDisciplinaIndex.value = index;
    editInputDisciplina.value = disciplina.nome;
    editInputHorario.value = disciplina.horario || "";
    
    // Carregar professores do banco no select de edição
    carregarProfessores(editSelectProfessor);
    editSelectProfessor.value = disciplina.professor || "";
    
    // Abrir modal
    modalEditDisciplina.show();
    setTimeout(() => editInputDisciplina.focus(), 300);
  }

  editDisciplinaForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const index = parseInt(editDisciplinaIndex.value);
    const nome = editInputDisciplina.value.trim();
    const horario = editInputHorario.value.trim();
    const professor = editSelectProfessor.value;
    
    if (!nome) {
      alert("Digite o nome da disciplina!");
      return;
    }

    // Valida se disciplina já existe (ignorando a atual)
    if (disciplinaJaExiste(nome, index)) {
      alert(`❌ A disciplina "${nome}" já existe!`);
      return;
    }

    // Valida se professor já está em outra disciplina
    if (professor && professorJaAtribuido(professor, index)) {
      alert(`❌ O professor "${professor}" já está atribuído a outra disciplina!`);
      return;
    }

    const disciplinas = JSON.parse(localStorage.getItem("disciplinas")) || [];
    
    // Atualizar disciplina
    disciplinas[index] = { 
      nome, 
      horario: horario || "", 
      professor: professor || "" 
    };
    
    localStorage.setItem("disciplinas", JSON.stringify(disciplinas));
    modalEditDisciplina.hide();
    renderDisciplinas();
    
    // Feedback visual
    mostrarToast('Disciplina atualizada com sucesso!', 'success');
  });

  // ==========================
  // 1️⃣1️⃣ Ações nas Disciplinas
  // ==========================
  disciplinasContainer?.addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const index = parseInt(btn.dataset.index);
    const disciplinas = JSON.parse(localStorage.getItem("disciplinas")) || [];

    if (btn.classList.contains("btn-remover")) {
      if (confirm(`Tem certeza que deseja remover a disciplina "${disciplinas[index].nome}"?`)) {
        disciplinas.splice(index, 1);
        localStorage.setItem("disciplinas", JSON.stringify(disciplinas));
        renderDisciplinas();
        mostrarToast('Disciplina removida com sucesso!', 'warning');
      }
    }

    if (btn.classList.contains("btn-editar")) {
      abrirModalEditar(index);
    }
  });

  // ==========================
  // 1️⃣2️⃣ Função para mostrar toast (feedback)
  // ==========================
  function mostrarToast(mensagem, tipo = 'info') {
    // Criar elemento toast se não existir
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
      toastContainer.style.zIndex = '9999';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${tipo} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          <i class="fas ${tipo === 'success' ? 'fa-check-circle' : tipo === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'} me-2"></i>
          ${mensagem}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;

    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remover o toast do DOM após ser escondido
    toast.addEventListener('hidden.bs.toast', () => {
      toast.remove();
    });
  }

  // ==========================
  // 1️⃣3️⃣ Inicialização
  // ==========================
  inicializarPagina();
});