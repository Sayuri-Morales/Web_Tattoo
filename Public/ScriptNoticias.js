// Define tu API Key de YouTube
const apiKey = 'AIzaSyAGHtXNp5vinaMk2y_NJyF-i6dW7VfuLrE';

// Define el término de búsqueda
const temaBusqueda = 'Mejores tatuajes del mundo';

// URL para la solicitud de búsqueda
const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${temaBusqueda}&type=video&maxResults=10&key=${apiKey}`;

// Realizar la solicitud HTTP usando fetch
fetch(url)
  .then(response => response.json())
  .then(data => {
    // Mostrar los resultados de la búsqueda
    console.log(data.items); // Esto contiene los videos encontrados

    // Aquí puedes procesar los datos y mostrarlos en tu página web
    data.items.forEach(video => {
      const videoId = video.id.videoId;
      const title = video.snippet.title;
      const description = video.snippet.description;
      const thumbnail = video.snippet.thumbnails.high.url;

      // Crear elementos HTML para mostrar el video
      const videoElement = document.createElement('div');
      videoElement.innerHTML = `
        <h3>${title}</h3>
        <img src="${thumbnail}" alt="${title}">
        <p>${description}</p>
        <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">Ver video</a>
      `;
      
      // Agregar el video al cuerpo de la página
      document.body.appendChild(videoElement);
    });
  })
  .catch(error => console.error('Error al obtener los videos:', error));