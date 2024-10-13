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
                    <td>
                        <span class="check-btn" onclick="completedTask(${task.id}, this)">
                        <span class="material-symbols-outlined">check</span>
                        </span>
                    </td>
                    <td>
                        <span class="edit-btn" onclick="editTask(${task.id}, '${task.name}', '${task.description}')">
                        <span class="material-symbols-outlined">edit</span>
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

function completedTask(id) {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", `/tasks/updateStatus/${id}`, true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));

    xhr.onload = function() {
        if (xhr.status === 200) {
            updateTaskList();
        } else {
            console.error('Erro ao atualizar o status da tarefa:', xhr.responseText);
        }
    };
    xhr.onerror = function() {
        console.error('Erro na requisição.');
    };
    xhr.send();
}

function editTask(id, name, description, status) {
    document.getElementById('editTaskName').value = name;
    document.getElementById('editTaskDescription').value = description;
    const statusRadios = document.getElementsByName('status');
    statusRadios.forEach(radio => {
        radio.checked = (radio.value === status);
    });
    document.getElementById('editModal').style.display = 'block';
    document.getElementById('saveEditButton').onclick = function() {
        updateTask(id);
    };
}

function updateTask(id) {
    const name = document.getElementById('editTaskName').value.trim();
    const description = document.getElementById('editTaskDescription').value.trim();
    const status = document.querySelector('input[name="status"]:checked').value;
    if (!name || !description) {
        alert('Preencha todos os campos!');
        return;
    }
    const xhr = new XMLHttpRequest();
    const token = localStorage.getItem('token');
    xhr.open("PUT", `/tasks/update/${id}`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log('Tarefa atualizada com sucesso:', xhr.responseText);
            updateTaskList();
            closeEditForm();
        } else {
            console.error('Erro ao atualizar a tarefa:', xhr.responseText);
        }
    };

    xhr.onerror = function() {
        console.error('Erro na requisição.');
    };

    const data = JSON.stringify({ name, description, status });
    xhr.send(data);
}

document.getElementById('addTaskButton').addEventListener('click', function() {
    document.getElementById('myModal').style.display = 'block';
});

function closeTaskForm() {
    document.getElementById('myModal').style.display = 'none';
}

function closeEditForm() {
    document.getElementById('editModal').style.display = 'none';
}

document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
});

window.onload = function() {
    updateTaskList(); 
};
