// Menu mobile
const menuIcon = document.querySelector("#menu-icon");
const navbar = document.querySelector(".navbar");

if (menuIcon) {
  menuIcon.onclick = () => {
    menuIcon.classList.toggle("bx-x");
    navbar.classList.toggle("active");
  };
}

// Cerrar menú al scroll
window.onscroll = () => {
  if (menuIcon) {
    menuIcon.classList.remove("bx-x");
    navbar.classList.remove("active");
  }
};

// Número de WhatsApp (cambiar por el número real)
const WHATSAPP_NUMBER = "5359805123"; // Cambiar acá

// Función para extraer nombre, precio y tamaño del nombre del archivo
// Formato esperado: "Nombre_del_producto_precio_tamaño.ext"
function parseFileName(fileName) {
  // Eliminar la extensión
  const sinExtension = fileName.replace(/\.[^/.]+$/, "");

  // Buscar patrón con guiones bajos: nombre_precio_tamaño
  const partes = sinExtension.split("_");

  if (partes.length >= 3) {
    // La última parte es tamaño, penúltima es precio, el resto es el nombre
    const tamaño = partes[partes.length - 1];
    const precio = partes[partes.length - 2];
    const nombre = partes.slice(0, -2).join(" ");
    return { nombre, precio, tamaño };
  }

  // Si no tiene el formato esperado, mostrar como está
  return {
    nombre: sinExtension.replace(/_/g, " "),
    precio: "consultar",
    tamaño: "estándar",
  };
}

// Función para listar TODAS las imágenes de la carpeta src
// Como JavaScript no puede listar directorios directamente,
// usamos un archivo manifest.json que se puede generar fácilmente
// O el usuario puede hacer clic en "Actualizar productos"

// PRIMERA OPCIÓN: Usar un archivo productos.json generado manualmente
// CREAR archivo src/productos.json con el siguiente formato:
// {
//   "imagenes": [
//     "Gorrito Pompón,1500,22.jpg",
//     "moto acuatica,2500,30.png"
//   ]
// }

