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

const WHATSAPP_NUMBER = "5359805123"; // Cambiar acá

// Función para extraer nombre, precio y tamaño
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

// Función para cargar productos desde JSON
async function cargarProductos() {
  const container = document.getElementById("products-container");
  if (!container) return;

  container.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>🔍 Cargando productos...</p>
        </div>
    `;

  try {
    // Usar ruta relativa correcta para GitHub Pages
    const response = await fetch("./src/productos.json");

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}: No se pudo cargar productos.json`,
      );
    }

    const data = await response.json();

    if (!data.imagenes || data.imagenes.length === 0) {
      container.innerHTML = `
                <div class="loading-spinner" style="grid-column:1/-1; text-align:center;">
                    <p>📁 No hay productos en el catálogo</p>
                    <p style="font-size:0.9rem;">Agrega imágenes a la carpeta /src/ y actualiza productos.json</p>
                </div>
            `;
      return;
    }

    container.innerHTML = "";
    let productosCargados = 0;

    for (const imgNombre of data.imagenes) {
      const imgPath = `./src/${imgNombre}`;
      const existe = await imagenExiste(imgPath);

      if (existe) {
        const { nombre, precio, tamaño } = parseFileName(imgNombre);

        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
                    <img src="${imgPath}" alt="${nombre}" loading="lazy" onerror="this.src='https://placehold.co/400x300/ffcfb6/white?text=📷+Error+de+carga'">
                    <div class="product-info">
                        <h3>${nombre}</h3>
                        <div class="price">💰 $${precio} <small>CUP</small></div>
                        <div class="size">📏 Tamaño: ${tamaño} cm</div>
                        <button class="whatsapp-btn" data-nombre="${nombre.replace(/'/g, "\\'")}" data-precio="${precio}" data-tamaño="${tamaño}">
                            <i class='bx bxl-whatsapp'></i> Comprar por WhatsApp
                        </button>
                    </div>
                `;

        container.appendChild(card);
        productosCargados++;

        const btn = card.querySelector(".whatsapp-btn");
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const nombreProd = btn.dataset.nombre;
          const precioProd = btn.dataset.precio;
          const tamañoProd = btn.dataset.tamaño;
          const mensaje = `Hola, quiero comprar *${nombreProd}* 🧶%0APrecio: $${precioProd} CUP%0ATamaño: ${tamañoProd} cm%0A¿Tienen stock?`;
          window.open(
            `https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`,
            "_blank",
          );
        });
      } else {
        console.log(`Imagen no encontrada: ${imgPath}`);
      }
    }

    if (productosCargados === 0) {
      container.innerHTML = `
                <div class="loading-spinner" style="grid-column:1/-1; text-align:center;">
                    <p>⚠️ No se encontraron las imágenes</p>
                    <p style="font-size:0.9rem;">Verifica que los archivos existan en /src/ con los nombres exactos:</p>
                    <pre style="text-align:left; display:inline-block; margin-top:1rem; background:#f5f5f5; padding:1rem; border-radius:8px;">${data.imagenes.join("\n")}</pre>
                </div>
            `;
    } else {
      // Agregar contador
      const contador = document.createElement("div");
      contador.style.cssText =
        "grid-column:1/-1; text-align:center; margin-top:2rem; font-size:0.9rem; color:#7a6a5c;";
      contador.innerHTML = `✨ Mostrando ${productosCargados} producto(s) ✨`;
      container.appendChild(contador);
    }
  } catch (error) {
    console.error("Error:", error);
    container.innerHTML = `
            <div class="loading-spinner" style="grid-column:1/-1; text-align:center;">
                <p>❌ Error al cargar productos</p>
                <p style="font-size:0.9rem;">Verifica que el archivo <strong>src/productos.json</strong> existe</p>
                <p style="font-size:0.8rem; color:#7a6a5c;">Detalle técnico: ${error.message}</p>
                <button onclick="cargarProductos()" class="btn" style="margin-top:1rem;">🔄 Reintentar</button>
            </div>
        `;
  }
}

function imagenExiste(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

function setupWhatsAppButtons() {
  const customOrderBtn = document.getElementById("customOrderBtn");
  if (customOrderBtn) {
    customOrderBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const mensaje =
        "Hola, quiero hacer un *pedido personalizado* en Arte ForHat 🧶";
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`, "_blank");
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
      window.open("https://www.instagram.com/arteforhat", "_blank");
    });
  }

  const footerInstagram = document.getElementById("footerInstagram");
  if (footerInstagram) {
    footerInstagram.addEventListener("click", (e) => {
      e.preventDefault();
      window.open("https://www.instagram.com/arteforhat", "_blank");
    });
  }

  const emailLink = document.getElementById("emailContact");
  if (emailLink) {
    emailLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "mailto:arteforhat@gmail.com";
    });
  }

  const footerEmail = document.getElementById("footerEmail");
  if (footerEmail) {
    footerEmail.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "mailto:arteforhat@gmail.com";
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
cargarProductos();
setupWhatsAppButtons();
setupSocialLinks();
