import { observerMixin } from "./mixins.js";

export class TodoItem {
  constructor(text) {
    this.text = text;
  }
  equals(other) {
    return this.text == other.text;
  }
}

export class TodoList {
  #data = new Set();
  get items() {
    return this.#data;
  }

  static instance = null;
  static {
    this.instance = new TodoList();
  }

  static getInstance() {
    return this.instance;
  }

  constructor() {
    if (TodoList.instance) {
      throw new Error("use get instance");
    }
  }

  add(item) {
    const array = Array.from(this.#data);
    const itemExists = array.filter((t) => t.equals(item)).length > 1;
    if (!itemExists) {
      this.#data.add(item);
      this.notify();
    }
  }

  delete(text_todo) {
    const array = Array.from(this.#data);
    const itemToDelete = array.filter((t) => t.text == text_todo);
    this.#data.delete(itemToDelete[0]);
    this.notify();
  }

  find(text_todo) {
    const array = Array.from(this.#data);
    return array.find((t) => t.text == text_todo);
  }

  replaceList(list) {
    this.#data = list;
    this.notify();
  }
}

Object.assign(TodoList.prototype, observerMixin);
