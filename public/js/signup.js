document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('FormSignup').addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('user').value;
        const password = document.getElementById('password').value;

        fetch('/user/signup', {
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
            const successMessage = document.getElementById('successMessage');
            successMessage.style.display = 'block';
            successMessage.textContent = 'Cadastro realizado com sucesso!';
            console.log('Login bem-sucedido:', data);
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
        })
        .catch(error => {
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.style.display = 'block';
            errorMessage.textContent = error.message;
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
        });
    });
});
