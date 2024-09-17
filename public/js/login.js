document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();

    if (!email || !senha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Redireciona para a nova URL após o login bem-sucedido
            window.location.href = data.redirectURL;
        } else {
            alert(data.error);
        }
    })
    .catch(error => {
        console.error('Erro ao enviar o formulário:', error);
        alert('Erro ao enviar o formulário.');
    });
});
