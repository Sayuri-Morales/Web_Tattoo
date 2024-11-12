// Mostrar Datos de Promociones en la Página Principal
fetch('/api/promociones')
    .then(response => response.json())
    .then(promociones => {
        const container = document.getElementById('promociones-container');
        if (promociones.length === 0) {
            container.innerHTML = "<p>No hay promociones activas disponibles.</p>";
        } else {
            promociones.forEach(promocion => {
                const div = document.createElement('div');
                div.classList.add('promocion');
                // Aqui va la ruta de la Imagen Promociones
                div.innerHTML = `
                    <img src="Images/Promociones/OfertasYPromociones.jpeg" alt="Imagen de promoción" width="150" height="150">
                    <h3>${promocion.titulo}</h3>
                    <p>${promocion.descripcion}</p>
                    <p><strong>Descuento:</strong> ${promocion.descuento}%</p>
                    <p><strong>Fecha de inicio:</strong> ${new Date(promocion.fecha_inicio).toLocaleDateString()}</p>
                    <p><strong>Fecha de fin:</strong> ${new Date(promocion.fecha_fin).toLocaleDateString()}</p>
                `;
                container.appendChild(div);
            });
        }
    })
    .catch(error => {
        console.error('Error al cargar las promociones:', error);
    });