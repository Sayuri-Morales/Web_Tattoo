// script.js
// ---------------------------------------------------------------------------------
// Mostrar Datos Artistas Pagina Principal
fetch('/api/artistas')
    .then(response => response.json())
    .then(artistas => {
        const container = document.getElementById('artistas-container');
        artistas.forEach(artista => {
            const div = document.createElement('div');
            div.classList.add('artista');  // Agregar una clase para estilos (opcional)
            div.innerHTML = `
                <img src="${artista.foto_perfil}" alt="Foto de ${artista.nombre}" width="150" height="150">
                <h3>${artista.nombre}</h3>
                <p>${artista.biografia}</p>
                <!-- El botón ahora pasa la cédula del artista como parámetro -->
                <button onclick="location.href='/artista_detalles.html?cedula=${artista.cedula}'">Ver más detalles</button>
            `;
            container.appendChild(div);
        });
    })
    .catch(error => {
        console.error('Error al cargar los artistas:', error);
    });
// ----------------------------------------------------------------------------------
// Mostrar Detalles de los Artistas
const urlParams = new URLSearchParams(window.location.search);
const cedula = urlParams.get('cedula');

// Obtener los tatuajes del artista
fetch(`/api/tatuajes/${cedula}`)
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('tatuajes-container');
        const titulo = document.getElementById('titulo-artista');

        // Verificar si hay un error (por ejemplo, artista no encontrado)
        if (data.error) {
            container.innerHTML = `<p>${data.error}</p>`;
            return;
        }

        // Mostrar el nombre del artista en el título
        titulo.textContent = `Detalles de los Tatuajes de ${data.nombre_artista}`;

        const { tatuajes } = data;

        // Verificar si hay tatuajes
        if (tatuajes.length === 0) {
            container.innerHTML = '<p>No se encontraron tatuajes para este artista.</p>';
            return;
        }

        // Mostrar tatuajes
        tatuajes.forEach(tatuaje => {
            const div = document.createElement('div');
            div.classList.add('tatuaje');
            div.innerHTML = `
                <h3>Tatuaje ID: ${tatuaje.tatuaje_id}</h3>
                <p><strong>Descripción:</strong> ${tatuaje.descripcion}</p>
                <p><strong>Precio:</strong> ₡${tatuaje.precio}</p>
                <p><strong>Categoría:</strong> ${tatuaje.categoria_id}</p>
                <p><strong>Fecha de Creación:</strong> ${new Date(tatuaje.fecha_creacion).toLocaleDateString()}</p>
                <img src="${tatuaje.imagen_tatuaje}" alt="Imagen de tatuaje" style="max-width: 100%; height: auto;"/>
            `;
            container.appendChild(div);
        });
    })
    .catch(error => {
        console.error('Error al cargar los tatuajes:', error);
    });
// ----------------------------------------------------------------------------------