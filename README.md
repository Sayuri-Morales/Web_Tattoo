Data Base 
Diagrama ER Simplificado

Usuarios (1) —— (N) Citas
Artistas (1) —— (N) Citas
Artistas (1) —— (N) Tatuajes
Categorias_Tatuajes (1) —— (N) Tatuajes
Tatuajes (1) —— (N) Galeria_Fotos
Usuarios (1) —— (N) Cotizaciones
Artistas (1) —— (N) Cotizaciones
Tatuajes (1) —— (N) Cotizaciones

Descripción de las Tablas y Sus Campos
A continuación, se detalla cada tabla con sus respectivos campos, tipos de datos y relaciones:

1. Usuarios
Descripción: Almacena la información de los usuarios que acceden al panel administrativo.
Campo	Tipo de Dato	Descripción
usuario_id	INT AUTO_INCREMENT	Clave primaria
nombre	VARCHAR(100)	Nombre del usuario
email	VARCHAR(100)	Correo electrónico (único)
contraseña	VARCHAR(255)	Contraseña (hashed)
rol	ENUM('admin','editor')	Rol del usuario
fecha_creacion	DATETIME	Fecha de creación del usuario
estado	ENUM('activo','inactivo')	Estado del usuario
Relaciones:
Usuarios pueden gestionar varias Citas, Cotizaciones, etc., dependiendo de los permisos.

2. Artistas
Descripción: Información de los artistas de tatuajes.
Campo	Tipo de Dato	Descripción
artista_id	INT AUTO_INCREMENT	Clave primaria
nombre	VARCHAR(100)	Nombre del artista
biografia	TEXT	Biografía del artista
especialidad	VARCHAR(100)	Especialidades o estilos de tatuaje
foto_perfil	VARCHAR(255)	Ruta a la foto de perfil
fecha_creacion	DATETIME	Fecha de creación del perfil
Relaciones:
Un Artista puede tener múltiples Citas.
Un Artista puede pertenecer a múltiples Categorias_Tatuajes (si aplicable).

3. Categorias_Tatuajes
Descripción: Categorías o estilos de tatuajes.
Campo	Tipo de Dato	Descripción
categoria_id	INT AUTO_INCREMENT	Clave primaria
nombre	VARCHAR(100)	Nombre de la categoría
descripcion	TEXT	Descripción de la categoría
fecha_creacion	DATETIME	Fecha de creación
Relaciones:
Una Categoría_Tatuaje puede tener múltiples Tatuajes.

4. Tatuajes
Descripción: Detalles de los tatuajes realizados.
Campo	Tipo de Dato	Descripción
tatuaje_id	INT AUTO_INCREMENT	Clave primaria
artista_id	INT	Clave foránea a Artistas
categoria_id	INT	Clave foránea a Categorias_Tatuajes
descripcion	TEXT	Descripción del tatuaje
precio	DECIMAL(10,2)	Precio del tatuaje
fecha_creacion	DATETIME	Fecha de creación
Relaciones:
Un Tatuaje pertenece a un Artista y a una Categoría_Tatuaje.
Un Tatuaje puede tener múltiples Galeria_Fotos.

5. Galeria_Fotos
Descripción: Fotos de los tatuajes realizados.
Campo	Tipo de Dato	Descripción
foto_id	INT AUTO_INCREMENT	Clave primaria
tatuaje_id	INT	Clave foránea a Tatuajes
ruta_foto	VARCHAR(255)	Ruta de la foto
descripcion	VARCHAR(255)	Descripción de la foto
fecha_creacion	DATETIME	Fecha de creación
Relaciones:
Una Galeria_Foto pertenece a un Tatuaje.

6. Promociones
Descripción: Ofertas y promociones actuales.
Campo	Tipo de Dato	Descripción
promocion_id	INT AUTO_INCREMENT	Clave primaria
titulo	VARCHAR(100)	Título de la promoción
descripcion	TEXT	Descripción de la promoción
descuento	DECIMAL(5,2)	Porcentaje de descuento
fecha_inicio	DATE	Fecha de inicio
fecha_fin	DATE	Fecha de finalización
estado	ENUM('activo','inactivo')	Estado de la promoción
fecha_creacion	DATETIME	Fecha de creación

7. Testimonios
Descripción: Opiniones de los clientes.
Campo	Tipo de Dato	Descripción
testimonio_id	INT AUTO_INCREMENT	Clave primaria
nombre_cliente	VARCHAR(100)	Nombre del cliente
contenido	TEXT	Contenido del testimonio
foto_cliente	VARCHAR(255)	Ruta a la foto del cliente (opcional)
fecha_creacion	DATETIME	Fecha de creación

