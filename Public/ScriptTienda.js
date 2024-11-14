document.addEventListener("DOMContentLoaded", function() {
    fetch('/api/ventas_articulos')
        .then(response => response.json())
        .then(data => {
            mostrarDatosEnTabla(data);
        })
        .catch(error => console.error('Error al obtener los datos:', error));
});

let carrito = []; // Carrito vacío al inicio

// Función para mostrar los datos en la tabla
function mostrarDatosEnTabla(datos) {
    const tabla = document.getElementById('tabla-ventas');
    tabla.innerHTML = `
        <tr>
            <th>ID Artículo</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Imagen</th>
            <th>Acción</th> <!-- Columna para los botones -->
        </tr>
    `;
    
    datos.forEach(articulo => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${articulo.articulo_id}</td>
            <td>${articulo.nombre}</td>
            <td>${articulo.descripcion}</td>
            <td>${articulo.precio}</td>
            <td>${articulo.stock}</td>
            <td><img src="${articulo.imagen}" alt="Imagen de ${articulo.nombre}" width="100"></td>
            <td><img src="${articulo.imagen}" alt="Imagen de ${articulo.nombre}" width="100"></td>
            <td><button onclick="añadirAlCarrito(${articulo.articulo_id}, '${articulo.nombre}', ${articulo.precio}, '${articulo.imagen}')">Añadir al Carrito</button></td>
        `;
        tabla.appendChild(fila);
    });
}

// Función para añadir un artículo al carrito
function añadirAlCarrito(id, nombre, precio, imagen) {
    const articulo = { id, nombre, precio, imagen }; // Incluimos la imagen
    carrito.push(articulo); // Añadimos el artículo al carrito
    console.log('Artículo añadido al carrito:', articulo);
}


// Función para guardar el carrito en un archivo JSON
document.getElementById('guardar-carrito').addEventListener('click', function() {
    if (carrito.length === 0) {
        alert('El carrito está vacío.');
        return;
    }

    // Crear un objeto para guardar en JSON
    const carritoJSON = { tienda: carrito };

    // Enviar el carrito al servidor (aquí, como ejemplo, lo guardamos en un archivo)
    fetch('/api/guardar_carrito', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(carritoJSON)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Carrito guardado correctamente:', data);
        alert('Carrito guardado exitosamente.');
    })
    .catch(error => console.error('Error al guardar el carrito:', error));
});