// =====================================================================
// EJERCICIOS · Tienda DAW con carrito (resuelto)
// =====================================================================

class Producto {
  constructor(id, nombre, precio, stock, icono) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;      // precio SIN IVA
    this.stock = stock;        // unidades disponibles en la tienda
    this.icono = icono;
  }
  conIVA() {
    return this.precio * 1.21;
  }
  html() {
    return "<div class='producto'>" +
      "<span class='icono'>" + this.icono + "</span>" +
      "<h3>" + this.nombre + "</h3>" +
      "<span class='precio'>" + this.conIVA().toFixed(2) + " €</span>" +
      "<span class='stock'>Quedan " + this.stock + " unidades</span>" +
      "<button onclick='comprar(" + this.id + ")'>Añadir al carrito</button>" +
      "</div>";
  }
}

const productos = [
  new Producto(1, "Ratón inalámbrico", 19.90, 5, "🖱️"),
  new Producto(2, "Teclado mecánico", 49.90, 3, "⌨️"),
  new Producto(3, "Auriculares", 29.90, 4, "🎧"),
  new Producto(4, "Memoria USB 64 GB", 9.90, 10, "💾"),
  new Producto(5, "Webcam HD", 34.90, 2, "📷"),
  new Producto(6, "Alfombrilla XL", 12.50, 6, "🟩")
];

function pintarCatalogo() {
  let html = "";
  for (let i = 0; i < productos.length; i++) {
    html += productos[i].html();
  }
  document.getElementById("catalogo").innerHTML = html;
}

function buscarProducto(id) {
  for (let i = 0; i < productos.length; i++) {
    if (productos[i].id === id) return productos[i];
  }
  return null;
}

function aviso(texto) {
  document.getElementById("aviso").textContent = texto;
  setTimeout(() => {
    document.getElementById("aviso").textContent = "";
  }, 3000);
}

// ---------------------------------------------------------------------
// EJERCICIO 1 · La clase LineaCarrito
// ---------------------------------------------------------------------
class LineaCarrito {
  constructor(producto, cantidad = 1) {
    this.producto = producto;
    this.cantidad = cantidad > 0 ? cantidad : 1;
  }

  subtotal() {
    return this.producto.conIVA() * this.cantidad;
  }

  html() {
    return "<div class='linea'>" +
      "<span class='icono'>" + this.producto.icono + "</span>" +
      "<span class='nombre'>" + this.producto.nombre + "</span>" +
      "<span class='cantidad'>x" + this.cantidad + "</span>" +
      "<span class='subtotal'>" + this.subtotal().toFixed(2) + " €</span>" +
      "<button onclick='quitar(" + this.producto.id + ")'>✕</button>" +
      "</div>";
  }
}

// ---------------------------------------------------------------------
// El objeto carrito
// ---------------------------------------------------------------------
const carrito = {
  lineas: [],
  descuento: 0,

  // EJERCICIO 2
  buscarLinea(id) {
    for (let i = 0; i < this.lineas.length; i++) {
      if (this.lineas[i].producto.id === id) return this.lineas[i];
    }
    return null;
  },

  // EJERCICIO 2
  agregar(producto) {
    this.lineas.push(new LineaCarrito(producto, 1));
    return true;
  },

  // EJERCICIO 3
  quitar(id) {
    for (let i = 0; i < this.lineas.length; i++) {
      if (this.lineas[i].producto.id === id) {
        this.lineas.splice(i, 1);
        return;
      }
    }
  },

  // EJERCICIO 3
  vaciar() {
    this.lineas = [];
    this.descuento = 0;
  },

  // EJERCICIO 3
  unidades() {
    let suma = 0;
    for (let i = 0; i < this.lineas.length; i++) {
      suma += this.lineas[i].cantidad;
    }
    return suma;
  },

  // EJERCICIO 3
  total() {
    let suma = 0;
    for (let i = 0; i < this.lineas.length; i++) {
      suma += this.lineas[i].subtotal();
    }
    return suma;
  },

  // EJERCICIO 4
  aplicarCodigo(codigo) {
    if (codigo.trim().toUpperCase() === "DAW10") {
      this.descuento = 0.10;
      return true;
    }
    return false;
  },

  // DADO
  rebaja() {
    return Number((Number(this.total().toFixed(2)) * this.descuento).toFixed(2));
  },
  totalFinal() {
    return Number(this.total().toFixed(2)) - this.rebaja();
  }
};

// ---------------------------------------------------------------------
// EJERCICIO 3 y 4 · pintarCarrito()
// ---------------------------------------------------------------------
function pintarCarrito() {
  const contLineas = document.getElementById("carrito-lineas");
  const contResumen = document.getElementById("carrito-resumen");

  if (carrito.lineas.length === 0) {
    contLineas.innerHTML = "<p class='vacio'>Tu carrito está vacío</p>";
  } else {
    let html = "";
    for (let i = 0; i < carrito.lineas.length; i++) {
      html += carrito.lineas[i].html();
    }
    contLineas.innerHTML = html;
  }

  let resumen = "<p>" + carrito.unidades() + " unidades</p>";
  if (carrito.descuento > 0) {
    resumen += "<p>Subtotal: " + carrito.total().toFixed(2) + " €</p>" +
               "<p>Descuento (" + (carrito.descuento * 100) + " %): -" +
               carrito.rebaja().toFixed(2) + " €</p>";
  }
  resumen += "<p><strong>Total: " + carrito.totalFinal().toFixed(2) + " €</strong></p>";
  contResumen.innerHTML = resumen;

  guardar();
}

// ---------------------------------------------------------------------
// EJERCICIO 4 · localStorage
// ---------------------------------------------------------------------
function guardar() {
  const datos = {
    descuento: carrito.descuento,
    lineas: []
  };
  for (let i = 0; i < carrito.lineas.length; i++) {
    datos.lineas.push({
      id: carrito.lineas[i].producto.id,
      cantidad: carrito.lineas[i].cantidad
    });
  }
  localStorage.setItem("carrito", JSON.stringify(datos));
}

function cargar() {
  const texto = localStorage.getItem("carrito");
  if (texto === null) return;

  const datos = JSON.parse(texto);
  carrito.descuento = datos.descuento;
  carrito.lineas = [];
  for (let i = 0; i < datos.lineas.length; i++) {
    const producto = buscarProducto(datos.lineas[i].id);
    if (producto !== null) {
      carrito.lineas.push(new LineaCarrito(producto, datos.lineas[i].cantidad));
    }
  }
}

// ---------------------------------------------------------------------
// DADO: los eventos
// ---------------------------------------------------------------------
function comprar(id) {
  const producto = buscarProducto(id);
  if (!carrito.agregar(producto)) {
    aviso("No quedan más unidades de " + producto.nombre);
  }
  pintarCarrito();
}

function quitar(id) {
  carrito.quitar(id);
  pintarCarrito();
}

document.getElementById("vaciar").addEventListener("click", () => {
  carrito.vaciar();
  pintarCarrito();
});

document.getElementById("aplicar").addEventListener("click", () => {
  const campo = document.getElementById("codigo");
  if (carrito.descuento > 0) {
    aviso("Ya has aplicado un código de descuento");
  } else if (!carrito.aplicarCodigo(campo.value)) {
    aviso("Código no válido");
  } else {
    campo.value = "";
    pintarCarrito();
  }
});

// ---------------------------------------------------------------------
// AL ABRIR LA PÁGINA
// ---------------------------------------------------------------------
pintarCatalogo();
cargar();
pintarCarrito();