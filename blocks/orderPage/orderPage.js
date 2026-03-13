import { removeFromCart } from "../../services/Order.js";

export class OrderPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.onCartChange = () => this.render();
    window.addEventListener("appcartchange", this.onCartChange);
  }

  disconnectedCallback() {
    window.removeEventListener("appcartchange", this.onCartChange);
  }

  render() {
    const cart = app.store.cart || [];
    let total = 0;

    this.innerHTML = `
      <section class="order-page">
        <h1>Your Order</h1>
        <div id="order-list" class="order-list"></div>
        <div class="order-footer">
          <div class="order-total">
            <span>Total:</span>
            <span id="total-amount">$0.00</span>
          </div>
          <button id="checkout-btn" class="checkout-button" ${cart.length === 0 ? "disabled" : ""}>
            Confirm Order
          </button>
        </div>
      </section>

      <style>
        .order-page {
          max-width: 800px;
          margin: 2rem auto;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .order-list {
          margin-bottom: 2rem;
          border-top: 1px solid #eee;
        }
        .order-item {
          display: flex;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid #eee;
          gap: 1rem;
        }
        .order-item__image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 4px;
        }
        .order-item__details {
          flex: 1;
        }
        .order-item__name {
          font-weight: bold;
          margin: 0;
        }
        .order-item__price {
          color: #666;
          margin: 0.25rem 0;
        }
        .order-item__qty {
          font-size: 0.9rem;
          color: #444;
        }
        .order-item__remove {
          background: #fee2e2;
          color: #dc2626;
          border: none;
          padding: 0.5rem;
          border-radius: 4px;
          cursor: pointer;
        }
        .order-footer {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 1rem;
        }
        .order-total {
          font-size: 1.5rem;
          font-weight: bold;
        }
        .checkout-button {
          background: #2563eb;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
        }
        .checkout-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .empty-msg {
          text-align: center;
          color: #999;
          padding: 2rem 0;
        }
      </style>
    `;

    const list = this.querySelector("#order-list");
    if (cart.length === 0) {
      list.innerHTML = `<p class="empty-msg">Your cart is empty.</p>`;
    } else {
      cart.forEach((item) => {
        const itemEl = document.createElement("div");
        itemEl.className = "order-item";
        
        const priceStr = String(item.product.price).replace("$", "");
        const priceNum = parseFloat(priceStr) || 0;
        
        itemEl.innerHTML = `
          <img src="${item.product.imageUrl}" class="order-item__image" />
          <div class="order-item__details">
            <p class="order-item__name">${item.product.title}</p>
            <p class="order-item__price">${item.product.price}</p>
            <span class="order-item__qty">Quantity: ${item.quantity}</span>
          </div>
          <button class="order-item__remove" data-id="${item.product.id}">Remove</button>
        `;
        itemEl.querySelector(".order-item__remove").addEventListener("click", () => {
          removeFromCart(item.product.id);
        });
        list.appendChild(itemEl);
        total += priceNum * item.quantity;
      });
    }

    this.querySelector("#total-amount").textContent = `$${total.toFixed(2)}`;
    
    this.querySelector("#checkout-btn").addEventListener("click", () => {
        alert("Thank you for your order!");
        app.store.cart = []; 
        app.router.go("/"); 
    });
  }
}

customElements.define("order-page", OrderPage);
