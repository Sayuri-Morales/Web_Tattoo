// script.js
// ---------------------------------------------------------------------------------
// Mostrar Datos Artistas Pagina Principal
fetch('/api/artistas')
    .then(response => response.json())
    .then(artistas => {
        const container = document.getElementById('artistas-container');
        artistas.forEach(artista => {
            const div = document.createElement('div');
            div.classList.add('artista');
            div.innerHTML = `
                <img src="${artista.foto_perfil}" alt="Foto de ${artista.nombre}" width="150" height="150">
                <h3>${artista.nombre}</h3>
                <p>${artista.biografia}</p>
                <!-- Pasar ahora el artista_id como parámetro -->
                <button onclick="location.href='/artista_detalles.html?artista_id=${artista.artista_id}'">Ver más detalles</button>
            `;
            container.appendChild(div);
        });
    })
    .catch(error => {
        console.error('Error al cargar los artistas:', error);
    });
// ----------------------------------------------------------------------------------
// Obtener el artista_id de la URL
const urlParams = new URLSearchParams(window.location.search);
const artista_id = urlParams.get('artista_id');

// Obtener los tatuajes del artista
fetch(`/api/tatuajes/${artista_id}`)
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

        // Mostrar tatuajes y sus imágenes
        tatuajes.forEach(tatuaje => {
            const div = document.createElement('div');
            div.classList.add('tatuaje');
            div.innerHTML = `
                <h3>Tatuaje ID: ${tatuaje.tatuaje_id}</h3>
                <p><strong>Descripción:</strong> ${tatuaje.descripcion}</p>
                <p><strong>Precio:</strong> ₡${tatuaje.precio}</p>
                <p><strong>Categoría:</strong> ${tatuaje.categoria_id}</p>
                <p><strong>Fecha de Creación:</strong> ${new Date(tatuaje.fecha_creacion).toLocaleDateString()}</p>
                <div id="galeria-${tatuaje.tatuaje_id}"></div>
            `;
            container.appendChild(div);

            // Obtener las imágenes de cada tatuaje
            fetch(`/api/tatuajes/${tatuaje.tatuaje_id}/imagenes`)
                .then(response => response.json())
                .then(imagenes => {
                    const galeria = document.getElementById(`galeria-${tatuaje.tatuaje_id}`);
                    imagenes.forEach(imagen => {
                        const img = document.createElement('img');
                        img.src = imagen.ruta_foto;
                        img.alt = imagen.descripcion;
                        img.style.maxWidth = '100%';
                        img.style.height = 'auto';
                        galeria.appendChild(img);
                    });
                })
                .catch(error => {
                    console.error(`Error al cargar las imágenes del tatuaje ${tatuaje.tatuaje_id}:`, error);
                });
        });
    })
    .catch(error => {
        console.error('Error al cargar los tatuajes:', error);
    });
// ----------------------------------------------------------------------------------