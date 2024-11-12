// Llamada para obtener los beneficios desde el backend
fetch('/api/beneficios')
    .then(response => response.json())
    .then(beneficios => {
        console.log('Beneficios recibidos:', beneficios);  // Verifica que los datos se reciben correctamente
        const container = document.getElementById('beneficios-container');
        
        if (beneficios.length === 0) {
            container.innerHTML = "<p>No hay beneficios disponibles en este momento.</p>";
        } else {
            // Limpiar el contenedor antes de agregar nuevos beneficios
            container.innerHTML = '';
            
            beneficios.forEach(beneficio => {
                const div = document.createElement('div');
                div.classList.add('beneficio');
                
                // Convertir las fechas a un formato legible
                const fechaInicio = new Date(beneficio.fecha_inicio).toLocaleDateString();
                const fechaFin = new Date(beneficio.fecha_fin).toLocaleDateString();
                
                div.innerHTML = `
                    <h3>${beneficio.nombre_beneficio}</h3>
                    <!-- Si hay imagen, mostrarla -->
                    ${beneficio.imagen_beneficios ? `<img src="${beneficio.imagen_beneficios}" alt="${beneficio.nombre_beneficio}" class="beneficio-image" />` : ''}
                    <p><strong>Descripción:</strong> ${beneficio.descripcion}</p>
                    <p><strong>Fecha de inicio:</strong> ${fechaInicio}</p>
                    <p><strong>Fecha de fin:</strong> ${fechaFin}</p>
                `;
                container.appendChild(div);
            });
        }
    })
    .catch(error => {
        console.error('Error al cargar los beneficios:', error);
    });