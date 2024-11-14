document.getElementById('btnComprar').onclick = function() {
    window.location.href = '/RealizarPago.html'; // Cambia esta URL a la página de destino deseada
};

window.onload = function() {
    let totalCarrito = 0;
    let totalTarjetas = 0;
    let totalMembresias = 0;

    // Cargar los datos de CarritoCompras
    fetch('/api/carritoCompras')
        .then(response => response.json())
        .then(data => {
            let carritoHtml = '';
            data.forEach(item => {
                carritoHtml += `
                    <div style="border: 1px solid #ccc; padding: 10px; margin: 10px;">
                        <img src="${item.imagen}" alt="${item.nombre}" style="width: 100px; height: auto; display: block; margin-bottom: 10px;">
                        <p>Nombre: ${item.nombre}</p>
                        <p>Precio: ₡${item.precio}</p>
                    </div>
                `;
                totalCarrito += item.precio;
            });
            carritoHtml += `<h3>Total Carrito de Compras: ₡${totalCarrito}</h3>`;
            document.getElementById('carrito').innerHTML = carritoHtml;
            mostrarTotalGeneral();
        });

    // Cargar los datos de TarjetasRegalos
    fetch('/api/tarjetasRegalos')
        .then(response => response.json())
        .then(data => {
            let tarjetasHtml = '';
            data.forEach(tarjeta => {
                tarjetasHtml += `
                    <div style="border: 1px solid #ccc; padding: 10px; margin: 10px;">
                        <p>Código: ${tarjeta.codigo}</p>
                        <p>Valor: ₡${tarjeta.valor}</p>
                        <p>Fecha de uso: ${tarjeta.fechaUso}</p>
                    </div>
                `;
                totalTarjetas += parseFloat(tarjeta.valor);
            });
            tarjetasHtml += `<h3>Total Tarjetas de Regalo: ₡${totalTarjetas}</h3>`;
            document.getElementById('tarjetas').innerHTML = tarjetasHtml;
            mostrarTotalGeneral();
        });

    // Cargar los datos de MembresiasSeleccionadas
    fetch('/api/membresiasSeleccionadas')
        .then(response => response.json())
        .then(data => {
            let membresiasHtml = '';
            data.forEach(membresia => {
                membresiasHtml += `
                    <div style="border: 1px solid #ccc; padding: 10px; margin: 10px;">
                        <p>Nombre: ${membresia.nombre}</p>
                        <p>Precio: ₡${membresia.precio}</p>
                        <p>Fecha de compra: ${membresia.fechaCompra}</p>
                    </div>
                `;
                totalMembresias += parseFloat(membresia.precio);
            });
            membresiasHtml += `<h3>Total Membresías Seleccionadas: ₡${totalMembresias}</h3>`;
            document.getElementById('membresias').innerHTML = membresiasHtml;
            mostrarTotalGeneral();
        });

    // Función para calcular y mostrar el total general
    function mostrarTotalGeneral() {
        const totalGeneral = totalCarrito + totalTarjetas + totalMembresias;
        document.getElementById('totalGeneral').innerHTML = `<h2>Total General: ₡${totalGeneral}</h2>`;
    }
};