# Aplicaciones Web I - Ejercicio Observer

1. Using our last example create a horizontal card 
  - Change the styles of the cards so they are styled in a horizontal way
2. When scrolling to the bottom should be loaded new entries without clicking a button
3. Simulate an infinite scrolling 

Use the db file and the mockDB for generating fake data. for example:

```js
const db = initMockDB({
  title: "Web app I",
  body: "Intersection Observer"
});

// to get the next data
const data = await db.next();
```

## IA

createDocumentFragment
QUE ES ESTO

es una API DOM que crea un nodo especial, un DocumentFragment, que actúa como un “contenedor invisible” al que puedes añadir otros nodos (elementos, textos, etc.) sin que formen parte todavía del árbol principal del documento.

¿Por qué usarlo?
Cuando vas a insertar muchos elementos en la página, por ejemplo en un bucle, cada appendChild sobre un elemento que ya está en el DOM provoca un re‑render (reflow) y repaint, lo que puede ser costoso. Si en lugar de eso:

creas un fragmento,
añades todos los nuevos nodos al fragmento,
y finalmente insertas una sola vez el fragmento en el DOM,
… sólo se produce una única operación de inserción en el árbol real, con un solo re‑render. Es una técnica de “batching” muy común para optimizar performance.

Comportamiento clave
El fragmento no está en el documento, por lo que no ocupa espacio visible.
Si haces parent.appendChild(fragment) el fragmento se vacía y sus hijos se insertan en parent.
Es útil cuando construyes estructuras complejas en memoria antes de mostrarlas.

const fragment = document.createDocumentFragment();
data.forEach((item) => {
  const card = createCardElement(item.title, item.body);
  fragment.appendChild(card);
});
list.appendChild(fragment);

EL CREATE DOCUMENT FRAGMENT CREA UN TEMPLATE EM EL DOM?

No, un DocumentFragment no es un <template> y, mientras esté en memoria, no “vive” en el árbol del documento.

Piensa en él como una caja vacía donde puedes apilar nodos antes de meterlos todos juntos en el DOM:

const frag = document.createDocumentFragment();
frag.appendChild(div1);
frag.appendChild(div2);
// todavía ninguno de esos <div> está en el documento

parentElement.appendChild(frag);
// ahora los hijos del fragmento se insertan en parentElement
// y el fragmento queda vacío otra vez

Algunas propiedades clave:

No tiene padre: frag.parentNode es null.
No es renderizado: no ocupa espacio ni se pinta en la página.
No es un template: a diferencia de <template> que es un elemento HTML con contenido “predefinido”, el fragmento es sólo un contenedor de nodos.
Cuando lo insertas con appendChild, se transfieren sus hijos al DOM real (el propio fragmento desaparece).
Se usa para agrupar muchas mutaciones y pegarlas de una sola vez, evitando re‑reflows en cada inserción. En tu código es exactamente eso: creas un fragmento, rellenas con las tarjetas generadas y sólo al final haces list.appendChild(fragment) para añadirlas todas de una vez al documento.

QUE PASARIA SI NO LO PONGO CMO DOCUEMNT FRAGMENT?

Si en lugar de “acumular” los nodos en un fragmento vas pegando uno por uno directamente al contenedor, el navegador tiene que:

insertar el nuevo elemento en el árbol DOM,
calcular estilos/recalcular layout (reflow) para ese cambio,
repintar la parte afectada de la pantalla.
Y lo hace cada vez que llamas list.appendChild(card) dentro del bucle.

Con unos pocos elementos pasa desapercibido, pero en un scroll infinito o cuando generas decenas/centenares de items esa repetición de reflows y repaints degrada el rendimiento: el scrolling se vuelve “salta‑salta”, el CPU se dispara y la página parece lenta.

Al usar un DocumentFragment haces la versión “optimizada”:

const frag = document.createDocumentFragment();
for (const item of data) {
  const card = createCardElement(...);
  frag.appendChild(card);          // todavía no está en el DOM real
}
list.appendChild(frag);            // aquí sí se toca el DOM una sola vez

En el momento en que pegas el fragmento, todos los nodos hijos se mueven al contenedor en un solo paso y sólo hay un reflow/repaint.

Si no lo pones, el código seguirá funcionando – no lanza error – pero será menos eficiente y, dependiendo de cuántos elementos añadas, notarás ralentización. Por eso se recomienda el fragmento cuando “batch-eas” muchas mutaciones del DOM.

const frag = document.createDocumentFragment();
for (const item of data) {
  const card = createCardElement(...);
  frag.appendChild(card);          // todavía no está en el DOM real
}
list.appendChild(frag);            // aquí sí se toca el DOM una sola vez

EN QUE PARTE DEL CODIGO INSERTA EL createDocumentFragment()

La llamada a document.createDocumentFragment() no está “flotando” en el programa, forma parte de la rutina que llena la lista y se ejecuta cada vez que pedimos una página nueva. Concretamente está dentro de loadNextPage antes del bucle forEach:

async function loadNextPage() {
  const data = await db.getPage(currentPageIndex);

  // aquí se crea el fragmento vacío
  const fragment = document.createDocumentFragment();

  data.forEach((item) => {
    const card = createCardElement(item.title, item.body);
    fragment.appendChild(card);       // se van montando las tarjetas en el fragmento
  });

  list.appendChild(fragment);         // al final se pega el fragmento al DOM
  currentPageIndex += 1;
}

Es decir:

entrar en loadNextPage(),
const fragment = document.createDocumentFragment(); crea el contenedor en memoria,
se llenan sus hijos dentro del forEach,
y solo después de recorrer todos los resultados se hace list.appendChild(fragment).
No hay ninguna llamada al fragmento fuera de esa función; el fragmento se crea y se consume en el mismo bloque de código cada vez que se carga una página.