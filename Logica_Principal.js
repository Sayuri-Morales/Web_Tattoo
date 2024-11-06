// Librerías
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2');
const http = require('http');
const querystring = require('querystring');

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

// Creación de Servidor y Escucha de Peticiones
const servidor = http.createServer((peticion, respuesta) => {
    const url = new URL('http://localhost:8888' + peticion.url);
    let camino = 'Public' + url.pathname;
    if (camino == 'Public/') camino = 'Public/index.html';
    procesarPeticion(peticion, respuesta, camino);
});
servidor.listen(8888);
// ---------------------------------------------------------------------------------------------
// Diccionarios con objetos
const mime = {
    'html': 'text/html',
    'css': 'text/css',
    'jpg': 'image/jpg',
    'jpeg': 'image/jpeg',
    'ico': 'image/x-icon',
    'mp3': 'audio/mpeg3',
    'mp4': 'video/mp4'
};
// ---------------------------------------------------------------------------------------------
function procesarPeticion(peticion, respuesta, camino) {
    switch (camino) {
        case 'Archivos/RegistroCliente': {
            RegistroCliente(peticion, respuesta);
            break;
        }
        case 'Archivos/VistaDetalle': {
            VistaDetalle(peticion, respuesta);
            break;
        }
        default: {
            fs.stat(camino, error => {
                if (!error) {
                    fs.readFile(camino, (error, contenido) => {
                        if (error) {
                            respuesta.writeHead(500, { 'Content-Type': 'text/plain' });
                            respuesta.write('Error interno');
                            respuesta.end();
                        } else {
                            const vec = camino.split('.');
                            const extension = vec[vec.length - 1];
                            const mimearchivo = mime[extension];
                            respuesta.writeHead(200, { 'Content-Type': mimearchivo });
                            respuesta.write(contenido);
                            respuesta.end();
                        }
                    });
                } else {
                    respuesta.writeHead(404, { 'Content-Type': 'text/html' });
                    respuesta.write('<!doctype html><html><head></head><body>Recurso Inexistente</body></html>');
                    respuesta.end();
                }
            });
        }
    }
}