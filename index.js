import Router from "./services/Router.js";

import Store from "./services/Store.js";
import { loadData } from "./services/Menu.js";
import { loadCart, saveCart } from "./services/storage.js";
import { undoCart } from "./services/Order.js";

import { MenuPage } from "./blocks/menuPage/menuPage.js";
import ProductItem from "./blocks/productItem/productItem.js";

globalThis.app = {};

app.store = Store;
app.router = Router;

window.addEventListener("DOMContentLoaded", async () => {
  const stored = await loadCart();
  if (stored && stored.length) {
    app.store.cart = stored;
  }
  loadData();
  app.router.init();

  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "z") {
      undoCart();
      e.preventDefault();
    }
  });
});

window.addEventListener("appcartchange", async (event) => {
  const badge = document.getElementById("badge");
  const qty = app.store.cart.reduce((acc, item) => acc + item.quantity, 0);
  badge.textContent = qty;
  badge.hidden = qty == 0;

  await saveCart(app.store.cart);
});
