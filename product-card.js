class productCard extends HTMLElement {
  constructor() {
    super();

    // Crear shadow DOM
    const shadow = this.attachShadow({ mode: 'open' });

    // Crear estructura HTML
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <style>
        :host {
          --primary-color: #009688;
          --secondary-color: #ff4081;
          --border-radius: 10px;
          --image-radius: 8px;
          --button-radius: 25px;
          --price-color: var(--primary-color);
          --button-bg: var(--primary-color);
          --offert-bg: var(--secondary-color);
        }

        .card {
          font-family: Arial, sans-serif;
          border: 1px solid #ddd;
          border-radius: var(--border-radius);
          padding: 16px;
          width: 300px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          background-color: white;
        }

        img {
          width: 100%;
          border-radius: var(--image-radius);
          height: 300px;
          object-fit: cover;
        }

        .name {
          font-size: 18px;
          font-weight: bold;
          margin-top: 12px;
          color: #333;
        }

        .detail {
          font-size: 14px;
          color: #666;
          margin: 8px 0;
        }

        .price {
          font-size: 25px;
          font-weight: bold;
          color: var(--price-color);
          margin: 8px 0px 0px 0px;
        }

        .rating {
          color: #ffc107;
          font-size: 22px;
        }

        .name-rating {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .image-container {
          position: relative;
        }

        .offerts {
          position: absolute;
          top: 10px;
          left: 10px;
          width: 14%;
          background-color: var(--offert-bg);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 18px;
        }

        .color-options {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
        }

        .color-circle {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 2px rgba(0,0,0,0.5);
          cursor: pointer;
        }

        button {
          background-color: var(--button-bg);
          width: 100%;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: var(--button-radius);
          cursor: pointer;
          font-size: 16px;
          margin-top: 12px;
        }

        .counter {
          display: flex;
          justify-content: space-between;
          align-items: center;
          display: none;
          height: 40px;
        }

        .counter button {
          width: 20%;
          height: 100%;
          padding: 10px;
        }

        .count-display {
          border: 1px solid #ddd;
          border-radius: var(--button-radius);
          font-size: 20px;
          font-weight: bold;
          text-align: center;
          width: 55%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      </style>

      <div class="card">
        <div class="image-container">
          <img id="product-image" src="" alt="Producto referencial">
          <div class="offerts"></div>
          <div class="color-options" id="color-options"></div>
        </div>
        <div class="name-rating">
          <div class="price" id="product-price"></div>
          <div class="rating" id="product-rating"></div>
        </div>
        <div class="name" id="product-name"></div>
        <div class="detail" id="product-detail"></div>
        
        <button id="button-card"></button>

        <div class="counter" id="counter-controls">
          <button id="decrement">−</button>
          <div class="count-display" id="count">1</div>
          <button id="increment">+</button>
        </div>
      </div>
    `;

    shadow.appendChild(wrapper);

    // Eventos del contador
    this.count = 1;
    shadow.getElementById('button-card').addEventListener('click', () => this.showCounter());
    shadow.getElementById('increment').addEventListener('click', () => this.updateCount(1));
    shadow.getElementById('decrement').addEventListener('click', () => this.updateCount(-1));
  }

  connectedCallback() {
    this.updateCard();
  }

  static get observedAttributes() {
    return ['name', 'detail', 'image', 'price', 'rating', 'offerts', 'button-card', 'colors'];
  }

  attributeChangedCallback() {
    this.updateCard();
  }

  updateCard() {
    const shadow = this.shadowRoot;

    shadow.getElementById('product-name').textContent = this.getAttribute('name') || '';
    shadow.getElementById('product-detail').textContent = this.getAttribute('detail') || ' ';
    shadow.getElementById('product-price').textContent = this.getAttribute('price') || '$0.00';
    shadow.getElementById('button-card').textContent = this.getAttribute('button-card') || 'Añadir al carrito';
    shadow.querySelector('.offerts').textContent = this.getAttribute('offerts') || '';




    const image = this.getAttribute('image') || '';
    shadow.getElementById('product-image').src = image;

    const rating = parseInt(this.getAttribute('rating')) || 0;
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    shadow.getElementById('product-rating').textContent = stars;

    const colorsAttr = this.getAttribute('colors');
    const colorOptionsContainer = shadow.getElementById('color-options');
    colorOptionsContainer.innerHTML = ''; 

    if (colorsAttr) {
      try {
        const colors = JSON.parse(colorsAttr);
        colors.forEach((item, index) => {
          const circle = document.createElement('div');
          circle.classList.add('color-circle');
          circle.style.backgroundColor = item.color;
          circle.title = item.name;
          circle.addEventListener('click', () => {
            shadow.getElementById('product-rating').style.color = item.color;
          });
          colorOptionsContainer.appendChild(circle);

          if (index === 0) {
            shadow.getElementById('product-rating').style.color = item.color;
          }
        });
      } catch (e) {
        console.warn('Error parsing colors attribute', e);
      }
    }
  }

  showCounter() {
    const shadow = this.shadowRoot;
    shadow.getElementById('button-card').style.display = 'none';
    shadow.getElementById('counter-controls').style.display = 'flex';
    this.count = 1;
    shadow.getElementById('count').textContent = this.count;
  }

  updateCount(change) {
    const shadow = this.shadowRoot;
    this.count += change;
    if (this.count <= 0) {
      this.count = 0;
      shadow.getElementById('counter-controls').style.display = 'none';
      shadow.getElementById('button-card').style.display = 'block';
    }
    shadow.getElementById('count').textContent = this.count;
  }
}

customElements.define('product-card', productCard);
