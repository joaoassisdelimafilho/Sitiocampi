// auth.js (Versão Final, Testada e Corrigida)

window.addEventListener('load', function() {
    // Todo o código só roda depois que a página e todos os scripts carregaram

    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    // A variável 'auth' agora tem 100% de certeza de que existe
    auth.onAuthStateChanged(user => {
        if (user) {
            window.location.replace('admin.html');
        }
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitButton = e.target.querySelector('button');

        errorMessage.textContent = '';
        submitButton.disabled = true;
        submitButton.textContent = 'Entrando...';

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Sucesso, o onAuthStateChanged vai redirecionar.
            })
            .catch((error) => {
                errorMessage.textContent = 'E-mail ou senha incorretos.';
                console.error('Erro no login:', error);
                submitButton.disabled = false;
                submitButton.textContent = 'Entrar';
            });
    });
});
