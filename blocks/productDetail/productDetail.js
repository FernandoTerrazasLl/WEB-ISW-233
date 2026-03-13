import { getProductById } from "../../services/Menu.js";
import { addToCart } from "../../services/Order.js";

export class ProductDetail extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const id = this.dataset.productId || this.getAttribute("data-id");
    if (id) {
      this.render(id);
    }
  }

  async render(id) {
    const product = await getProductById(id);
    if (!product) {
      this.textContent = "Product not found";
      return;
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
    this.querySelector("#add").addEventListener("click", () => {
      addToCart(product.id);
    });
  }
}

customElements.define("product-detail", ProductDetail);