8. Membresias
Descripción: Planes de membresía disponibles.
Campo	Tipo de Dato	Descripción
membresia_id	INT AUTO_INCREMENT	Clave primaria
nombre	VARCHAR(100)	Nombre de la membresía
descripcion	TEXT	Descripción de la membresía
precio	DECIMAL(10,2)	Precio de la membresía
beneficios	TEXT	Beneficios incluidos
fecha_creacion	DATETIME	Fecha de creación

9. Citas
Descripción: Agenda de citas para los artistas.
Campo	Tipo de Dato	Descripción
cita_id	INT AUTO_INCREMENT	Clave primaria
usuario_id	INT	Clave foránea a Usuarios
artista_id	INT	Clave foránea a Artistas
fecha	DATETIME	Fecha y hora de la cita
estado	ENUM('pendiente','confirmada','completada','cancelada')	Estado de la cita
descripcion	TEXT	Descripción o notas adicionales
fecha_creacion	DATETIME	Fecha de creación
Relaciones:
Una Cita pertenece a un Usuario y a un Artista.

10. Cotizaciones
Descripción: Solicitudes de cotización de los clientes.
Campo	Tipo de Dato	Descripción
cotizacion_id	INT AUTO_INCREMENT	Clave primaria
usuario_id	INT	Clave foránea a Usuarios
artista_id	INT	Clave foránea a Artistas
tatuaje_id	INT	Clave foránea a Tatuajes
descripcion	TEXT	Descripción de la solicitud
precio_estimado	DECIMAL(10,2)	Precio estimado
estado	ENUM('pendiente','aceptada','rechazada')	Estado de la cotización
fecha_creacion	DATETIME	Fecha de creación
Relaciones:
Una Cotización pertenece a un Usuario, Artista y Tatuaje.

11. Tarjetas_Regalo
Descripción: Información sobre tarjetas de regalo.
Campo	Tipo de Dato	Descripción
tarjeta_id	INT AUTO_INCREMENT	Clave primaria
codigo	VARCHAR(50)	Código único de la tarjeta
valor	DECIMAL(10,2)	Valor de la tarjeta
estado	ENUM('activa','usada','expirada')	Estado de la tarjeta
fecha_emision	DATE	Fecha de emisión
fecha_expiracion	DATE	Fecha de expiración
fecha_creacion	DATETIME	Fecha de creación

12. Preguntas_Frecuentes
Descripción: Sección de preguntas frecuentes.
Campo	Tipo de Dato	Descripción
faq_id	INT AUTO_INCREMENT	Clave primaria
pregunta	VARCHAR(255)	Texto de la pregunta
respuesta	TEXT	Texto de la respuesta
categoria	VARCHAR(100)	Categoría a la que pertenece (opcional)
fecha_creacion	DATETIME	Fecha de creación

13. Cuidados_Tatuaje
Descripción: Información sobre el cuidado de tatuajes.
Campo	Tipo de Dato	Descripción
cuidado_id	INT AUTO_INCREMENT	Clave primaria
titulo	VARCHAR(100)	Título del cuidado
descripcion	TEXT	Descripción detallada
imagen	VARCHAR(255)	Ruta a una imagen ilustrativa (opcional)
fecha_creacion	DATETIME	Fecha de creación
14. Chatbot_Mensajes
Descripción: Registro de interacciones del chatbot.

Campo	Tipo de Dato	Descripción
mensaje_id	INT AUTO_INCREMENT	Clave primaria
usuario_id	INT	Clave foránea a Usuarios (opcional)
mensaje_usuario	TEXT	Mensaje enviado por el usuario
respuesta_bot	TEXT	Respuesta generada por el chatbot
fecha_hora	DATETIME	Fecha y hora de la interacción
15. Ventas_Articulos
Descripción: Información sobre los artículos vendidos.

Campo	Tipo de Dato	Descripción
articulo_id	INT AUTO_INCREMENT	Clave primaria
nombre	VARCHAR(100)	Nombre del artículo
descripcion	TEXT	Descripción del artículo
precio	DECIMAL(10,2)	Precio del artículo
stock	INT	Cantidad en stock
imagen	VARCHAR(255)	Ruta a la imagen del artículo
fecha_creacion	DATETIME	Fecha de creación

Relaciones Entre las Tablas
Usuarios pueden gestionar Citas, Cotizaciones, y otras entidades según su rol.
Artistas tienen múltiples Citas, Tatuajes, y pueden pertenecer a varias Categorias_Tatuajes.
Categorias_Tatuajes clasifican a los Tatuajes.
Tatuajes están asociados a Galeria_Fotos y Cotizaciones.
Promociones pueden estar asociadas a Tatuajes o Artistas si se desea.
Testimonios, Membresias, Tarjetas_Regalo, Preguntas_Frecuentes, Cuidados_Tatuaje, y Ventas_Articulos son entidades independientes que enriquecen el contenido del sitio.

