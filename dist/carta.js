const carta = {
  Hamburguesas: [["Sencilla de carne",13000],["Sencilla con papas",17000],["Doble carne",18000],["Doble carne con papas",22000],["De pollo",15000],["Doble pollo",21000],["Ranchera con papas",26000],["La Preferida",30000]],
  Perros: [["Sencillo",6000],["Mozarella",8000],["A la plancha",8000],["Gemelo",10000],["Mexicano",14000],["Buti perro",14000],["Choriperro",14000],["Trifásico",26000]],
  Salchipapas: [["Sencilla",13000],["Gratinada",18000],["Italiana",20000],["Desgranada",20000],["Choripapa",16000],["Butipapa",16000],["Suiza especial",24000],["De la casa",25000]],
  "Pizzas personales": [["Con queso",13000],["Queso y jamón",15000],["Peperoni",16000],["Vegetariana",17000],["Tres carnes",19000],["Caprichosa",20000],["Mexicana",23000],["Especial Dilan",25000]],
  Salvajadas: [["Mini salvajada · personal",25000],["Mediana · 2 personas",29000],["Grande · 3 personas",34000],["Familiar · 3 o 4 personas",39000],["Extra familiar · 4 personas",47000],["Callejera · 5 o 6 personas",68000],["La Tremenda · 8 o 9 personas",93000],["Super salvajada · 12 personas",105000]]
};
const controles = document.querySelector(".tabs");
const platos = document.querySelector("#platos");
const pesos = new Intl.NumberFormat("es-CO");
function mostrar(categoria) {
  for (const boton of controles.children) boton.setAttribute("aria-pressed", String(boton.textContent === categoria));
  platos.replaceChildren(...carta[categoria].map(([nombre, precio]) => {
    const fila = document.createElement("div");
    fila.className = "item";
    const valor = document.createElement("span");
    valor.className = "price";
    valor.textContent = "$" + pesos.format(precio);
        const agregar = document.createElement("button");
    agregar.className = "agregar";
    agregar.textContent = "+ Agregar";
    agregar.setAttribute("aria-label", "Agregar " + nombre);
    agregar.onclick = () => personalizar(categoria, nombre);
    const titulo = document.createElement("strong");
    titulo.textContent = nombre;
    const detalle = document.createElement("div");
    detalle.append(titulo, valor);
    fila.append(detalle, agregar);
    return fila;
  }));
}
for (const categoria of Object.keys(carta)) {
  const boton = document.createElement("button");
  boton.textContent = categoria;
  boton.addEventListener("click", () => mostrar(categoria));
  controles.append(boton);
}
mostrar("Hamburguesas");

