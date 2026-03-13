import { loadData } from "../../services/Menu.js";

export class RestaurantsPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <h1>Restaurants</h1>
      <div id="list" class="restaurants-grid"></div>
      <style>
        .restaurants-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr); /* tres por fila */
          gap: 1.5rem;
        }
        .restaurant-box {
          border: 1px solid #333;
          padding: 2rem;
          text-align: center;
          background: #f5f5f5;
          font-size: 1.25rem;
          font-weight: bold;
        }
      </style>
    `;
    this.render();
  }

  async render() {
    const list = this.querySelector("#list");
    // mostrar seis cajas numeradas
    for (let i = 1; i <= 6; i++) {
      const box = document.createElement("div");
      box.className = "restaurant-box";
      box.textContent = `RESTAURANT ${i}`;
      list.appendChild(box);
    }
  }
}

customElements.define("restaurants-page", RestaurantsPage);
