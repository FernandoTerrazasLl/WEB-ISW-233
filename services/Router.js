import "../blocks/restaurantsPage/restaurantsPage.js";
import "../blocks/productDetail/productDetail.js";
import "../blocks/orderPage/orderPage.js";

const Router = {
  init: () => {
    document.querySelectorAll("a.nav__link").forEach((a) => {
      a.addEventListener("click", (event) => {
        event.preventDefault();
        const href = event.target.getAttribute("href");
        Router.go(href);
      });
    });
    window.addEventListener("popstate", (event) => {
      Router.go(event.state.route, false);
    });
    Router.go(location.pathname);
  },

  go: (route, addToHistory = true) => {
    if (addToHistory) {
      history.pushState({ route }, "", route);
    }

    const routeMap = {
      "/": () => document.createElement("menu-page"),
      "/products": () => document.createElement("menu-page"),
      "/restaurants": () => document.createElement("restaurants-page"),
      "/order": () => document.createElement("order-page"),
    };

    let pageElement = null;
    if (routeMap[route]) {
      pageElement = routeMap[route]();
    } else if (route.startsWith("/products/")) {
      const id = route.split("/").pop();
      const detail = document.createElement("product-detail");
      detail.dataset.productId = id;
      pageElement = detail;
    }

    if (pageElement) {
      document.querySelector("main").replaceChildren(pageElement);
    }
    
    window.scrollTo(0, 0);
  },
};

export default Router;
