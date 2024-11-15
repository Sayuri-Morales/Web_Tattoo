const cuidadosList = document.getElementById('cuidados-list');

// Función para cargar los cuidados de tatuaje
async function cargarCuidados() {
    try {
        const response = await fetch('/api/cuidados');
        const cuidados = await response.json();

        // Limpiar el contenedor de cuidados antes de agregar nuevos
        cuidadosList.innerHTML = '';

        // Mostrar los cuidados
        cuidados.forEach(cuidado => {
            const div = document.createElement('div');
            div.classList.add('cuidado');
            div.innerHTML = `
                <h3>${cuidado.titulo}</h3>
                <p>${cuidado.descripcion}</p>
                <img src="${cuidado.imagen}" alt="Imagen de ${cuidado.titulo}" style="width: 100px; height: 100px;">
                <button class="like-btn" data-id="${cuidado.id}">👍 Me gusta (<span id="like-count-${cuidado.id}">0</span>)</button>
            `;
            cuidadosList.appendChild(div);
        });

        // Agregar eventos de click a los botones de Like
        document.querySelectorAll('.like-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const cuidadoId = event.target.getAttribute('data-id');
                await darLike(cuidadoId);
            });
        });
    } catch (error) {
        console.error('Error al cargar los cuidados:', error);
    }
}

// Función para dar like
async function darLike(cuidadoId) {
    try {
        const response = await fetch(`/api/cuidados/like/${cuidadoId}`, { method: 'POST' });
        if (!response.ok) throw new Error('Error al registrar el like');

        const { likes } = await response.json();

        // Actualizar el contador de likes en la UI
        const likeCountElement = document.getElementById(`like-count-${cuidadoId}`);
        likeCountElement.textContent = likes;
    } catch (error) {
        console.error('Error al dar like:', error);
    }
}

// Cargar los cuidados al cargar la página
document.addEventListener('DOMContentLoaded', cargarCuidados);