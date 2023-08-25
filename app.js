
// VARIABLES
const form = document.querySelector("#form");
const taskArea = document.querySelector(".taskArea");
const titles = document.querySelector(".titles");
const completeTaskButton = document.querySelector(".complete");

let todos = [];

// Async Read Via API on STARTUP
const getAllTodos = async () => {
    try {
      let res = await fetch("http://localhost:3000/todos"),
        json = await res.json();

      if (!res.ok) throw { status: res.status, statusText: res.statusText };
 
      // Parse Json into existing array to re-use logic
      todos = json;

      // Reload to ensure newly created item is shown - Triggers getAllTodos
      addToHTML(todos);

    } catch (err) {
      let message = err.statusText || "Error on Initial Read";
      }
  }


// FUNCTIONS
function events() {
    document.addEventListener("DOMContentLoaded", getAllTodos);
    form.addEventListener("submit", createTask);
    taskArea.addEventListener("click", eliminateTask);
    taskArea.addEventListener("click", completeTask);
    taskArea.addEventListener("click", editTask);
    titles.addEventListener("click", orderBy);
 
}

events();


// CREATE NEW TASK
async function createTask(e) {
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
        status: true
    };

    //Insert in JSON the stringified version of the todo
    const jsonTodoString = JSON.stringify(objTarea);
    console.log(jsonTodoString);

    // async API Call
    //Create - POST
    try {
        let options = {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: jsonTodoString
        },
          res = await fetch("http://localhost:3000/todos", options),
          json = await res.json();

        if (!res.ok) throw { status: res.status, statusText: res.statusText };

        location.reload();
      } catch (err) {
        let message = err.statusText || "Ocurrió un error";
      }
  

}

//DELETE TASK
async function eliminateTask(e) {
    if (e.target.classList.contains("delete")) {  
        // Get ID to delete
        const taskID = Number(e.target.getAttribute("data-id"));
        
        //DELETE - DEL API CALL
        try {
            let options = {
            method: "DELETE",
            headers: {
                "Content-type": "application/json"
                 } 
            }

            res = await fetch(`http://localhost:3000/todos/${taskID}`, options),
            json = await res.json();

            if (!res.ok) throw { status: res.status, statusText: res.statusText };

            location.reload();
        } catch (err) {
            let message = err.statusText || "Ocurrió un error";
        }
    }

}

//MARK TASK AS COMPLETE
async function completeTask(e) {
    if (e.target.classList.contains("complete")) {
        // Get ID to edit status
        const taskID = Number(e.target.getAttribute("data-id"));
        const parentNode = (e.target.parentNode.parentElement);
        
        const title = parentNode.querySelector(".title").innerHTML.trim();
        const description = parentNode.querySelector(".description").innerHTML.trim();
        const expiryDate = parentNode.querySelector(".expiryDate").innerHTML.trim();
        const status = e.target.getAttribute("status").trim() === 'true';  
        
        // CHANGE STATUS TO COMPLETE
        const new_status = !(status);
               
        //OBJECT TO UPDATE with full values - ID IN API URL
        const objTarea = { 
            title: title,
            description: description,
            expiryDate: expiryDate,
            status: new_status
        };

       
        //PUT - EDIT STATUS API CALL
        try {
            let options = {
              method: "PUT",
              headers: {
                "Content-type": "application/json"
              },
              body: JSON.stringify(objTarea)
            },
              res = await fetch(`http://localhost:3000/todos/${taskID}`, options),
              json = await res.json();

            if (!res.ok) throw { status: res.status, statusText: res.statusText };

            location.reload();

          } catch (err) {
            let message = err.statusText || "Ocurrió un error";
          }
    }
}

//EDIT TASK

function editTask(e) {
    if (e.target.classList.contains("edit")) {
        // Get ID to edit status
        const parentNode = (e.target.parentNode.parentElement);

        parentNode.querySelector(".edit").innerHTML = "Save";
        parentNode.querySelector(".edit").classList = "save";
        parentNode.querySelector(".save").style.backgroundColor = "yellow"; 

      
        // Make fields editable once button is pressed and provide styiling
        parentNode.querySelector(".title").contentEditable = 'true'; 
        parentNode.querySelector(".description").contentEditable = 'true'; 
        parentNode.querySelector(".expiryDate").contentEditable = 'true';

        parentNode.querySelector(".title").style.backgroundColor = "white";
        parentNode.querySelector(".description").style.backgroundColor = "white";
        parentNode.querySelector(".expiryDate").style.backgroundColor = "white";

        
        // Add EventListener for new Save Button to trigger Save Edited Task
        taskArea.addEventListener("click", saveEdit);

 
    }
}

// SAVE EDITED TASK
async function saveEdit(e) {
    if (e.target.classList.contains("save")) {
        // Get ID to edit status
        const taskID = Number(e.target.getAttribute("data-id"));
        const parentNode = (e.target.parentNode);

        // NEW VALUES
        const title = parentNode.querySelector(".title").innerHTML.trim();
        const description = parentNode.querySelector(".description").innerHTML.trim();
        const expiryDate = parentNode.querySelector(".expiryDate").innerHTML.trim();
        const status = e.target.getAttribute("status").trim() === 'true';  
             
        //OBJECT TO UPDATE with full values - ID IN API URL
        const objTarea = { 
            title: title,
            description: description,
            expiryDate: expiryDate,
            status: status
        };


        //PUT - EDIT STATUS API CALL
        try {
            let options = {
              method: "PUT",
              headers: {
                "Content-type": "application/json"
              },
              body: JSON.stringify(objTarea)
            },
              res = await fetch(`http://localhost:3000/todos/${taskID}`, options),
              json = await res.json();

            if (!res.ok) throw { status: res.status, statusText: res.statusText };

            location.reload();

          } catch (err) {
            let message = err.statusText || "Ocurrió un error";
          }
     }
}

//ORDERBY
function orderBy(e){
    todos.sort((a,b)=> (new Date(a.expiryDate) - new Date(b.expiryDate)));
    addToHTML()
    todos.sort((a,b) => (a.id - b.id));    

}


// HELPER FUNCTIONS

// DISPLAY TASKS IN HTML
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
                `<span button data-id="${item.id}" status="${item.status}" class='complete'>Pending</span>`
            ) : (
                `<button data-id="${item.id}" status="${item.status}" class="complete">✔</button>`
             )}</p>
            
            <p class="title"> ${item.title}</p>
            <p class="description"> ${item.description} </p>
            <p class="expiryDate"> ${item.expiryDate}</p>
            
            <button data-id="${item.id}" status="${item.status}" class="edit">edit</button> 
            <button data-id="${item.id}" class="delete">x</button>
        `;
        taskArea.appendChild(itemTodo)
    })

}

// VIEW SINGLE TASK
async function getTask(taskID) {
     try {
        let res = await fetch(`http://localhost:3000/todos/${taskID}`),
          json = await res.json();
          console.log(json);
        if (!res.ok) throw { status: res.status, statusText: res.statusText };
        
      } catch (err) {
        let message = err.statusText || "Error on Initial Read";
        }
}

