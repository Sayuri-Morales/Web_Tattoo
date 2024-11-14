// Mostrar la pantalla de login
function mostrarLogin() {
    document.getElementById('login').style.display = 'block';
    document.getElementById('verification').style.display = 'none';
}

// Ocultar la pantalla de login
function ocultarLogin() {
    document.getElementById('login').style.display = 'none';
}

// Manejar el envío del formulario de login
document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            ocultarLogin();
            document.getElementById('verification').style.display = 'block';
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error en el login:', error);
        alert('Hubo un problema al iniciar sesión.');
    });
});

// Manejar el envío del código de verificación
document.getElementById('verification-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const code = document.getElementById('code').value;

    fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (data.rol === 'admin') {
                window.location.href = '/Admin.html';
            } else if (data.rol === 'editor') {
                window.location.href = '/Clientes.html';
            }
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error en la verificación:', error);
        alert('Hubo un problema al verificar el código.');
    });
});