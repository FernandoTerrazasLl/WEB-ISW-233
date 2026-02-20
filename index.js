const container = document.getElementById("container");
const html = ``;

/**
 * @param {string} title
 * @param {string} body
 *
 * @return {HTMLElement
 */

function createCardComponent(title, body) {
    /*
    const container = document.createElement("article")
    container.classList.add("card")

    const card_title = document.createElement("h3")
    card_title.classList.add("card__title")
    card_title.textContent = title
    container.appendChild(card_title)

    const card_body = document.createElement("div")
    card_body.classList.add("card__body")
    container.appendChild(card_body)

    const card_body_image = document.createElement("div")
    card_body_image.classList.add("card__body__image")
    card_body.appendChild(card_body_image)

    const section = document.createElement("section")
    section.classList.add("card__body__content")
    section.textContent = body
    card_body.appendChild(section)
    */
    const template=document.getElementById("card-template");
    const element=template.content.cloneNode(true).firstElementChild;

    const title_element=element.querySelector(".card__title");
    const body_element=element.querySelector(".card__body__content");

    title_element.textContent=title;
    body_element.textContent=body;

    return element
}

const component = createCardComponent(
    "Frontend System Design: Fundamentals",
    "This is a random body text",
);

container.appendChild(component);