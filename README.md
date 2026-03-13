# WEB-ISW-233

Simple todo app with Vanilla JS

You have a code that works but it has several problems 

What if we want to:
- Save the list locally?
- Add keyboard shortcuts?
- Make it more complex in the future?
- Create an undo action?

Your task:
- Decouple the project using design patterns!!!
- Be creative make your to answer the previous questions 

## USADO

COMMAND FUE USADO PARA LOS COMANDOS DEL CARRITO. DE MOMENTO TENGO Add, PERO PODRIAN SER MAS SI QUIERO MEJORAR EL CARRITO EN UN FUTURO COMO ELIMINAR SOLO UNA UNIDAD, ELIMINAR TODO.

PROXY QUE ESTA IMPLEMENTADO EN EL CODIGO SERIA UN OBSERVER PARA EL CARRITO.

COMMAND TAMBIEN PARA LOS ATAJOS DE TECLADO de control z para cuando meto un elemento al carrito

## IA

NECESITO QUE HAGAS QUE EL CODIGO SEA SUPER SENCILLO. QUE UN ESTUDIANTE LO PUEDA ENTENDER LUEGO SU LOGICA. PUEDES CREAR MAS ARCHIVOS SI LO VES CONVENIENETE

He dejado el código mucho más sencillo y directo, manteniendo las funciones actuales pero eliminando capas innecesarias:

Estado: Store.js ahora solo dispara eventos para menu y cart con una línea clara.
Carrito y undo: Order.js usa un historial simple de snapshots. addToCart, removeFromCart y clearCart guardan el estado previo y undoCart() lo restaura. Sin clases ni comandos.
Atajo de teclado: index.js importa undoCart y añade el listener Ctrl/Cmd+Z de forma simple.
Router: Router.js usa un routeMap pequeño y replaceChildren con parsing de id legible.
Componentes:
productItem.js y productDetail.js llaman directamente a addToCart para que el undo funcione sin enredos.
orderPage.js se mantiene igual en lógica; calcula total limpiando el símbolo $.

EN QUE PARTE DEL PROYECTO DEFINE DONDE MOSTRAR LOS /products/id? el html

} else if (route.startsWith("/products/")) {
  const id = route.split("/").pop();
  const detail = document.createElement("product-detail");
  detail.dataset.productId = id;
  pageElement = detail;
}

this.innerHTML = `
  <article class="product-detail">
    <h1>${product.title}</h1>
    <img src="${product.imageUrl}" alt="${product.title}"/>
    <p>${product.description}</p>
    <p class="price">${product.price}</p>
    <button id="add">Add to cart</button>
  </article>
`;

donde esta lo de key down?

// index.js
import { CartActions } from "./services/Order.js";

// ...existing code...
window.addEventListener("DOMContentLoaded", async () => {
  const stored = await loadCart();
  if (stored && stored.length) {
    app.store.cart = stored;
  }
  loadData();
  app.router.init();

  // Escuchar teclado para los atajos
  window.addEventListener("keydown", (e) => {
    // Si presionas Ctrl+Z o Cmd+Z (Mac)...
    if ((e.ctrlKey || e.metaKey) && e.key === "z") {
      CartActions.undo(); // Llama a la función de deshacer
      e.preventDefault();  // Evita que el navegador haga algo propio con la tecla
    }
  });
});
// ...existing code...

VERIFICA SI DE VERDAD FUNCIONA

He verificado todos los puntos del flujo y la arquitectura es sólida:

Añadir productos: addToCart(id) usa await getProductById(id) para obtener el objeto real y luego actualiza app.store.cart (de forma inmutable con map o spread).
Reactividad: app.store es un Proxy. Cada vez que asignas app.store.cart = ..., el proxy dispara window.dispatchEvent(new Event("appcartchange")).
UI Automática: Tanto el badge del menú (en index.js) como la OrderPage están suscritos a ese evento. En cuanto el carrito cambia, el número del badge se recalcula y la página de pedido se repinta sola (gracias al render() en el listener).
Persistencia: He comprobado que index.js llama a saveCart(app.store.cart) en cada cambio y restaura los datos al cargar la app. Esto significa que si cierras el navegador y vuelves a entrar, tus productos siguen ahí.
Eliminar productos: removeFromCart(id) simplemente filtra el array. Al reasignarlo, el proxy dispara todo el ciclo de actualización anterior, por lo que el artículo desaparece visualmente al instante.
Veredicto: Funciona correctamente.
La única forma de que fallara sería si la API de donde sacas los productos (getProductById) devolviera algo que no tiene id o price, pero por lo que he visto en tu Menu.js y API.js, la estructura es coherente.

Para probarlo, simplemente:

Haz clic en el botón "Add to cart" de cualquier producto.
Mira cómo el circulito rojo (badge) aparece arriba con un "1".
Vete a la sección de carrito (/order).
Borra el producto y verás cómo el total y el badge vuelven a cero.
Todo el ciclo está cerrado.