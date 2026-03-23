const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const addButtons = document.querySelectorAll(".add-to-list");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const clearCartButton = document.getElementById("clearCart");
const finishOrder = document.getElementById("finishOrder");
const cartToggle = document.getElementById("cartToggle");
const cartPanel = document.getElementById("cartPanel");
const contactForm = document.querySelector(".contact-form");

const cart = [];
const whatsappBase = "https://wa.me/551736312288?text=";

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
    cartItems.innerHTML =
      '<li class="cart__empty">Nenhum item adicionado ainda.</li>';
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

menuToggle?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

addButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const card = event.currentTarget.closest(".offer-card");
    const { product, price } = card.dataset;
    addToCart(product, currencyToNumber(price));
    button.textContent = "Adicionado!";
    setTimeout(() => {
      button.textContent = "Adicionar à lista";
    }, 1200);
  });
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;
  removeFromCart(button.dataset.remove);
});

clearCartButton?.addEventListener("click", () => {
  cart.length = 0;
  renderCart();
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

  setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
    contactForm.reset();
  }, 1800);
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

document
  .querySelectorAll(
    ".feature-card, .category-card, .offer-card, .info-card, .testimonial-card, .about__stats article"
  )
  .forEach((element) => {
    element.classList.add("reveal");
    observer.observe(element);
  });

renderCart();
