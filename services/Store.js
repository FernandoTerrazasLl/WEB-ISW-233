const Store = {
  menu: null,
  cart: [],
};

const proxiedStore = new Proxy(Store, {
  set(target, property, value) {
    target[property] = value;
    // avisamos sólo cuando cambian estas propiedades clave
    if (property === "menu" || property === "cart") {
      window.dispatchEvent(new Event(`app${property}change`));
    }
    return true;
  },
  get(target, property) {
    return target[property];
  }
});

export default proxiedStore;
