document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar") || document.getElementById("sidebar");
  const overlay = document.querySelector(".overlay") || document.getElementById("sidebar-overlay");
  const btnToggleSidebar = document.getElementById("toggle-sidebar-mobile");
  const btnFecharSidebar = document.getElementById("btn-fechar-sidebar");
  const menuItems = document.querySelectorAll(".menu-item, .nav-link");
  const secoes = document.querySelectorAll(".conteudo-secao, section");
  const disciplinasContainer = document.getElementById("disciplinas-container");
  const resumo = document.getElementById("resumo");
  const btnAddDisciplina = document.getElementById("btn-adicionar-disciplina");
  const inputNovaDisciplina = document.getElementById("nova-disciplina");

  // ==========================
  // 1️⃣ Toggle Sidebar
  // ==========================
  function toggleSidebar() {
    sidebar?.classList.toggle("aberta");
    overlay?.classList.toggle("ativo");
  }

  btnToggleSidebar?.addEventListener("click", toggleSidebar);
  btnFecharSidebar?.addEventListener("click", toggleSidebar);
  overlay?.addEventListener("click", toggleSidebar);

  // ==========================
  // 2️⃣ Fade-in suave nas seções
  // ==========================
  function mostrarSecaoComTransicao(secao) {
    secoes.forEach(s => s.classList.add("d-none"));
    secao.classList.remove("d-none");
    secao.style.opacity = 0;
    setTimeout(() => (secao.style.transition = "opacity 0.4s ease", secao.style.opacity = 1), 50);
  }

  // ==========================
  // 3️⃣ Menu de Navegação
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
  // 4️⃣ VALIDAÇÕES
  // ==========================
  
  // Verifica se disciplina já existe (case insensitive)
  function disciplinaJaExiste(nomeDisciplina) {
    const disciplinas = JSON.parse(localStorage.getItem("disciplinas")) || [];
    return disciplinas.some(disc => 
      disc.nome.toLowerCase().trim() === nomeDisciplina.toLowerCase().trim()
    );
  }

  // Verifica se professor já está atribuído a outra disciplina
  function professorJaAtribuido(nomeProfessor) {
    const disciplinas = JSON.parse(localStorage.getItem("disciplinas")) || [];
    return disciplinas.some(disc => 
      disc.professor && disc.professor.toLowerCase().trim() === nomeProfessor.toLowerCase().trim()
    );
  }

  // Encontra disciplina que tem o professor
  function encontrarDisciplinaDoProfessor(nomeProfessor) {
    const disciplinas = JSON.parse(localStorage.getItem("disciplinas")) || [];
    return disciplinas.find(disc => 
      disc.professor && disc.professor.toLowerCase().trim() === nomeProfessor.toLowerCase().trim()
    );
  }

  // ==========================
  // 5️⃣ Função para Renderizar Disciplinas
  // ==========================
  function renderDisciplinas() {
    if (!disciplinasContainer) return;
    const disciplinas = JSON.parse(localStorage.getItem("disciplinas")) || [];

    disciplinasContainer.innerHTML = "";
    resumo.innerHTML = "";

    if (disciplinas.length === 0) {
      disciplinasContainer.innerHTML = `<p class="empty-state">Nenhuma disciplina adicionada ainda 🥺</p>`;
      return;
    }

    disciplinas.forEach((disc, index) => {
      const card = document.createElement("div");
      card.classList.add("disciplina-card");
      card.innerHTML = `
        <div class="disciplina-card-header">
          <h5>${disc.nome}</h5>
        </div>
        <div class="professor-info">
          <p><strong>Professor:</strong> ${disc.professor || "—"}</p>
        </div>
        <div class="disciplina-actions">
          <button class="btn btn-sm btn-professor" data-index="${index}">
            <i class="fas fa-user-plus"></i> ${disc.professor ? "Alterar Professor" : "Adicionar Professor"}
          </button>
          <button class="btn btn-sm btn-remover" data-index="${index}">
            <i class="fas fa-trash"></i> Remover
          </button>
        </div>
      `;
      disciplinasContainer.appendChild(card);
    });

    resumo.innerHTML = `
      <div class="alert alert-info">
        <strong>Total de disciplinas:</strong> ${disciplinas.length}
      </div>
    `;
  }

  // ==========================
  // 6️⃣ Adicionar Disciplina (COM VALIDAÇÃO)
  // ==========================
  btnAddDisciplina?.addEventListener("click", () => {
    const nome = inputNovaDisciplina.value.trim();
    if (!nome) return alert("Digite o nome da disciplina!");

    // Valida se disciplina já existe
    if (disciplinaJaExiste(nome)) {
      alert(`❌ A disciplina "${nome}" já existe!`);
      inputNovaDisciplina.value = "";
      inputNovaDisciplina.focus();
      return;
    }

    const disciplinas = JSON.parse(localStorage.getItem("disciplinas")) || [];
    disciplinas.push({ nome, professor: "" });
    localStorage.setItem("disciplinas", JSON.stringify(disciplinas));

    inputNovaDisciplina.value = "";
    renderDisciplinas();
    
    // Feedback visual
    btnAddDisciplina.innerHTML = '<i class="fas fa-check"></i> Adicionada!';
    setTimeout(() => {
      btnAddDisciplina.innerHTML = '<i class="fas fa-plus"></i> Adicionar Disciplina';
    }, 1500);
  });

  // ==========================
  // 7️⃣ Ações nas Disciplinas (COM VALIDAÇÃO DE PROFESSOR)
  // ==========================
  disciplinasContainer?.addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const index = btn.dataset.index;
    const disciplinas = JSON.parse(localStorage.getItem("disciplinas")) || [];

    if (btn.classList.contains("btn-remover")) {
      if (confirm(`Tem certeza que deseja remover a disciplina "${disciplinas[index].nome}"?`)) {
        disciplinas.splice(index, 1);
        localStorage.setItem("disciplinas", JSON.stringify(disciplinas));
        renderDisciplinas();
      }
    }

    if (btn.classList.contains("btn-professor")) {
      const disciplinaAtual = disciplinas[index];
      const professorAtual = disciplinaAtual.professor || "";
      
      const nomeProfessor = prompt(
        `Professor para ${disciplinaAtual.nome}:`,
        professorAtual
      );
      
      if (nomeProfessor === null) return; // Usuário cancelou
      
      const professor = nomeProfessor.trim();
      
      if (!professor) {
        // Remover professor se campo estiver vazio
        disciplinas[index].professor = "";
        localStorage.setItem("disciplinas", JSON.stringify(disciplinas));
        renderDisciplinas();
        return;
      }

      // Valida se professor já está em outra disciplina
      if (professorJaAtribuido(professor)) {
        const disciplinaComProfessor = encontrarDisciplinaDoProfessor(professor);
        if (disciplinaComProfessor && disciplinaComProfessor.nome !== disciplinaAtual.nome) {
          alert(`❌ O professor "${professor}" já está atribuído à disciplina "${disciplinaComProfessor.nome}"!`);
          return;
        }
      }

      disciplinas[index].professor = professor;
      localStorage.setItem("disciplinas", JSON.stringify(disciplinas));
      renderDisciplinas();
    }
  });

  // ==========================
  // 8️⃣ Enter para adicionar disciplina
  // ==========================
  inputNovaDisciplina?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      btnAddDisciplina.click();
    }
  });

  // ==========================
  // 9️⃣ Render inicial
  // ==========================
  renderDisciplinas();
});