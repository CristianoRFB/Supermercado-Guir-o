const body = document.body;
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const header = document.querySelector(".header");
const themeToggle = document.getElementById("themeToggle");
const themeToggleIcon = document.querySelector(".theme-toggle__icon");
const themeToggleLabel = document.querySelector(".theme-toggle__label");
const addButtons = document.querySelectorAll(".add-to-list");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const clearCartButton = document.getElementById("clearCart");
const finishOrder = document.getElementById("finishOrder");
const cartToggle = document.getElementById("cartToggle");
const cartPanel = document.getElementById("cartPanel");
const contactForm = document.querySelector(".contact-form");
const filterChips = document.querySelectorAll(".filter-chip");
const offerCards = document.querySelectorAll(".offer-card");
const toast = document.getElementById("toast");
const backToTop = document.getElementById("backToTop");
const currentYear = document.getElementById("currentYear");

const cart = [];
const whatsappBase = "https://wa.me/551736312288?text=";
const savedTheme = localStorage.getItem("guirao-theme");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}

function applyTheme(theme) {
  body.dataset.theme = theme;
  const isDark = theme === "dark";
  themeToggle?.setAttribute("aria-pressed", String(isDark));

  if (themeToggleIcon) themeToggleIcon.textContent = isDark ? "☀️" : "🌙";
  if (themeToggleLabel) {
    themeToggleLabel.textContent = isDark ? "Modo claro" : "Modo escuro";
  }
}

function currencyToNumber(value) {
  return Number.parseFloat(value.replace(".", "").replace(",", ".")) || 0;
}

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function updateWhatsAppLink() {
  if (!cart.length) {
    finishOrder.href =
      whatsappBase +
      encodeURIComponent(
        "Olá, Supermercado Guirão! Quero montar um pedido e receber atendimento."
      );
    return;
  }

  const lines = cart.map(
    (item) =>
      `• ${item.name} — ${item.quantity}x — ${formatCurrency(item.price * item.quantity)}`
  );
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const message =
    "Olá, Supermercado Guirão! Segue minha lista de compras:%0A" +
    lines.join("%0A") +
    `%0A%0ATotal estimado: ${formatCurrency(total)}%0A` +
    "Gostaria de informações sobre entrega ou retirada na loja.";

  finishOrder.href = whatsappBase + message;
}

function renderCart() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  cartCount.textContent = quantity;
  cartTotal.textContent = formatCurrency(total);

  if (!cart.length) {
    cartItems.innerHTML = '<li class="cart__empty">Nenhum item adicionado ainda.</li>';
    updateWhatsAppLink();
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <li class="cart__item">
          <div>
            <strong>${item.name}</strong>
            <span>${item.quantity}x • ${formatCurrency(item.price)}</span>
          </div>
          <button type="button" data-remove="${item.name}">Remover</button>
        </li>
      `
    )
    .join("");

  updateWhatsAppLink();
}

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  renderCart();
  cartPanel?.classList.add("is-open");
  showToast(`${name} adicionado à sua lista.`);
}

function removeFromCart(name) {
  const itemIndex = cart.findIndex((item) => item.name === name);
  if (itemIndex === -1) return;

  if (cart[itemIndex].quantity > 1) {
    cart[itemIndex].quantity -= 1;
  } else {
    cart.splice(itemIndex, 1);
  }

  renderCart();
}

function setMenuState(isOpen) {
  mainNav?.classList.toggle("is-open", isOpen);
  menuToggle?.classList.toggle("is-open", isOpen);
  menuToggle?.setAttribute("aria-expanded", String(isOpen));
  body.classList.toggle("nav-open", isOpen);
}

function filterOffers(category) {
  offerCards.forEach((card) => {
    const shouldShow = category === "all" || card.dataset.category === category;
    card.classList.toggle("is-hidden", !shouldShow);
  });
}

if (savedTheme === "dark" || savedTheme === "light") {
  applyTheme(savedTheme);
} else {
  applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}

currentYear.textContent = new Date().getFullYear();

menuToggle?.addEventListener("click", () => {
  const isOpen = !mainNav.classList.contains("is-open");
  setMenuState(isOpen);
});

mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuState(false));
});

themeToggle?.addEventListener("click", () => {
  const nextTheme = body.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  localStorage.setItem("guirao-theme", nextTheme);
});

addButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const card = event.currentTarget.closest(".offer-card");
    const { product, price } = card.dataset;
    addToCart(product, currencyToNumber(price));

    const originalText = button.textContent;
    button.textContent = "Adicionado!";
    button.disabled = true;

    window.setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 1100);
  });
});

cartItems?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;
  removeFromCart(button.dataset.remove);
});

clearCartButton?.addEventListener("click", () => {
  cart.length = 0;
  renderCart();
  showToast("Sua lista foi limpa.");
});

cartToggle?.addEventListener("click", () => {
  cartPanel.classList.toggle("is-open");
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = contactForm.querySelector("button[type='submit']");
  const originalText = button.textContent;

  button.textContent = "Mensagem enviada!";
  button.disabled = true;
  showToast("Mensagem enviada com sucesso.");

  window.setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
    contactForm.reset();
  }, 1800);
});

filterChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    filterChips.forEach((item) => item.classList.remove("is-active"));
    chip.classList.add("is-active");
    filterOffers(chip.dataset.filter);
  });
});

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 10);
  backToTop?.classList.toggle("is-visible", window.scrollY > 600);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal-up").forEach((element) => observer.observe(element));

renderCart();
filterOffers("all");
