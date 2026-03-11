import { initMockDB } from "./services/db.js";

document.addEventListener("DOMContentLoaded", () => {
  const [template, list, observerElement] = document.querySelectorAll(
    "#card_template, #list, #bottom-observer",
  );

  const db = initMockDB({
    title: "Fundamentals of Frontend System Design",
    body: "Learning to use Intersection Observer",
  });


  function createCardElement(title, body) {
    // use the create card element from prev examples
    const card = template.content.cloneNode(true);
    card.querySelector(".card__title").textContent = title;
    card.querySelector(".card__body__content").textContent = body;
    return card;
  }
  
  
  /**
   * Exercise - Intersection Observer
   * 1. Create Intersection observer instance and provide a callback to it
   * 2. In the callback use mock db - next function to get the next chunk of data
   * 3. Create a fragment where you chunk all your DOM Mutations
   * 4. Update fragment
   * 5. Append fragment to "list" container
   */
  
  let currentPageIndex = 0;

  async function loadNextPage() {
    const data = await db.getPage(currentPageIndex);

    const fragment = document.createDocumentFragment();
    data.forEach((item) => {
      const card = createCardElement(item.title, item.body);
      fragment.appendChild(card);
    });

    list.appendChild(fragment);
    currentPageIndex += 1;
  }
  
  //AQUI VA EL INTERSECTION OBSERVER
  const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
  };

  const intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadNextPage();
      }
    });
  }, observerOptions);

  intersectionObserver.observe(document.getElementById('bottom-observer'));
});
