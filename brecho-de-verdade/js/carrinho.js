/**
 * carrinho.js — Lógica do Carrinho de Compras
 * Persistência via localStorage. Integração com WhatsApp para checkout.
 */

// =====================
// ESTADO DO CARRINHO
// =====================

/** @type {{ id: number, nome: string, preco: number, emoji: string, qty: number }[]} */
let carrinho = [];
const WHATSAPP_NUMBER = "5511999999999"; // ← Substitua pelo número real

// Carrega carrinho salvo ao inicializar
function carregarCarrinho() {
  const salvo = localStorage.getItem("brecho_carrinho");
  if (salvo) {
    try { carrinho = JSON.parse(salvo); } catch (e) { carrinho = []; }
  }
  atualizarUI();
}

// Salva carrinho no localStorage
function salvarCarrinho() {
  localStorage.setItem("brecho_carrinho", JSON.stringify(carrinho));
}

// =====================
// OPERAÇÕES
// =====================

/**
 * Adiciona produto ao carrinho ou incrementa a quantidade
 * @param {number} produtoId
 */
function adicionarAoCarrinho(produtoId) {
  const produto = PRODUTOS.find(p => p.id === produtoId);
  if (!produto) return;

  const existente = carrinho.find(i => i.id === produtoId);
  if (existente) {
    existente.qty += 1;
  } else {
    carrinho.push({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      emoji: produto.emoji,
      qty: 1
    });
  }

  salvarCarrinho();
  atualizarUI();
  mostrarFeedback("✓ Adicionado ao carrinho!");
}

/**
 * Remove 1 unidade de um item; se qty = 1, remove completamente
 * @param {number} produtoId
 */
function removerDoCarrinho(produtoId) {
  const idx = carrinho.findIndex(i => i.id === produtoId);
  if (idx === -1) return;
  if (carrinho[idx].qty > 1) {
    carrinho[idx].qty -= 1;
  } else {
    carrinho.splice(idx, 1);
  }
  salvarCarrinho();
  atualizarUI();
  renderizarItensCarrinho();
}

/**
 * Remove item completamente do carrinho
 * @param {number} produtoId
 */
function removerItemCompleto(produtoId) {
  carrinho = carrinho.filter(i => i.id !== produtoId);
  salvarCarrinho();
  atualizarUI();
  renderizarItensCarrinho();
}

/** Limpa todo o carrinho */
function clearCart() {
  if (carrinho.length === 0) return;
  if (!confirm("Tem certeza que deseja limpar o carrinho?")) return;
  carrinho = [];
  salvarCarrinho();
  atualizarUI();
  renderizarItensCarrinho();
}

// =====================
// TOTAL
// =====================

function calcularTotal() {
  return carrinho.reduce((acc, item) => acc + item.preco * item.qty, 0);
}

// =====================
// UI
// =====================

function atualizarUI() {
  const total = carrinho.reduce((acc, i) => acc + i.qty, 0);
  const el = document.getElementById("cartCount");
  if (el) el.textContent = total;
}

function renderizarItensCarrinho() {
  const container = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  if (!container) return;

  if (carrinho.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <span class="cart-empty-icon">🛒</span>
        <p>Seu carrinho está vazio.</p>
        <p style="font-size:0.85rem;color:#aaa;margin-top:6px">Adicione produtos para começar!</p>
      </div>`;
    if (totalEl) totalEl.textContent = "R$ 0,00";
    return;
  }

  container.innerHTML = carrinho.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <span class="cart-item-emoji">${item.emoji}</span>
      <div class="cart-item-info">
        <div class="cart-item-nome">${item.nome}</div>
        <div class="cart-item-preco">R$ ${(item.preco * item.qty).toFixed(2).replace(".", ",")}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="removerDoCarrinho(${item.id})">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="adicionarAoCarrinho(${item.id})">+</button>
        </div>
      </div>
      <button class="btn-remove-item" onclick="removerItemCompleto(${item.id})" title="Remover">✕</button>
    </div>
  `).join("");

  if (totalEl) {
    const total = calcularTotal();
    totalEl.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
  }

  // Preenche endereço salvo
  preencherEnderecoSalvo();
}

// =====================
// ENDEREÇO
// =====================

function preencherEnderecoSalvo() {
  const inputEnd = document.getElementById("cartAddress");
  if (!inputEnd) return;
  const ultimoEndereco = localStorage.getItem("brecho_ultimo_endereco");
  if (ultimoEndereco) inputEnd.value = ultimoEndereco;
}

function salvarEndereco(endereco) {
  if (endereco && endereco.trim()) {
    localStorage.setItem("brecho_ultimo_endereco", endereco.trim());
  }
}

// =====================
// CHECKOUT VIA WHATSAPP
// =====================

function finalizarCompra() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  const enderecoInput = document.getElementById("cartAddress");
  const endereco = enderecoInput ? enderecoInput.value.trim() : "";

  // Salva endereço para reutilizar depois
  salvarEndereco(endereco);

  // Monta mensagem
  let msg = "Olá! Gostaria de fazer um pedido no Brechó de Verdade 🛍️\n\n";
  msg += "*Itens do pedido:*\n";

  carrinho.forEach(item => {
    msg += `• ${item.nome} (x${item.qty}) — R$ ${(item.preco * item.qty).toFixed(2).replace(".", ",")}\n`;
  });

  const total = calcularTotal();
  msg += `\n*Total: R$ ${total.toFixed(2).replace(".", ",")}*`;

  if (endereco) {
    msg += `\n\n*Endereço de entrega:*\n${endereco}`;
  }

  msg += "\n\nAguardo confirmação! 😊";

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}

// =====================
// COMPRA DIRETA (produto único)
// =====================

/**
 * Abre WhatsApp direto para um produto específico
 * @param {number} produtoId
 */
function comprarDireto(produtoId) {
  const produto = PRODUTOS.find(p => p.id === produtoId);
  if (!produto) return;

  const msg = `Olá! Vi o site do Brechó de Verdade e tenho interesse no item:\n\n*${produto.nome}*\nTamanho: ${produto.tamanho}\nValor: R$ ${produto.preco.toFixed(2).replace(".", ",")}\n\nAinda está disponível? 😊`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}

// =====================
// SIDEBAR TOGGLE
// =====================

function toggleCart() {
  const sidebar = document.getElementById("cartSidebar");
  const overlay = document.getElementById("cartOverlay");
  if (!sidebar) return;

  const isOpen = sidebar.classList.contains("open");
  sidebar.classList.toggle("open", !isOpen);
  overlay.classList.toggle("show", !isOpen);

  if (!isOpen) renderizarItensCarrinho();
}

// =====================
// FEEDBACK TOAST
// =====================

function mostrarFeedback(msg) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.style.cssText = `
      position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
      background: var(--verde); color: white;
      padding: 12px 24px; border-radius: 50px;
      font-family: var(--font-body); font-weight: 600; font-size: 0.9rem;
      z-index: 9999; opacity: 0; transition: opacity 0.3s;
      box-shadow: 0 6px 24px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = "1";
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => { toast.style.opacity = "0"; }, 2000);
}
