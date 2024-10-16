document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('FormLogin').addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('user').value;
        const password = document.getElementById('password').value;
        
        fetch('/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user: username, password: password })
        })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                return response.json().then(err => {
                    throw new Error(err.mensagem);
                });
            }
        })
        .then(data => {
            localStorage.setItem('token', data.token);
            window.location.href = '/index.html';
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Falha no login. Verifique suas credenciais.');
        });
    });
});
