document.addEventListener("DOMContentLoaded", function () {
    // Cargar los artistas desde la API
    fetch('/api/artistas_nuevos')
        .then(response => response.json())
        .then(artistas => {
            cargarArtistas(artistas);
            cargarSelectArtistas(artistas);
        })
        .catch(error => console.error('Error al cargar artistas:', error));

    // Función para mostrar los artistas
    function cargarArtistas(artistas) {
        const artistasList = document.getElementById('artistas-list');
        artistasList.innerHTML = ''; // Limpiar lista existente
        artistas.forEach(artista => {
            const artistaCard = document.createElement('div');
            artistaCard.classList.add('artista-card');
            artistaCard.innerHTML = `
                <img src="${artista.foto_perfil || 'default.jpg'}" alt="${artista.nombre}">
                <h3>${artista.nombre}</h3>
                <p>${artista.biografia}</p>
                <p><strong>Especialidad:</strong> ${artista.especialidad || 'No especificada'}</p>
            `;
            artistasList.appendChild(artistaCard);
        });
    }

    // Función para cargar el select con los artistas
    function cargarSelectArtistas(artistas) {
        const selectArtista = document.getElementById('artista');
        artistas.forEach(artista => {
            const option = document.createElement('option');
            option.value = artista.artista_id;
            option.textContent = artista.nombre;
            selectArtista.appendChild(option);
        });
    }

    // Manejar el envío del formulario de calificación
    document.getElementById('calificar-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const artistaId = document.getElementById('artista').value;
        const calificacion = document.getElementById('calificacion').value;

        // Enviar la calificación al servidor
        fetch('/api/calificar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                artista_id: artistaId,
                calificacion: calificacion,
                fecha: new Date().toISOString().split('T')[0] // Fecha en formato YYYY-MM-DD
            })
        })
        .then(response => response.json())
        .then(data => {
            alert('¡Gracias por calificar!');
        })
        .catch(error => {
            alert('Error al enviar la calificación');
            console.error('Error:', error);
        });
    });
});
