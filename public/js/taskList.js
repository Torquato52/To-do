function updateTaskList() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/tasks/list", true);

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
                    <td><span class="delete-btn" onclick="deleteTask(${task.id}, this)"><span class="material-symbols-outlined">delete</span></span></td>
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

updateTaskList();
setInterval(updateTaskList, 5000);