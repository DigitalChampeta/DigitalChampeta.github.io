
const form = document.querySelector("#form");
const taskArea = document.querySelector(".taskArea")
const completeTask = document.querySelector("#complete");
const editButton = document.querySelectorAll("edit");
let todos = [];

// importing the fs module
const fs = require("fs");

function events() {
    form.addEventListener("submit", createTask);
    taskArea.addEventListener("click", eliminateTask);
    taskArea.addEventListener("click", taskComplete);
    completeTask.addEventListener("click", () => { 
        myButton.classList.toggle("transformed-button");
    });
    editButton.addEventListener("click", taskText);
}

events();


function createTask(e) {
    e.preventDefault();
    //validar los campos
    const title = document.querySelector("#title").value;
    const description = document.querySelector("#description").value;
    const date = document.querySelector("#date").value;

    console.log(title);
    if (title.trim().length === 0) {
        console.log('vacio');
        return
    }

    //creamos el objeto tarea
    const objTarea = {
        id: Date.now(),
        title: title,
        description: description,
        expiryDate: date,
        status: false
    };
    //agregamos al array sin mutar dicho arreglo
    todos = [...todos, objTarea];
    form.reset();

    //agregamos al HTML
    addToHTML();
    const jsonTodoString = JSON.stringify(Object.assign({}, todos));
    console.log(jsonTodoString);

}

function addToHTML() {
    taskArea.innerHTML = "";


    if (todos.length < 1) {
        const message = document.createElement("h5");
        message.textContent = " ~~NO TASKS ~~"
        return
    }

    todos.forEach((item) => {
        const itemTodo = document.createElement("div");
        itemTodo.classList.add("todo");
        itemTodo.innerHTML = `
             <p>${item.status ? (
                `<span class='complete'>Complete</span>`
            ) : (
                `<button data-id="${item.id}" class="complete">✔</button>`
             )}</p>
            
            <p> ${item.title}</p>
            <p> ${item.description} </p>
            <p> ${item.expiryDate}</p>
            
            <button data-id="${item.id}" class="edit">edit</button> 
            <button data-id="${item.id}" class="delete">x</button>
        `;
        taskArea.appendChild(itemTodo)
    })

}

function eliminateTask(e) {
    if (e.target.classList.contains("delete")) {
        const taskID = Number(e.target.getAttribute("data-id"));
        //eliminamos con el array method filter
        const newTasks = todos.filter((item) => item.id !== taskID);
        todos = newTasks;
        addToHTML();
    }
}

//completar tarea
function taskComplete(e) {
    if (e.target.classList.contains("complete")) {
        const tasksID = Number(e.target.getAttribute("data-id"));
        const newsTasks = todos.map(item => {
            if (item.id === tasksID) {
                item.status = !item.status;
                return item;
            } else {
                return item;
            }
        })
        todos = newsTasks;
        addToHTML();
    }
}

function writeToJson(){
    // writing the JSON string content to a file
    fs.writeFile("data.json", data, (error) => {
    // throwing the error
    // in case of a writing problem
    if (error) {
      // logging the error
      console.error(error);
  
      throw error;
    }
  
    console.log("data.json written correctly");
  });
}

/*function taskText (e){
        
        if (newText !== null && newText !== '') {
            const newText = prompt('Edita la tarea:', taskText),
             todos,children:[index],textContent = newText
             }
            }
    

const editButtons = document.querySelectorAll('.edit-button');
const taskList = document.getElementById('task-list');

editButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        const taskText = taskList.children[index].textContent.trim();
        const newText = prompt('Edita la tarea:', taskText);
        
        if (newText !== null && newText !== '') {
            taskList.children[index].textContent = newText;
        }
    });
});*/











