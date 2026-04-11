# 🛍️ Brechó de Verdade — Site Oficial

> Achados incríveis todos os dias, looks estilosos por preços reais  
> 📍 Rua Eng Augusto Durant, 14 — Perus, São Paulo  
> 📸 [@brecho.de.verdade](https://instagram.com/brecho.de.verdade)

---

## 📁 Estrutura de Arquivos

```
brecho-de-verdade/
├── index.html          ← Página principal
├── css/
│   └── style.css       ← Todos os estilos
├── js/
│   ├── produtos.js     ← Dados dos produtos (edite aqui para adicionar peças)
│   ├── carrinho.js     ← Lógica do carrinho + checkout WhatsApp
│   └── app.js          ← Renderização, filtros, modais, login
├── images/             ← Pasta para fotos dos produtos (futuramente)
└── README.md
```

---

## 🚀 Como usar

1. Abra o arquivo `index.html` em qualquer navegador
2. Nenhuma instalação necessária — HTML/CSS/JS puro

---

## 📱 Funcionalidades

- ✅ Página inicial com produtos em destaque
- ✅ Filtro por categoria (roupas, acessórios, calçados, bolsas)
- ✅ Modal com detalhes de cada produto
- ✅ Botão de compra direta via WhatsApp por produto
- ✅ Carrinho lateral com persistência via localStorage
- ✅ Adicionar / remover / alterar quantidade de itens
- ✅ Checkout pelo WhatsApp com lista de produtos e endereço
- ✅ Reutilização automática do último endereço informado
- ✅ Login simulado (dados salvos localmente)
- ✅ Botão fixo de WhatsApp
- ✅ Design responsivo (mobile, tablet e desktop)
- ✅ Animações suaves

---

## ✏️ Como adicionar produtos

Edite o arquivo `js/produtos.js` e adicione um novo objeto ao array `PRODUTOS`:

```js
{
  id: 13,                          // ID único (incrementar)
  nome: "Nome do produto",
  categoria: "roupas",             // roupas | acessorios | calcados | bolsas
  preco: 39.90,                    // Preço atual
  precoOriginal: 120.00,           // Preço original (opcional, mostra desconto)
  emoji: "👗",                     // Emoji representando a peça
  desc: "Descrição da peça...",
  tamanho: "M",
  estado: "Ótimo estado",          // Ótimo estado | Bom estado | Seminovo
  destaque: false                  // true = badge "Destaque" no card
}
```

---

## 📞 Configurar número do WhatsApp

No arquivo `js/carrinho.js`, linha 9:

```js
const WHATSAPP_NUMBER = "5511999999999"; // ← Substitua pelo número real (só números)
```

Formato: `55` (Brasil) + DDD + número. Ex: `5511987654321`

---

## 🎨 Cores do tema

| Variável         | Cor           | Uso                  |
|------------------|---------------|----------------------|
| `--verde`        | #2d4a3e       | Fundo principal      |
| `--terracota`    | #c4612a       | Destaques e preços   |
| `--creme`        | #f5f0e8       | Fundo claro          |

---

## 🔮 Próximos passos (backend)

O código está preparado para integração futura:
- Substituir o array `PRODUTOS` em `produtos.js` por uma chamada à API
- Substituir o login simulado por autenticação real (JWT, OAuth, etc.)
- Conectar o carrinho a um sistema de pedidos real
- Adicionar fotos reais na pasta `/images`

---

*Feito com ♥ para o Brechó de Verdade*
