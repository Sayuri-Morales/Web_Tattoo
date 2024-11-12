// Mostrar Datos de Membresías en la Página Principal
fetch('/api/membresias')
    .then(response => response.json())
    .then(membresias => {
        console.log('Membresías recibidas:', membresias);  // Verifica que los datos se reciben correctamente
        const container = document.getElementById('membresias-container');
        
        if (membresias.length === 0) {
            container.innerHTML = "<p>No hay membresías disponibles en este momento.</p>";
        } else {
            container.innerHTML = '';  // Limpiar el contenedor antes de agregar nuevas membresías
            
            membresias.forEach(membresia => {
                const div = document.createElement('div');
                div.classList.add('membresia');
                div.innerHTML = `
                    <h3>${membresia.nombre}</h3>
                    <p><strong>Descripción:</strong> ${membresia.descripcion}</p>
                    <p><strong>Beneficios:</strong> ${membresia.beneficios}</p>
                    <p><strong>Precio:</strong> ₡${membresia.precio}</p>
                    <p><strong>Fecha de Creación:</strong> ${new Date(membresia.fecha_creacion).toLocaleDateString()}</p>
                    <button class="comprar-btn" data-id="${membresia.membresia_id}" data-nombre="${membresia.nombre}" data-descripcion="${membresia.descripcion}" data-precio="${membresia.precio}">Comprar</button>
                `;
                container.appendChild(div);
            });

            // Añadir evento de compra a los botones
            const botonesComprar = document.querySelectorAll('.comprar-btn');
            botonesComprar.forEach(boton => {
                boton.addEventListener('click', (event) => {
                    const membresiaId = event.target.getAttribute('data-id');
                    const nombre = event.target.getAttribute('data-nombre');
                    const descripcion = event.target.getAttribute('data-descripcion');
                    const precio = event.target.getAttribute('data-precio');

                    // Enviar los datos de la membresía al backend
                    fetch('/api/comprar-membresia', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            membresiaId,
                            nombre,
                            descripcion,
                            precio
                        }),
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            alert('Membresía comprada y registrada exitosamente');
                        } else {
                            alert('Hubo un error al registrar la compra');
                        }
                    })
                    .catch(error => {
                        console.error('Error al procesar la compra:', error);
                        alert('Hubo un error al procesar la compra');
                    });
                });
            });
        }
    })
    .catch(error => {
        console.error('Error al cargar las membresías:', error);
    });