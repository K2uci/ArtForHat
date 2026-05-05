// script.js - VERSIÓN CON 4 CATEGORÍAS
const WHATSAPP_NUMBER = "5363168639";
let categoriaActual = "pulsera";
let productosData = null;

// Menu mobile
const menuIcon = document.querySelector("#menu-icon");
const navbar = document.querySelector(".navbar");

if (menuIcon) {
  menuIcon.onclick = () => {
    menuIcon.classList.toggle("bx-x");
    navbar.classList.toggle("active");
  };
}

window.onscroll = () => {
  if (menuIcon) {
    menuIcon.classList.remove("bx-x");
    navbar.classList.remove("active");
  }
};

// Función para parsear nombres de archivo (formato: nombre_precio_tamaño.jpg)
function parseFileName(fileName) {
  const sinExtension = fileName.replace(/\.[^/.]+$/, "");
  const partes = sinExtension.split("_");

  if (partes.length >= 3) {
    const tamaño = partes[partes.length - 1];
    const precio = partes[partes.length - 2];
    const nombre = partes.slice(0, -2).join(" ");
    return { nombre, precio, tamaño };
  }

  return {
    nombre: sinExtension.replace(/_/g, " "),
    precio: "consultar",
    tamaño: "estándar",
  };
}

// Función para cargar productos de una categoría específica
async function cargarProductosPorCategoria(categoriaId) {
  const container = document.getElementById("products-container");
  if (!container) return;

  container.innerHTML = `
    <div class="loading-spinner">
      <div class="spinner"></div>
      <p>🔍 Cargando productos...</p>
    </div>
  `;

  try {
    // Si aún no tenemos los datos, cargarlos
    if (!productosData) {
      const response = await fetch("./src/productos.json");
      if (!response.ok) {
        throw new Error("No se pudo cargar productos.json");
      }
      productosData = await response.json();
    }

    // Buscar la categoría seleccionada
    const categoria = productosData.categorias.find(
      (cat) => cat.id === categoriaId,
    );

    if (!categoria || !categoria.imagenes || categoria.imagenes.length === 0) {
      container.innerHTML = `
        <div class="loading-spinner">
          <p>📁 No hay productos en esta categoría</p>
          <p style="font-size:0.9rem;">Pronto agregaremos más productos ✨</p>
        </div>
      `;
      return;
    }

    container.innerHTML = "";

    // Agregar productos de la categoría
    categoria.imagenes.forEach((imgNombre) => {
      const imgPath = `./src/${categoriaId}/${imgNombre}`;
      const { nombre, precio, tamaño } = parseFileName(imgNombre);

      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${imgPath}" 
             alt="${nombre}" 
             loading="lazy"
             onerror="this.src='https://placehold.co/400x300/ffcfb6/white?text=📷+Error+de+carga'">
        <div class="product-info">
          <h3>${nombre.replace(/_/g, " ")}</h3>
          <div class="price">💰 $${precio} <small>CUP</small></div>
          <div class="size">📏 Tamaño: ${tamaño} cm</div>
          <button class="whatsapp-btn" 
                  data-nombre="${nombre.replace(/'/g, "\\'")}" 
                  data-precio="${precio}" 
                  data-tamaño="${tamaño}">
            <i class='bx bxl-whatsapp'></i> Comprar por WhatsApp
          </button>
        </div>
      `;

      container.appendChild(card);

      const btn = card.querySelector(".whatsapp-btn");
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const mensaje = `Hola, quiero comprar *${btn.dataset.nombre}* 🧶%0APrecio: $${btn.dataset.precio} CUP%0ATamaño: ${btn.dataset.tamaño} cm%0A¿Tienen stock?`;
        window.open(
          `https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`,
          "_blank",
        );
      });
    });
  } catch (error) {
    console.error("Error:", error);
    container.innerHTML = `
      <div class="loading-spinner">
        <p>❌ Error al cargar productos</p>
        <p style="font-size:0.9rem;">Verifica que el archivo <strong>src/productos.json</strong> tenga el formato correcto</p>
        <button onclick="location.reload()" class="btn" style="margin-top:1rem;">🔄 Reintentar</button>
      </div>
    `;
  }
}

// Configurar tabs de categorías
function setupCategoryTabs() {
  const tabs = document.querySelectorAll(".tab-btn");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Actualizar clase activa en tabs
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      // Cargar productos de la categoría seleccionada
      const categoryId = tab.getAttribute("data-category");
      categoriaActual = categoryId;
      cargarProductosPorCategoria(categoryId);
    });
  });
}

// Configurar botones de WhatsApp y redes sociales
function setupWhatsAppButtons() {
  const customOrderBtn = document.getElementById("customOrderBtn");
  if (customOrderBtn) {
    customOrderBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=Hola%2C%20quiero%20hacer%20un%20*pedido%20personalizado*%20en%20Arte%20ForHat%20🧶`,
        "_blank",
      );
    });
  }

  const whatsappContact = document.getElementById("whatsappContact");
  if (whatsappContact) {
    whatsappContact.addEventListener("click", (e) => {
      e.preventDefault();
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20Arte%20ForHat`,
        "_blank",
      );
    });
  }

  const footerWhatsapp = document.getElementById("footerWhatsapp");
  if (footerWhatsapp) {
    footerWhatsapp.addEventListener("click", (e) => {
      e.preventDefault();
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20Arte%20ForHat`,
        "_blank",
      );
    });
  }
}

function setupSocialLinks() {
  const instagramLink = document.getElementById("instagramContact");
  if (instagramLink) {
    instagramLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.open(
        "https://www.instagram.com/arte_forhat?igsh=MXhsazRhd3JkcTB5Mw==",
        "_blank",
      );
    });
  }

  const footerInstagram = document.getElementById("footerInstagram");
  if (footerInstagram) {
    footerInstagram.addEventListener("click", (e) => {
      e.preventDefault();
      window.open(
        "https://www.instagram.com/arte_forhat?igsh=MXhsazRhd3JkcTB5Mw==",
        "_blank",
      );
    });
  }

  const emailLink = document.getElementById("emailContact");
  if (emailLink) {
    emailLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "mailto: patriciafaureforhat@gmail.com";
    });
  }

  const footerEmail = document.getElementById("footerEmail");
  if (footerEmail) {
    footerEmail.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "mailto: patriciafaureforhat.com";
    });
  }
}

// Scroll suave y active nav
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".navbar a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.offsetHeight;
    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      current = section.getAttribute("id");
    }
  });
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// Inicializar
cargarProductosPorCategoria("pulseras");
setupCategoryTabs();
setupWhatsAppButtons();
setupSocialLinks();
