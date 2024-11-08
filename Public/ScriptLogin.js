// Mostrar la pantalla de login
function mostrarLogin() {
    document.getElementById('login').style.display = 'block';
}

// Ocultar la pantalla de login
function ocultarLogin() {
    document.getElementById('login').style.display = 'none';
}

// Enviar los datos de inicio de sesión al servidor
document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Enviar los datos de inicio de sesión al backend
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('¡Bienvenido ' + data.nombre + '!'); 
            // Redirigir al usuario según su rol
            if (data.rol === 'admin') {
                window.location.href = '/Admin.html'; // Enlace de Pagina Aqui
            } else if (data.rol === 'editor') {
                window.location.href = '/Editor.html'; // Enlace de Pagina Aqui
            }
        } else {
            alert(data.message); 
        }
    })
    .catch(error => {
        console.error('Error en el login:', error);
        alert('Hubo un problema al iniciar sesión.');
    });
});