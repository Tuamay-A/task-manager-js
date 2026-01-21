document.addEventListener("DOMContentLoaded", ()=>{
    const inputForm = document.getElementById("input-form");
    const formField = document.querySelector(".form-field"); // Select the form
    const output = document.getElementById("list");


    const saveTaskToLocalStorage = () => {
        const tasks = Array.from(output.querySelectorAll("li")).map(li => ({
        text: li.querySelector('span').textContent,
        completed: li.querySelector('.checkbox').checked
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    const loadTasksFromLocalStorage = () => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(({ text, completed }) => addTask(text, completed, false)); // Pass false to prevent immediate re-saving
    }
    

    const addTask = (text, completed = false, shouldSave = true)=>{

    const li = document.createElement("li");
    li.innerHTML = `
    <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}>
    <span>${text}</span>
    <div class="list-buttons">
        <button class="edit"><i class="fa-solid fa-pen"></i></button>
        <button class="delete"><i class="fa-solid fa-trash"></i></button>
    </div>
    `;

    const checkbox = li.querySelector(".checkbox");
    const editBtn = li.querySelector(".edit");

    if(completed){
        li.classList.add("completed");
        editBtn.disabled = true;
        editBtn.style.opacity = '0.5';
        editBtn.style.pointerEvents = "none";
    }

    checkbox.addEventListener("change", ()=>{
        const isChecked = checkbox.checked;
        li.classList.toggle("completed", isChecked);
        editBtn.disabled = isChecked;
        editBtn.style.opacity = isChecked ? '0.5' : '1';
        editBtn.style.pointerEvents = isChecked ? "none" :"auto";
        saveTaskToLocalStorage();
    });

    editBtn.addEventListener("click", ()=>{
        if(!checkbox.checked){
            inputForm.value  = li.querySelector("span").textContent;
            li.remove();
            saveTaskToLocalStorage();
        }
    });

    const deleteBtn = li.querySelector(".delete");
    deleteBtn.addEventListener("click", ()=>{
    li.remove();//to remve the task
    saveTaskToLocalStorage();
    });

    output.appendChild(li);
    if (shouldSave) {
            saveTaskToLocalStorage();
        }
    inputForm.value = "";
}

formField.addEventListener("submit", (e) => {
        e.preventDefault(); // Stop the page from refreshing!
        const inputText = inputForm.value.trim();
        if (!inputText) {
            alert(`Please Enter A Task!!!`);
            return;
        }
        addTask(inputText);
        inputForm.value = ""; // Clear input field
    });
    // Initial load
    loadTasksFromLocalStorage();
});



