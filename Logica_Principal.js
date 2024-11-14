// Librerías
const fs = require('fs');
const path = require('path');
const http = require('http');
const mysql = require('mysql2');
const express = require('express');
const querystring = require('querystring');
const nodemailer = require('nodemailer');

// Inicializa la aplicación de express
const app = express();

// Conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '#Mysql.',
    database: 'sitio_tatuajes'
});

connection.connect(error => {
    if (error) {
        console.error('Error conectando a la base de datos:', error);
        return;
    }
    console.log('Conexión a la base de datos establecida...');
});

// Configurar express para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'Public')));

// Diccionario de tipos MIME
const mime = {
    'html': 'text/html',
    'css': 'text/css',
    'jpg': 'image/jpg',
    'jpeg': 'image/jpeg',
    'ico': 'image/x-icon',
    'mp3': 'audio/mpeg3',
    'mp4': 'video/mp4'
};
// Configurar Express para manejar datos JSON
app.use(express.json());
// ----------------------------------------------------------------------------------
// Variable para almacenas el rol y numero de
let verificationCode = null; 
let userRol = null;  

// Configuración de transporte de correo con nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'urbanexcontruccionescr@gmail.com',
        pass: 'mkrd uffp odkf riaz' 
    }
});

// Ruta para el login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    connection.query('SELECT * FROM Usuarios WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error('Error al consultar la base de datos:', error);
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        }

        if (results.length === 0) {
            return res.json({ success: false, message: 'Correo no encontrado' });
        }

        const user = results[0];

        if (user.contraseña !== password) {
            return res.json({ success: false, message: 'Contraseña incorrecta' });
        }

        if (user.estado !== 'activo') {
            return res.json({ success: false, message: 'Cuenta desactivada' });
        }

        // Generar un código aleatorio de 6 dígitos
        verificationCode = Math.floor(100000 + Math.random() * 900000);
        userRol = user.rol;  // Almacena el rol del usuario para usarlo en la verificación

        // Enviar el código al correo del usuario
        const mailOptions = {
            from: 'tuemail@gmail.com',
            to: email,
            subject: 'Código de verificación',
            text: `Tu código de verificación de Tatuajes JJS es: ${verificationCode}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error al enviar el correo:', error);
                return res.status(500).json({ success: false, message: 'Error al enviar el código de verificación' });
            }

            res.json({ success: true, message: 'Código de verificación enviado', nombre: user.nombre });
        });
    });
});

// Ruta para verificar el código de autenticación
app.post('/api/verify-code', (req, res) => {
    const { code } = req.body;

    if (parseInt(code) === verificationCode) {
        res.json({ success: true, rol: userRol });  // Devuelve el rol si el código es correcto
    } else {
        res.json({ success: false, message: 'Código incorrecto' });
    }
});
// ----------------------------------------------------------------------------------
// Ruta para obtener los datos de los artistas
app.get('/api/artistas', (req, res) => {
    connection.query('SELECT * FROM Artistas', (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(results);
    });
});
// ----------------------------------------------------------------------------------
// Ruta para obtener los tatuajes de un artista específico
app.get('/api/tatuajes/:artista_id', (req, res) => {
    const artista_id = req.params.artista_id;

    // Obtener el artista por artista_id
    connection.query('SELECT * FROM Artistas WHERE artista_id = ?', [artista_id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Artista no encontrado' });
        }

        const nombre_artista = results[0].nombre;
        console.log(artista_id)

        // Obtener los tatuajes del artista
        connection.query('SELECT * FROM Tatuajes WHERE artista_id = ?', [artista_id], (error, tatuajes) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }

            // Envía el nombre del artista junto con los tatuajes
            res.json({ nombre_artista, tatuajes });
        });
    });
});
// ----------------------------------------------------------------------------------
// Ruta para obtener las imágenes de un tatuaje específico
app.get('/api/tatuajes/:tatuaje_id/imagenes', (req, res) => {
    const tatuaje_id = req.params.tatuaje_id;

    // Obtener las imágenes de la galería para el tatuaje especificado
    connection.query('SELECT * FROM galeria_fotos WHERE tatuaje_id = ? AND status = "publicada"', [tatuaje_id], (error, fotos) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(fotos);
    });
});
// ----------------------------------------------------------------------------------
// Ruta para obtener las promociones activas
app.get('/api/promociones', (req, res) => {
    connection.query('SELECT * FROM promociones WHERE estado = "activo"', (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(results);
    });
});
// ----------------------------------------------------------------------------------
// Ruta para obtener Membresias
app.get('/api/membresias', (req, res) => {
    connection.query('SELECT * FROM Membresias', (error, results) => {
        if (error) {
            console.error("Error en la consulta:", error);
            return res.status(500).json({ error: error.message });
        }
        res.json(results);
    });
});
// ----------------------------------------------------------------------------------
// Ruta para guardar los datos de la membresía comprada en un archivo JSON
app.post('/api/comprar-membresia', (req, res) => {
    const { membresiaId, nombre, descripcion, precio } = req.body;
    const data = {
        membresiaId,
        nombre,
        descripcion,
        precio,
        fechaCompra: new Date().toLocaleString()
    };
    
    // Ruta para guardar el archivo JSON
    const filePath = path.join(__dirname, 'Public', 'ArchivosJson', 'MembresiasSeleccionadas.json');
    
    // Leer el archivo JSON existente
    fs.readFile(filePath, 'utf8', (err, fileData) => {
        if (err && err.code !== 'ENOENT') {
            return res.status(500).json({ error: 'Error al leer el archivo JSON.' });
        }

        let compras = [];
        if (fileData) {
            compras = JSON.parse(fileData);
        }

        // Añadir la nueva compra al archivo
        compras.push(data);

        // Guardar el archivo actualizado
        fs.writeFile(filePath, JSON.stringify(compras, null, 4), 'utf8', (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al guardar el archivo JSON.' });
            }
            res.json({ success: true, message: 'Membresía comprada y registrada.' });
        });
    });
});
// ----------------------------------------------------------------------------------
// Ruta para obtener los beneficios
app.get('/api/beneficios', (req, res) => {
    connection.query('SELECT * FROM Beneficios', (error, results) => {
        if (error) {
            console.error("Error en la consulta de beneficios:", error);
            return res.status(500).json({ error: error.message });
        }
        res.json(results);  // Enviar los datos de los beneficios como respuesta
    });
});
// ----------------------------------------------------------------------------------
// Ruta para obtener las tarjetas de regalo con estado 'activa'
app.get('/api/tarjetas-regalo', (req, res) => {
    connection.query('SELECT * FROM tarjetas_regalo WHERE estado = "activa"', (error, results) => {
        if (error) {
            console.error("Error en la consulta de tarjetas de regalo:", error);
            return res.status(500).json({ error: error.message });
        }
        res.json(results);  // Enviar los datos de las tarjetas de regalo activas como respuesta
    });
});

// -------------------------------------------------------------------------------
// Ruta para marcar la tarjeta como usada y guardar la información en un archivo JSON
app.post('/api/usar-tarjeta', (req, res) => {
    const { tarjetaId, codigo, valor } = req.body;

    // Crear un objeto con los datos de la tarjeta
    const tarjetaUsada = {
        tarjetaId,
        codigo,
        valor,
        fechaUso: new Date().toLocaleString() // Agregar la fecha de uso
    };

    // Ruta donde se guardará el archivo JSON
    const rutaArchivo = path.join(__dirname, 'Public', 'ArchivosJson', 'TarjetasRegalos.json');

    // Leer el archivo JSON existente, o crear uno nuevo si no existe
    fs.readFile(rutaArchivo, 'utf8', (err, data) => {
        let tarjetasUsadas = [];
        if (err) {
            // Si el archivo no existe, creamos uno vacío
            console.log("El archivo no existe, creando uno nuevo.");
        } else {
            tarjetasUsadas = JSON.parse(data); // Parsear los datos existentes
        }

        // Agregar la nueva tarjeta usada a la lista
        tarjetasUsadas.push(tarjetaUsada);

        // Escribir los datos actualizados en el archivo JSON
        fs.writeFile(rutaArchivo, JSON.stringify(tarjetasUsadas, null, 2), (err) => {
            if (err) {
                console.error('Error al guardar el archivo JSON:', err);
                return res.status(500).json({ success: false, message: 'Error al guardar los datos' });
            }

            console.log('Tarjeta marcada como usada y datos guardados');
            return res.json({ success: true, message: 'Tarjeta usada exitosamente' });
        });
    });
});
// ----------------------------------------------------------------------------------
// Ruta para cargar artistas en combobox galeria
app.get('/api/artistas', (req, res) => {
    const query = 'SELECT artista_id, nombre FROM artistas';

    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(results);
    });
});

// Ruta para consultar tatuajes por artistas
app.get('/api/tatuajesPorArtista', (req, res) => {
    const { artista_id } = req.query;

    if (!artista_id) {
        return res.status(400).json({ error: 'artista_id es requerido' });
    }

    const query = 'SELECT tatuaje_id FROM tatuajes WHERE artista_id = ?';
    connection.query(query, [artista_id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(results);
    });
});

// Mostrar tatuajes por id tatujes
app.get('/api/fotosPorTatuajes', (req, res) => {
    const { tatuajeIds } = req.query;

    if (!tatuajeIds || tatuajeIds.length === 0) {
        return res.status(400).json({ error: 'Se requiere al menos un ID de tatuaje' });
    }

    const query = `
        SELECT foto_id, tatuaje_id, ruta_foto, descripcion 
        FROM galeria_fotos 
        WHERE tatuaje_id IN (?) AND status = 'publicada' 
        LIMIT 20
    `;
    connection.query(query, [tatuajeIds.split(',')], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(results);
    });
});
// ----------------------------------------------------------------------------------
// Cotizaciones
// Supongamos que estás usando Express en el servidor
app.get('/api/obtenerUsuarioIdPorCorreo', (req, res) => {
    const correo = req.query.correo;

    if (!correo) {
        return res.status(400).json({ error: 'Correo es requerido' });
    }

    const query = 'SELECT usuario_id FROM usuarios WHERE email = ?';
    connection.query(query, [correo], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        if (results.length > 0) {
            return res.json({ usuario_id: results[0].usuario_id });
        } else {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
    });
});

app.post('/api/guardarCotizacion', (req, res) => {
    const { usuario_id, artista_id, tatuaje_id, descripcion } = req.body;

    if (!usuario_id || !artista_id || !tatuaje_id || !descripcion) {
        return res.status(400).json({ error: 'Todos los campos son necesarios' });
    }

    const query = 'INSERT INTO cotizaciones (usuario_id, artista_id, tatuaje_id, descripcion) VALUES (?, ?, ?, ?)';
    connection.query(query, [usuario_id, artista_id, tatuaje_id, descripcion], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json({ success: true, message: 'Cotización guardada con éxito' });
    });
});
// ----------------------------------------------------------------------------------
// Tienda
// Ruta para obtener los artículos
app.get('/api/ventas_articulos', (req, res) => {
    connection.query('SELECT * FROM ventas_articulos', (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(results);
    });
});

// Ruta para guardar el carrito
app.post('/api/guardar_carrito', (req, res) => {
    const carrito = req.body.tienda;

    // Directorio donde se guardará el archivo JSON
    const dir = path.join(__dirname, 'Public', 'ArchivosJson');
    
    // Verificar si la carpeta existe, si no, crearla
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true }); // Crea la carpeta si no existe
    }

    // Definir la ruta completa del archivo donde se guardará el carrito
    const filePath = path.join(dir, 'CarritoCompras.json');

    // Guardar el carrito en un archivo JSON
    fs.writeFile(filePath, JSON.stringify(carrito, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al guardar el carrito' });
        }
        res.json({ message: 'Carrito guardado correctamente en Public/ArchivosJson/' });
    });
});
// ----------------------------------------------------------------------------------
const dir = path.join(__dirname, 'Public', 'ArchivosJson');

// Ruta para leer datos del archivo CarritoCompras.json
app.get('/api/carritoCompras', (req, res) => {
    fs.readFile(path.join(dir, 'CarritoCompras.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo CarritoCompras.json' });
        }
        res.json(JSON.parse(data));
    });
});

// Ruta para leer datos del archivo TarjetasRegalos.json
app.get('/api/tarjetasRegalos', (req, res) => {
    fs.readFile(path.join(dir, 'TarjetasRegalos.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo TarjetasRegalos.json' });
        }
        res.json(JSON.parse(data));
    });
});

// Ruta para leer datos del archivo MembresiasSeleccionadas.json
app.get('/api/membresiasSeleccionadas', (req, res) => {
    fs.readFile(path.join(dir, 'MembresiasSeleccionadas.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo MembresiasSeleccionadas.json' });
        }
        res.json(JSON.parse(data));
    });
});
// ----------------------------------------------------------------------------------
// Carrito de Compras
// Directorio de los archivos JSON
app.post('/api/procesarPago', (req, res) => {
    const { numeroTarjeta, cvv, fechaVencimiento, correo } = req.body;  // Obtener los datos del cuerpo de la solicitud

    // Función para obtener el usuario ID por correo
    function obtenerUsuarioIdPorCorreo(correo) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT usuario_id FROM usuarios WHERE email = ?';
            connection.query(query, [correo], (error, results) => {
                if (error) {
                    reject(error);
                } else if (results.length > 0) {
                    resolve(results[0].usuario_id); // Devolver el usuario_id
                } else {
                    reject('Usuario no encontrado');
                }
            });
        });
    }

    // Leer los archivos JSON
    function leerArchivo(nombreArchivo) {
        const rutaArchivo = path.join(dir, nombreArchivo);
        return new Promise((resolve, reject) => {
            fs.readFile(rutaArchivo, 'utf8', (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(JSON.parse(data));
                }
            });
        });
    }

    // Función para insertar en la base de datos
    async function insertarProductos() {
        try {
            // Leer los datos de los archivos
            const carritoCompras = await leerArchivo('CarritoCompras.json');
            const membresiasSeleccionadas = await leerArchivo('MembresiasSeleccionadas.json');
            const tarjetasRegalos = await leerArchivo('TarjetasRegalos.json');

            // Obtener el usuario_id basado en el correo
            const usuarioId = await obtenerUsuarioIdPorCorreo(correo);  // Obtener el usuario ID

            const promocion = 'Promocion X';
            const fechaCompra = new Date();

            // Insertar cada producto en la tabla carrito_compras
            for (let producto of carritoCompras) {
                const precioFinal = producto.precio; // Suponiendo que no hay descuento por ahora
                const cantidad = 1; // Suponiendo que la cantidad por defecto es 1
                const ventasArticulos = JSON.stringify(producto);
                const tarjetasRegalo = JSON.stringify(tarjetasRegalos); // Asumimos que todas las tarjetas son aplicables

                const sql = `
                    INSERT INTO carrito_compras (usuario_id, producto_id, cantidad, promocion, membresia, ventas_articulos, tarjetas_regalo, fecha_agregado, estado, fecha_compra, precio_final)
                    VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), 'activo', ?, ?)
                `;

                // Para los valores de membresia, tomamos el primer objeto (puedes modificar esto según tu lógica)
                const membresia = membresiasSeleccionadas.length > 0 ? parseFloat(membresiasSeleccionadas[0].precio) : null;

                // Ejecutar la inserción
                connection.query(sql, [usuarioId, producto.id, cantidad, promocion, membresia, ventasArticulos, tarjetasRegalo, fechaCompra, precioFinal], (error, results) => {
                    if (error) {
                        console.error('Error insertando producto:', error);
                    } else {
                        console.log('Producto insertado con ID:', results.insertId);
                    }
                });
            }

            // Vaciar los archivos después de insertar los datos
            vaciarArchivos();

        } catch (error) {
            console.error('Error al leer los archivos o insertar productos:', error);
        }
    }

    // Llamar a la función para insertar productos
    insertarProductos();

    res.json({ success: true });  // Responder con éxito para este ejemplo
});
// ---------------------------------------------------------------------------------








// Crear el servidor y usar la app de express como manejador de peticiones
const servidor = http.createServer(app);

// Escuchar en el puerto 8888
servidor.listen(8888, () => {
    console.log('Servidor escuchando en http://localhost:8888');
});