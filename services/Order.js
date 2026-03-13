import { getProductById } from "./Menu.js";

// Historial simple para poder deshacer (guardar estados previos del carrito)
const history = [];

function snapshotCart() {
  return app.store.cart.map((item) => ({
    product: item.product,
    quantity: item.quantity,
  }));
}

function pushHistory() {
  history.push(snapshotCart());
}

export function undoCart() {
  const prev = history.pop();
  if (prev) {
    app.store.cart = prev;
  }
}

export async function addToCart(id) {
  pushHistory();
  const product = await getProductById(id);
  const existing = app.store.cart.find((item) => item.product.id == id);
  if (existing) {
    app.store.cart = app.store.cart.map((p) =>
      p.product.id == id ? { ...p, quantity: p.quantity + 1 } : p,
    );
  } else {
    app.store.cart = [...app.store.cart, { product, quantity: 1 }];
  }
}

export function removeFromCart(id) {
  pushHistory();
  app.store.cart = app.store.cart.filter((item) => item.product.id != id);
}

export function clearCart() {
  pushHistory();
  app.store.cart = [];
}
