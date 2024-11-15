// Cargar tatuadores en el comboBox
fetch('/api/tatuadores')
    .then(response => response.json())
    .then(data => {
        const tatuadoresComboBox = document.getElementById('tatuadoresComboBox');
        data.forEach(tatuador => {
            const option = document.createElement('option');
            option.value = tatuador.artista_id;
            option.textContent = tatuador.nombre;
            tatuadoresComboBox.appendChild(option);
        });

        // Llamar a la función para cargar los tatuajes al seleccionar un tatuador
        tatuadoresComboBox.addEventListener('change', cargarTatuajes);
    })
    .catch(error => console.error('Error cargando tatuadores:', error));

// Cargar categorías en el comboBox
fetch('/api/categorias')
    .then(response => response.json())
    .then(data => {
        const categoriasComboBox = document.getElementById('categoriasComboBox');
        data.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.categoria_id;
            option.textContent = categoria.nombre;
            categoriasComboBox.appendChild(option);
        });

        // Llamar a la función para cargar los tatuajes al seleccionar una categoría
        categoriasComboBox.addEventListener('change', cargarTatuajes);
    })
    .catch(error => console.error('Error cargando categorías:', error));

// Función para cargar los tatuajes y fotos filtrados
function cargarTatuajes() {
    const tatuadorId = document.getElementById('tatuadoresComboBox').value;
    const categoriaId = document.getElementById('categoriasComboBox').value;

    // Limpiar la galería antes de hacer la nueva búsqueda
    const galeriaFotosDiv = document.getElementById('CategoriasTatuajes');
    galeriaFotosDiv.innerHTML = ''; // Limpiar galería

    // Si ambos seleccionados son válidos
    if (tatuadorId && categoriaId) {
        // Hacer la petición al servidor para obtener los tatuajes filtrados
        fetch(`/api/tatuajes?artista_id=${tatuadorId}&categoria_id=${categoriaId}`)
            .then(response => response.json())
            .then(data => {
                if (data.length === 0) {
                    
                    mostrarMensajeNoDatos();
                } else {
                    // Si se encontraron tatuajes, mostrar las fotos
                    mostrarGaleriaFotos(data);
                }
            })
            .catch(error => console.error('Error cargando tatuajes:', error));
    } else {
        // Si no se ha seleccionado el tatuador o la categoría, limpiar las fotos
        document.getElementById('CategoriasTatuajes').innerHTML = '';
    }
}

// Función para mostrar las fotos de los tatuajes en la galería
function mostrarGaleriaFotos(tatuajes) {
    const galeriaFotosDiv = document.getElementById('CategoriasTatuajes');
    tatuajes.forEach(tatuaje => {
        tatuaje.fotos.forEach(foto => {
            const fotoElement = document.createElement('div');
            fotoElement.innerHTML = `
                <img src="${foto.ruta_foto}" alt="${foto.descripcion}">
                <p>${foto.descripcion}</p>
            `;
            galeriaFotosDiv.appendChild(fotoElement);
        });
    });
}

// Función para mostrar el mensaje cuando no hay datos
function mostrarMensajeNoDatos() {
    const galeriaFotosDiv = document.getElementById('CategoriasTatuajes');
    galeriaFotosDiv.innerHTML = '<p>No se encontraron categorías para este artista.</p>';
}