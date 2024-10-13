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

function registerTask(name, description, idUser) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/tasks/register", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function() {
        if (xhr.status === 201) {
            alert('Tarefa criada com sucesso.');
            updateTaskList();
        } else {
            console.error('Erro ao criar tarefa:', xhr.responseText);
            alert('Erro ao criar tarefa.');
        }
    };

    xhr.onerror = function() {
        console.error('Erro na requisição.');
    };

    const data = JSON.stringify({ name, description });
    xhr.send(data);
}

function deleteTask(id) {
    const token = localStorage.getItem('token');
    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", `/tasks/delete/${id}`, true);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log('Tarefa deletada com sucesso.');
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
    console.log('Enviando tarefa:');
    console.log('Nome:', name);
    console.log('Descrição:', description);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/tasks/register", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function() {
        if (xhr.status === 201) {
            console.log('Resposta do servidor:', xhr.responseText);
            alert('Tarefa criada com sucesso.');
            updateTaskList();
        } else {
            console.error('Erro ao criar tarefa:', xhr.responseText);
            alert('Erro ao criar tarefa.');
        }
    };

    xhr.onerror = function() {
        console.error('Erro na requisição.');
    };

    const data = JSON.stringify({ name, description });
    console.log('Dados enviados para o servidor:', data); 
    xhr.send(data);
}

window.onload = function() {
    updateTaskList(); 
};
