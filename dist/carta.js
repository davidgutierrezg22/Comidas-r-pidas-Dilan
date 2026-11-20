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
    fila.append(nombre, valor);
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