const $ = selector => document.querySelector(selector);
const moneda = valor => "$" + pesos.format(valor);
const producto = $("#producto");
const carrito = $("#carrito");
const clave = "dilan-pedido-v1";
function precio(linea) {
  return carta[linea.categoria]?.find(([nombre]) => nombre === linea.nombre)?.[1];
}
function recuperar() {
  try {
    const datos = JSON.parse(sessionStorage.getItem(clave));
    return Array.isArray(datos) ? datos.filter(l => l && Object.hasOwn(carta,l.categoria) && precio(l) && Number.isInteger(l.cantidad) && l.cantidad >= 1 && l.cantidad <= 99 && typeof l.nota === "string") : [];
  } catch { return []; }
}
let pedido = recuperar();
let seleccion;
let indiceEdicion = -1;
function importe(l) { return precio(l) * l.cantidad; }
function subtotal() { return pedido.reduce((s,l) => s + importe(l),0); }
function actualizar() {
  try { sessionStorage.setItem(clave, JSON.stringify(pedido)); } catch {}
  const unidades = pedido.reduce((s,l) => s + l.cantidad,0);
  $("#contador").textContent = unidades;
  $("#pedido-flotante").hidden = !unidades;
  $("#pedido-flotante").textContent = "Ver mi pedido (" + unidades + ") · " + moneda(subtotal());
  $("#subtotal").textContent = moneda(subtotal());
  $("#entrega").hidden = !unidades;
  const lineas = $("#lineas");
  lineas.replaceChildren();
  if (!unidades) lineas.textContent = "Tu carrito está vacío. Elige un plato de la carta para empezar.";
  pedido.forEach((l,i) => {
    const fila = document.createElement("article");
    const nombre = document.createElement("strong");
    nombre.textContent = l.cantidad + " × " + l.nombre + " · " + moneda(importe(l));
    const detalle = document.createElement("p");
    detalle.textContent = [l.categoria,l.nota].filter(Boolean).join(" · ");
    const editar = document.createElement("button");
    editar.type = "button";
    editar.textContent = "Editar";
    editar.onclick = () => { carrito.close(); personalizar(l.categoria,l.nombre,i); };
    const quitar = document.createElement("button");
    quitar.type = "button";
    quitar.textContent = "Quitar";
    quitar.onclick = () => { pedido.splice(i,1); actualizar(); };
    fila.append(nombre,detalle,editar,quitar);
    lineas.append(fila);
  });
}
function actualizarPrecio() {
  const unidades = $("#cantidad").valueAsNumber;
  const accion = indiceEdicion < 0 ? "Agregar al pedido" : "Guardar cambios";
  $("#guardar").textContent = accion + ($("#cantidad").validity.valid ? " · " + moneda(precio(seleccion) * unidades) : "");
}
function personalizar(categoria,nombre,indice = -1) {
  indiceEdicion = indice;
  seleccion = {categoria,nombre};
  $("#tipo").textContent = categoria;
  $("#nombre-plato").textContent = nombre;
  $("#cantidad").value = pedido[indice]?.cantidad ?? 1;
  $("#indicaciones").value = pedido[indice]?.nota ?? "";
  actualizarPrecio();
  producto.showModal();
}
$("#cantidad").oninput = actualizarPrecio;
$("#personalizar").onsubmit = evento => {
  evento.preventDefault();
  const linea = {...seleccion,cantidad:$("#cantidad").valueAsNumber,nota:$("#indicaciones").value.trim()};
  if (indiceEdicion < 0) pedido.push(linea);
  else pedido[indiceEdicion] = linea;
  actualizar();
  producto.close();
  $("#aviso").textContent = "Pedido actualizado. Subtotal " + moneda(subtotal());
};
producto.addEventListener("close", () => {
  if (indiceEdicion >= 0 && !carrito.open) carrito.showModal();
  indiceEdicion = -1;
});
$("#ver-carrito").onclick = $("#pedido-flotante").onclick = () => carrito.showModal();
for (const boton of document.querySelectorAll(".cerrar")) boton.onclick = () => boton.closest("dialog").close();
$(".seguir").onclick = () => { carrito.close(); location.hash = "menu"; $("#menu").scrollIntoView(); };
$("#entrega").onsubmit = evento => {
  evento.preventDefault();
  const cliente = $("#cliente"), direccion = $("#direccion");
  for (const campo of [cliente,direccion]) {
    campo.value = campo.value.trim();
    if (!campo.reportValidity()) return;
  }
  if (!pedido.length) return;
  const mensaje = ["Hola, Dilan. Quiero pedir a domicilio:", ...pedido.map(l =>
    l.cantidad + " × " + l.categoria + " / " + l.nombre + " — " + moneda(importe(l)) +
    (l.nota ? "\n  Indicaciones: " + l.nota : "")),
    "Subtotal de productos: " + moneda(subtotal()),"Nombre: " + cliente.value,
    "Dirección: " + direccion.value,"¿Me confirman el valor del domicilio y el total?"].join("\n");
  window.open("https://wa.me/573023817991?text=" + encodeURIComponent(mensaje), "_blank", "noopener,noreferrer");
};
actualizar();
