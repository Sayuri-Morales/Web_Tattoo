// Función para cargar los nombres de artistas en el ComboBox
async function cargarArtistasEnComboBox() {
    try {
        const response = await fetch('/api/artistas');
        const artistas = await response.json();

        const comboBox = document.getElementById('artistasComboBox');
        artistas.forEach(artista => {
            const option = document.createElement('option');
            option.value = artista.artista_id;
            option.textContent = artista.nombre;
            comboBox.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los artistas:', error);
    }
}

// Función para cargar tatuajes y luego cargar fotos por el ID del artista seleccionado
async function cargarTatuajesPorArtista(artistaId) {
    try {
        const response = await fetch(`/api/tatuajesPorArtista?artista_id=${artistaId}`);
        const tatuajes = await response.json();

        // Obtener los IDs de los tatuajes para pasar a la siguiente función
        const tatuajeIds = tatuajes.map(tatuaje => tatuaje.tatuaje_id);
        if (tatuajeIds.length > 0) {
            cargarFotosPorTatuajes(tatuajeIds);
        } else {
            document.getElementById('galeriaFotos').innerHTML = '<p>No se encontraron tatuajes para este artista.</p>';
        }
    } catch (error) {
        console.error('Error al cargar los tatuajes:', error);
    }
}

// Función para cargar fotos de tatuajes y mostrarlas en la galería
async function cargarFotosPorTatuajes(tatuajeIds) {
    try {
        const response = await fetch(`/api/fotosPorTatuajes?tatuajeIds=${tatuajeIds.join(',')}`);
        const fotos = await response.json();
        mostrarFotosEnGaleria(fotos);
    } catch (error) {
        console.error('Error al cargar las fotos:', error);
    }
}

// Función para mostrar las fotos en la galería
function mostrarFotosEnGaleria(fotos) {
    const galeria = document.getElementById('galeriaFotos');
    galeria.innerHTML = ''; // Limpiar galería antes de cargar nuevas fotos

    fotos.forEach(foto => {
        const img = document.createElement('img');
        img.src = foto.ruta_foto;
        img.alt = foto.descripcion;
        img.className = 'foto-galeria';
        galeria.appendChild(img);
    });
}

// Event listener para detectar cuando cambia el ComboBox
document.getElementById('artistasComboBox').addEventListener('change', (event) => {
    const artistaId = event.target.value;
    if (artistaId) {
        cargarTatuajesPorArtista(artistaId);
    }
});

// Llama a la función al cargar la página
window.onload = cargarArtistasEnComboBox;