async function cargarProductos() {
  const container = document.getElementById("products-container");
  if (!container) return;

  container.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>🔍 Escaneando productos...</p>
        </div>
    `;

  const productosEncontrados = [];
  const extensiones = ["jpg", "jpeg", "png", "webp", "gif", "bmp", "svg"];

  // MÉTODO 1: Intentar cargar desde productos.json (RECOMENDADO)
  try {
    const response = await fetch("./src/productos.json");
    if (response.ok) {
      const data = await response.json();
      if (data.imagenes && Array.isArray(data.imagenes)) {
        for (const imgNombre of data.imagenes) {
          const imgPath = `./src/${imgNombre}`;
          const existe = await imagenExiste(imgPath);
          if (existe) {
            const { nombre, precio, tamaño } = parseFileName(imgNombre);
            productosEncontrados.push({
              path: imgPath,
              nombre: nombre,
              precio: precio,
              tamaño: tamaño,
              archivo: imgNombre,
            });
          }
        }
      }
    }
  } catch (e) {
    console.log("No se encontró productos.json");
  }

  // MÉTODO 2: Si no hay JSON, buscar archivos con nombres predecibles
  if (productosEncontrados.length === 0) {
    // Lista de posibles nombres a buscar (el usuario puede expandir esta lista)
    const posiblesNombres = [
      "Gorrito Pompón,1500,22",
      "Gorritoe Pompón,1500,24",
      "Gorritos Pompón,1500,23",
      "Gorrito Pompón,1500,25",
      "moto acuatica,2500,30",
      "Bufanda Nórdica,2200,35",
      "Manta Bebé,3200,60",
      "Chal Elegante,2100,45",
    ];

    for (const nombreBase of posiblesNombres) {
      for (const ext of extensiones) {
        const imgPath = `./src/${nombreBase}.${ext}`;
        const existe = await imagenExiste(imgPath);
        if (existe) {
          const { nombre, precio, tamaño } = parseFileName(nombreBase);
          productosEncontrados.push({
            path: imgPath,
            nombre: nombre,
            precio: precio,
            tamaño: tamaño,
            archivo: `${nombreBase}.${ext}`,
          });
          break;
        }
      }
    }
  }

  // Mostrar mensaje si no hay productos
  if (productosEncontrados.length === 0) {
    container.innerHTML = `
            <div class="loading-spinner" style="grid-column:1/-1; text-align:center; padding:3rem;">
                <p style="font-size:1.2rem; margin-bottom:1rem;">📁 Agrega imágenes a la carpeta <strong>/src/</strong></p>
                <p style="font-size:0.9rem; color:#7a6a5c;">Formato del nombre: <strong>Nombre del producto,precio,tamaño.ext</strong></p>
                <p style="font-size:0.9rem;">Ejemplo: <strong>Gorrito Pompón,1500,22.jpg</strong></p>
                <p style="font-size:0.9rem; margin-top:1rem;">📝 También puedes crear un archivo <strong>src/productos.json</strong> con la lista de imágenes</p>
                <button onclick="generarPlantillaJSON()" class="btn btn-outline" style="margin-top:1.5rem;">📄 Generar plantilla productos.json</button>
                <button onclick="cargarProductos()" class="btn" style="margin-top:1.5rem; margin-left:1rem;">🔄 Buscar nuevamente</button>
            </div>
        `;
    return;
  }

  // Mostrar productos encontrados
  container.innerHTML = "";

  productosEncontrados.forEach((producto) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
            <img src="${producto.path}" alt="${producto.nombre}" loading="lazy" onerror="this.src='https://placehold.co/400x300/ffcfb6/white?text=📷+Imagen+no+encontrada'">
            <div class="product-info">
                <h3>${producto.nombre}</h3>
                <div class="price">💰 $${producto.precio} <small>CUP</small></div>
                <div class="size">📏 Tamaño: ${producto.tamaño} cm</div>
                <button class="whatsapp-btn" data-nombre="${producto.nombre.replace(/'/g, "\\'")}" data-precio="${producto.precio}" data-tamaño="${producto.tamaño}">
                    <i class='bx bxl-whatsapp'></i> Comprar por WhatsApp
                </button>
            </div>
        `;

    container.appendChild(card);

    const btn = card.querySelector(".whatsapp-btn");
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const nombre = btn.dataset.nombre;
      const precio = btn.dataset.precio;
      const tamaño = btn.dataset.tamaño;
      const mensaje = `Hola, quiero comprar *${nombre}* 🧶%0APrecio: $${precio} CUP%0ATamaño: ${tamaño} cm%0A¿Tienen stock?`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`, "_blank");
    });
  });

  // Agregar contador de productos
  const contador = document.createElement("div");
  contador.style.cssText =
    "grid-column:1/-1; text-align:center; margin-top:2rem; font-size:0.9rem; color:#7a6a5c;";
  contador.innerHTML = `✨ Mostrando ${productosEncontrados.length} producto(s) ✨`;
  container.appendChild(contador);
}

// Función para generar una plantilla de productos.json
function generarPlantillaJSON() {
  const plantilla = {
    imagenes: [
      "Gorrito Pompón,1500,22.jpg",
      "Bufanda Nórdica,2500,35.png",
      "Manta Bebé,3200,60.webp",
    ],
  };

  const jsonString = JSON.stringify(plantilla, null, 2);

  // Crear blob y descargar
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "productos.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  alert(
    "📄 Archivo productos.json generado. Colócalo en la carpeta /src/ y edítalo con tus imágenes.",
  );
}

// Verificar si una imagen existe
function imagenExiste(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

// Función para recargar productos manualmente
window.recargarProductos = function () {
  cargarProductos();
};

// Configurar todos los botones de WhatsApp
function setupWhatsAppButtons() {
  const customOrderBtn = document.getElementById("customOrderBtn");
  if (customOrderBtn) {
    customOrderBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const mensaje =
        "Hola, quiero hacer un *pedido personalizado* en Arte ForHat 🧶%0AMe gustaría contarles mi idea:";
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`, "_blank");
    });
  }

  const whatsappContact = document.getElementById("whatsappContact");
  if (whatsappContact) {
    whatsappContact.addEventListener("click", (e) => {
      e.preventDefault();
      const mensaje = "Hola, me interesa contactar con Arte ForHat 🧶";
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`, "_blank");
    });
  }

  const footerWhatsapp = document.getElementById("footerWhatsapp");
  if (footerWhatsapp) {
    footerWhatsapp.addEventListener("click", (e) => {
      e.preventDefault();
      const mensaje = "Hola, me interesa contactar con Arte ForHat 🧶";
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`, "_blank");
    });
  }
}

// Configurar redes sociales
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
