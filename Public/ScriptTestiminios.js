// Obtener contenedor de testimonios y formulario de nuevo testimonio
const testimoniosContainer = document.getElementById('testimonios-list');
const newTestimonioForm = document.getElementById('new-testimonio-form');

// Suponiendo que estás renderizando los testimonios en el contenedor 'testimonios-list'
const testimoniosList = document.getElementById('testimonios-list');

// Función para cargar los testimonios en el frontend
async function cargarTestimonios() {
    try {
        const response = await fetch('/api/testimonios');
        const testimonios = await response.json();

        // Limpiar la lista de testimonios antes de agregar nuevos
        testimoniosList.innerHTML = '';

        // Mostrar los testimonios
        testimonios.forEach(testimonio => {
            const div = document.createElement('div');
            div.classList.add('testimonio');
            div.innerHTML = `
                <h3>${testimonio.nombre_cliente}</h3>
                <p>${testimonio.contenido}</p>
                <img src="${testimonio.foto_cliente}" alt="Foto de ${testimonio.nombre_cliente}" style="width: 100px; height: 100px;">
            `;
            testimoniosList.appendChild(div);
        });
    } catch (error) {
        console.error('Error al cargar los testimonios:', error);
    }
}

// Enviar un nuevo testimonio
newTestimonioForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Obtener los datos del formulario
    const nombreCliente = document.getElementById('nombre-cliente').value.trim();
    const contenidoTestimonio = document.getElementById('contenido-testimonio').value.trim();

    // Validar que todos los campos estén completos
    if (!nombreCliente || !contenidoTestimonio) {
        alert('Por favor, ingresa un nombre y un testimonio válidos.');
        return;
    }

    try {
        const response = await fetch('/api/agregar-testimonio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre_cliente: nombreCliente,
                contenido: contenidoTestimonio
            }),
        });

        const data = await response.json();

        if (data.success) {
            alert('Testimonio enviado con éxito');
            newTestimonioForm.reset();  // Limpiar el formulario
            cargarTestimonios();  // Recargar testimonios
        } else {
            alert('Hubo un error al enviar el testimonio');
        }
    } catch (error) {
        console.error('Error al enviar el testimonio:', error);
    }
});

// Llamar la función para cargar los testimonios cuando la página esté lista
document.addEventListener('DOMContentLoaded', cargarTestimonios);

// Llamar a la función para cargar los testimonios al cargar la página
document.addEventListener('DOMContentLoaded', cargarTestimonios);