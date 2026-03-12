import { createCardElement, getHeading } from "./services/utlis.js";
import { initMockDB } from "./services/db.js";

const SUPPORTED_ELEMENTS = new Set(["/h1", "/h2", "/h3"]);

const db = initMockDB({
  title: "Fundamentals of Frontend System Design",
  body: "Learning to use Intersection Observer",
});
const list = document.getElementById("list");
const observerElement = document.getElementById("bottom-observer");

//INTERSECTION OBSERVER
let contadorPagina = 0;

async function cargarDatos() {
  const datos = await db.getPage(contadorPagina);
  datos.forEach(item => {
    const card = createCardElement(item.title, item.body);
    list.appendChild(card);
  });
  contadorPagina++;
}

const config = {
  root: null, //QUE VA A MIRAR, EN CASO DE QUE NO HAYA NADA MIRA EL VIEW PORT
  rootMargin: "0px", //ES COMO UN MARGIN EN WEB, HACE QUE SE ACTIVE EL OBSERVER CUANDO LLEGA A ESTE MARGEN DE ROOT
  threshold: 0.1
};

function handleObserver(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      cargarDatos();
    }
  });
}
const observer = new IntersectionObserver(handleObserver, config);
observer.observe(observerElement);

//MUTATION OBSERVER
const mutation_observer=new MutationObserver((mutations)=>{
  mutations.forEach(mutation => {
    if (mutation.type === "characterData") {
        let target=mutation.target;

        const firstThree = target.textContent.slice(0, 3);
        if (SUPPORTED_ELEMENTS.has(firstThree)) {
          target.replaceWith(getHeading(target));
        }
    }
  });
});

mutation_observer.observe(list, {
  characterData: true,
  subtree: true
});