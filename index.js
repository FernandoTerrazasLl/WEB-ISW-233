import { createCardElement, getHeading } from "./services/utlis.js";
import { initMockDB } from "./services/db.js";

const SUPPORTED_ELEMENTS = new Set(["/h1", "/h2", "/h3"]);

const db = initMockDB({
  title: "Fundamentals of Frontend System Design",
  body: "Learning to use Intersection Observer",
});
const list = document.getElementById("list");
const observerElement = document.getElementById("bottom-observer");

const observer = new ResizeObserver((entries) => {
  for (let entry of entries) {
    const {
      borderBoxSize: [{ inlineSize, blockSize }],
      target,
    } = entry;
    console.log(inlineSize, blockSize);
    if (inlineSize < 150 && blockSize < 150) {
      target.style.borderRadius = "100%";
      target.style.borderWidth = "4px";
    } else {
      target.style.borderRadius = "unset";
      target.style.borderWidth = "unset";
    }
  }
});
const elements = document.querySelectorAll(".box");
elements.forEach((el) => observer.observe(el));