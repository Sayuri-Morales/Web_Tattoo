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

// Función para mostrar las fotos en la galería con checkboxes
function mostrarFotosEnGaleria(fotos) {
    const galeria = document.getElementById('galeriaFotos');
    galeria.innerHTML = ''; // Limpiar galería antes de cargar nuevas fotos

    fotos.forEach(foto => {
        const div = document.createElement('div');
        div.className = 'foto-item';
        
        const img = document.createElement('img');
        img.src = foto.ruta_foto;
        img.alt = foto.descripcion;
        img.className = 'foto-galeria';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `checkbox_${foto.tatuaje_id}`;
        checkbox.value = foto.tatuaje_id;
        checkbox.onclick = () => manejarSeleccion(checkbox, foto); // Llamar a la función al marcar o desmarcar
        
        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = 'Seleccionar Imagen';
        
        div.appendChild(img);
        div.appendChild(checkbox);
        div.appendChild(label);
        galeria.appendChild(div);
    });
}

// Función para manejar la selección de la imagen con el checkbox
function manejarSeleccion(checkbox, foto) {
    if (checkbox.checked) {
        alert(`Has seleccionado la imagen: ${foto.descripcion}`);
        // Aquí podrías agregar la foto seleccionada a algún formulario o hacer otra acción
    } else {
        alert(`Has desmarcado la imagen: ${foto.descripcion}`);
        // Aquí podrías quitar la foto seleccionada de algún formulario o realizar otra acción
    }
}

// Función para manejar el envío del formulario
document.getElementById('enviarBtn').addEventListener('click', () => {
    // Obtener el correo y la descripción ingresada por el usuario
    const correo = document.getElementById('correo').value;
    const descripcion = document.getElementById('descripcion').value;

    // Verificar si los campos requeridos están completos
    if (!correo || !descripcion) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Obtener las imágenes seleccionadas
    const imagenesSeleccionadas = [];
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        const tatuajeId = checkbox.value;
        imagenesSeleccionadas.push(tatuajeId);
    });

    // Verificar si se seleccionaron imágenes
    if (imagenesSeleccionadas.length === 0) {
        alert('Por favor, selecciona al menos una imagen.');
        return;
    }

    // Enviar la información al servidor (puedes cambiar esto para adaptarlo a tu backend)
    const datos = {
        correo: correo,
        descripcion: descripcion,
        imagenes: imagenesSeleccionadas
    };

    // Ejemplo de cómo podrías enviar los datos al servidor usando fetch
    fetch('/api/enviarFormulario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        alert('Formulario enviado con éxito');
        console.log('Respuesta del servidor:', data);
    })
    .catch(error => {
        console.error('Error al enviar el formulario:', error);
    });
});

// Event listener para detectar cuando cambia el ComboBox
document.getElementById('artistasComboBox').addEventListener('change', (event) => {
    const artistaId = event.target.value;
    if (artistaId) {
        cargarTatuajesPorArtista(artistaId);
    }
});

// Función para manejar el envío del formulario
document.getElementById('enviarBtn').addEventListener('click', () => {
    // Obtener el correo y la descripción ingresada por el usuario
    const correo = document.getElementById('correo').value;
    const descripcion = document.getElementById('descripcion').value;
    
    // Verificar si los campos requeridos están completos
    if (!correo || !descripcion) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Obtener las imágenes seleccionadas
    const imagenesSeleccionadas = [];
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        const tatuajeId = checkbox.value;
        imagenesSeleccionadas.push(tatuajeId);
    });

    // Verificar si se seleccionaron imágenes
    if (imagenesSeleccionadas.length === 0) {
        alert('Por favor, selecciona al menos una imagen.');
        return;
    }

    // Buscar el usuario_id en la tabla usuarios usando el correo
    fetch(`/api/obtenerUsuarioIdPorCorreo?correo=${correo}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.usuario_id) {
                // Obtener el usuario_id
                const usuario_id = data.usuario_id;

                // Asumimos que solo se puede seleccionar un tatuaje, por ahora tomamos el primer tatuaje seleccionado
                const tatuaje_id = imagenesSeleccionadas[0]; // Cambiar esta lógica si quieres permitir múltiples tatuajes

                // Obtener el artista_id (esto podría venir de algún otro lugar si es necesario)
                const artista_id = document.getElementById('artistasComboBox').value;

                // Ahora enviamos los datos a la tabla cotizaciones
                const cotizacionData = {
                    usuario_id: usuario_id,
                    artista_id: artista_id,
                    tatuaje_id: tatuaje_id,
                    descripcion: descripcion
                };

                // Enviar la información para guardar la cotización
                fetch('/api/guardarCotizacion', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(cotizacionData)
                })
                .then(response => response.json())
                .then(data => {
                    alert('Cotización enviada con éxito');
                    console.log('Respuesta del servidor:', data);
                })
                .catch(error => {
                    console.error('Error al enviar la cotización:', error);
                    alert('Hubo un problema al enviar la cotización. Intenta nuevamente.');
                });
            } else {
                alert('No se encontró el usuario con el correo proporcionado.');
            }
        })
        .catch(error => {
            console.error('Error al obtener el usuario:', error);
            alert('Hubo un problema al verificar el correo. Intenta nuevamente.');
        });
});

// Llama a la función al cargar la página
window.onload = cargarArtistasEnComboBox;