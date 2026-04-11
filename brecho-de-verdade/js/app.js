/**
 * app.js — Lógica principal do Brechó de Verdade
 * Controla: renderização de produtos, filtros, modais, login, header scroll
 */

// =====================
// INICIALIZAÇÃO
// =====================

document.addEventListener("DOMContentLoaded", () => {
  carregarCarrinho();
  renderizarProdutos(PRODUTOS);
  verificarLogin();
  initScrollHeader();
  initAddressInput();
});

// =====================
// RENDERIZAÇÃO DE PRODUTOS
// =====================

/**
 * Renderiza os cards de produtos na grid
 * @param {Array} lista — lista de produtos a exibir
 */
function renderizarProdutos(lista) {
  const grid = document.getElementById("produtosGrid");
  if (!grid) return;

  if (lista.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--cinza);">
      <span style="font-size:3rem;display:block;margin-bottom:12px">🔍</span>
      Nenhum produto encontrado nessa categoria.
    </div>`;
    return;
  }

  grid.innerHTML = lista.map((p, i) => `
    <div class="produto-card" 
         style="animation-delay: ${i * 0.07}s"
         onclick="abrirModal(${p.id})">
      <div class="produto-img">
        ${p.destaque ? '<span class="produto-badge">Destaque</span>' : ""}
        ${p.emoji}
      </div>
      <div class="produto-info">
        <div class="produto-nome">${p.nome}</div>
        <div class="produto-desc">${p.desc.substring(0, 80)}…</div>
        <div class="produto-bottom">
          <div>
            ${p.precoOriginal ? `<span class="produto-preco-original">R$ ${p.precoOriginal.toFixed(2).replace(".", ",")}</span>` : ""}
            <span class="produto-preco">R$ ${p.preco.toFixed(2).replace(".", ",")}</span>
          </div>
          <button class="btn-add-cart" 
                  onclick="event.stopPropagation(); adicionarAoCarrinho(${p.id})"
                  title="Adicionar ao carrinho">
            +
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

// =====================
// FILTRO POR CATEGORIA
// =====================

/**
 * Filtra produtos por categoria e atualiza botões ativos
 * @param {string} categoria
 */
function filterCategory(categoria) {
  // Atualiza botões
  document.querySelectorAll(".cat-btn").forEach(btn => {
    btn.classList.remove("active");
    if (btn.textContent.toLowerCase().includes(categoria) || 
        (categoria === "todos" && btn.textContent === "Todos")) {
      btn.classList.add("active");
    }
  });

  const filtrados = categoria === "todos"
    ? PRODUTOS
    : PRODUTOS.filter(p => p.categoria === categoria);

  renderizarProdutos(filtrados);
}

// =====================
// MODAL DO PRODUTO
// =====================

/**
 * Abre o modal com detalhes de um produto
 * @param {number} produtoId
 */
function abrirModal(produtoId) {
  const produto = PRODUTOS.find(p => p.id === produtoId);
  if (!produto) return;

  const desconto = produto.precoOriginal
    ? Math.round((1 - produto.preco / produto.precoOriginal) * 100)
    : null;

  document.getElementById("modalContent").innerHTML = `
    <span class="modal-emoji">${produto.emoji}</span>
    <h2 class="modal-nome">${produto.nome}</h2>
    <div class="modal-preco">
      R$ ${produto.preco.toFixed(2).replace(".", ",")}
      ${produto.precoOriginal ? `<small style="font-size:0.9rem;color:#aaa;text-decoration:line-through;margin-left:8px;">
        R$ ${produto.precoOriginal.toFixed(2).replace(".", ",")}
      </small>` : ""}
      ${desconto ? `<span style="background:var(--terracota);color:white;font-size:0.75rem;padding:3px 10px;border-radius:50px;margin-left:8px;">-${desconto}%</span>` : ""}
    </div>
    <p class="modal-desc">${produto.desc}</p>
    <div class="modal-detalhe">
      <span class="detalhe-tag">📏 Tamanho: ${produto.tamanho}</span>
      <span class="detalhe-tag">✨ ${produto.estado}</span>
      <span class="detalhe-tag">🏷️ ${capitalize(produto.categoria)}</span>
    </div>
    <div class="modal-btns">
      <button class="btn-wpp-modal" onclick="comprarDireto(${produto.id})">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
        Comprar via WhatsApp
      </button>
      <button class="btn-cart-modal" onclick="adicionarAoCarrinho(${produto.id}); closeModal();">
        + Adicionar ao Carrinho
      </button>
    </div>
  `;

  document.getElementById("modal").classList.add("open");
  document.getElementById("modalOverlay").classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modal").classList.remove("open");
  document.getElementById("modalOverlay").classList.remove("show");
  document.body.style.overflow = "";
}

// =====================
// LOGIN SIMULADO
// =====================

function openLogin() {
  const user = getUsuario();
  if (user) {
    // Já logado — mostra opção de logout
    document.getElementById("loginContent").innerHTML = `
      <h3>Olá, ${user.nome}! 👋</h3>
      <p style="color:var(--cinza);margin-bottom:20px;">${user.email}</p>
      <button class="btn-primary full-width" onclick="fazerLogout()">Sair da conta</button>
    `;
  } else {
    document.getElementById("loginContent").innerHTML = `
      <h3>Entrar na sua conta</h3>
      <p>Salve seu endereço e histórico de pedidos</p>
      <input type="text" id="loginName" placeholder="Seu nome" />
      <input type="email" id="loginEmail" placeholder="E-mail" />
      <input type="password" id="loginPassword" placeholder="Senha" />
      <button class="btn-primary full-width" onclick="fazerLogin()">Entrar</button>
      <p class="login-hint">* Login simulado – dados salvos localmente</p>
    `;
  }
  document.getElementById("loginModal").classList.add("open");
  document.getElementById("loginOverlay").classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeLogin() {
  document.getElementById("loginModal").classList.remove("open");
  document.getElementById("loginOverlay").classList.remove("show");
  document.body.style.overflow = "";
}

function fazerLogin() {
  const nome = document.getElementById("loginName")?.value.trim();
  const email = document.getElementById("loginEmail")?.value.trim();
  const senha = document.getElementById("loginPassword")?.value;

  if (!nome || !email || !senha) {
    alert("Preencha todos os campos!");
    return;
  }
  if (!email.includes("@")) {
    alert("E-mail inválido!");
    return;
  }

  const usuario = { nome, email };
  localStorage.setItem("brecho_usuario", JSON.stringify(usuario));
  verificarLogin();
  closeLogin();
  mostrarFeedback(`Bem-vinda(o), ${nome}! 🎉`);
}

function fazerLogout() {
  localStorage.removeItem("brecho_usuario");
  verificarLogin();
  closeLogin();
  mostrarFeedback("Até logo! 👋");
}

function getUsuario() {
  const salvo = localStorage.getItem("brecho_usuario");
  if (!salvo) return null;
  try { return JSON.parse(salvo); } catch { return null; }
}

function verificarLogin() {
  const user = getUsuario();
  const btn = document.getElementById("btnLogin");
  if (!btn) return;
  if (user) {
    btn.textContent = `👤 ${user.nome.split(" ")[0]}`;
  } else {
    btn.textContent = "Entrar";
  }
}

// =====================
// MENU MOBILE
// =====================

function toggleMenu() {
  const nav = document.getElementById("nav");
  if (nav) nav.classList.toggle("open");
}

// Fecha menu ao clicar em link
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("nav")?.classList.remove("open");
  });
});

// =====================
// SCROLL HEADER
// =====================

function initScrollHeader() {
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 40);
    }
  });
}

// =====================
// ENDEREÇO — AUTOFILL
// =====================

function initAddressInput() {
  // Salva endereço ao digitar
  const input = document.getElementById("cartAddress");
  if (input) {
    input.addEventListener("blur", () => {
      salvarEndereco(input.value);
    });
  }
}

// =====================
// UTILITÁRIOS
// =====================

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
