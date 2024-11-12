// Llamada para obtener las tarjetas de regalo activas desde el backend
fetch('/api/tarjetas-regalo')
    .then(response => response.json())
    .then(tarjetas => {
        console.log('Tarjetas de Regalo Activadas:', tarjetas);  // Verifica que los datos se reciben correctamente
        const container = document.getElementById('tarjetas-regalo-container');
        
        if (tarjetas.length === 0) {
            container.innerHTML = "<p>No hay tarjetas de regalo activas disponibles en este momento.</p>";
        } else {
            // Limpiar el contenedor antes de agregar nuevas tarjetas
            container.innerHTML = '';
            
            tarjetas.forEach(tarjeta => {
                const div = document.createElement('div');
                div.classList.add('tarjeta');
                
                // Convertir las fechas a un formato legible
                const fechaEmision = new Date(tarjeta.fecha_emision).toLocaleDateString();
                const fechaExpiracion = new Date(tarjeta.fecha_expiracion).toLocaleDateString();
                
                div.innerHTML = `
                    <h3>Tarjeta Código: ${tarjeta.codigo}</h3>
                    <p><strong>Valor:</strong> ₡${tarjeta.valor}</p>
                    <p><strong>Estado:</strong> ${tarjeta.estado}</p>
                    <p><strong>Fecha de emisión:</strong> ${fechaEmision}</p>
                    <p><strong>Fecha de expiración:</strong> ${fechaExpiracion}</p>
                    <button class="usar-btn" data-id="${tarjeta.tarjeta_id}" data-codigo="${tarjeta.codigo}" data-valor="${tarjeta.valor}">Comprar</button>
                `;
                container.appendChild(div);
            });

            // Añadir evento de uso a los botones
            const botonesUsar = document.querySelectorAll('.usar-btn');
            botonesUsar.forEach(boton => {
                boton.addEventListener('click', (event) => {
                    const tarjetaId = event.target.getAttribute('data-id');
                    const codigo = event.target.getAttribute('data-codigo');
                    const valor = event.target.getAttribute('data-valor');

                    // Enviar los datos de la tarjeta al backend para marcarla como usada
                    fetch('/api/usar-tarjeta', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            tarjetaId,
                            codigo,
                            valor
                        }),
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            alert('Tarjeta usada exitosamente');
                        } else {
                            alert('Hubo un error al usar la tarjeta');
                        }
                    })
                    .catch(error => {
                        console.error('Error al procesar la tarjeta:', error);
                        alert('Hubo un error al procesar la tarjeta');
                    });
                });
            });
        }
    })
    .catch(error => {
        console.error('Error al cargar las tarjetas de regalo:', error);
    });