import { TodoItem, TodoList } from "./todoList.js";

export class Command {
  name;
  args;
  constructor(name, args) {
    this.name = name;
    this.args = args;
  }
}

export const Commands = {
  ADD: "add",
  DELETE: "delete",
};

export const CommandExecutor = {
  execute(command) {
    const todoList = TodoList.getInstance();

    switch (command.name) {
      case Commands.ADD:
        const todoInput = globalThis.DOM.todoInput;
        const todoText = todoInput.value.trim();

        //SE AGREGO ESTO
        if(todoText==""){
          return;
        }
        if(todoList.find(todoText)){
          return;
        }
        todoList.add(new TodoItem(todoText));
        const unorderedList = document.getElementById("todo-list");
        const deleteBtn = document.createElement("button");
        const span = document.createElement("span");

        span.style.display = "flex";
        span.style.flexDirection = "row";
        span.style.justifyContent = "space-between";
        
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.dataset.id = todoText;

        const listItem = document.createElement("li");
        listItem.textContent = todoText;

        span.appendChild(listItem);
        span.appendChild(deleteBtn);
        unorderedList.appendChild(span);
        DOM.todoInput.value = "";
        //
        break;

      case Commands.DELETE:
        //lo agregue
        const borrar = command.args.target.parentElement;
        borrar.remove();
        //
        break;
    }
  },
};
