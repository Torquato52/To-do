function updateTaskList() {
    const token = localStorage.getItem('token'); 
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/tasks/list", true);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`); 

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            const tasks = JSON.parse(xhr.responseText);
            const taskTable = document.getElementById('taskTable');
            taskTable.innerHTML = ''; 
            tasks.forEach(task => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${task.name}</td>
                    <td>${task.description}</td>
                    <td>${task.status}</td>
                    <td>
                        <span class="delete-btn" onclick="deleteTask(${task.id}, this)">
                            <span class="material-symbols-outlined">delete</span>
                        </span>
                    </td>
                `;
                taskTable.appendChild(row);
            });
        } else {
            console.error('Erro ao buscar tarefas:', xhr.responseText);
        }
    };
    xhr.onerror = function() {
        console.error('Erro na requisição.');
    };
    xhr.send();
}

function deleteTask(id) {
    const token = localStorage.getItem('token');
    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", `/tasks/delete/${id}`, true);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            updateTaskList();
        } else {
            console.error('Erro ao deletar tarefa:', xhr.responseText);
        }
    };
    xhr.onerror = function() {
        console.error('Erro na requisição.');
    };
    xhr.send();
}

function submitTask() {
    const name = document.getElementById('taskName').value.trim();
    const description = document.getElementById('taskDescription').value.trim();

    if (!name || !description) {
        alert('Preencha todos os campos!');
        return;
    }

    const xhr = new XMLHttpRequest();
    const token = localStorage.getItem('token');
    xhr.open("POST", "/tasks/register", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.onload = function() {
        if (xhr.status === 201) {
            console.log('Resposta do servidor:', xhr.responseText);
            updateTaskList();
        } else {
            console.error('Erro ao criar tarefa:', xhr.responseText);
        }
    };

    xhr.onerror = function() {
        console.error('Erro na requisição.');
    };

    const data = JSON.stringify({ name, description });
    xhr.send(data);
}

window.onload = function() {
    updateTaskList(); 
};
