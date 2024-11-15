// Cargar tatuadores en el comboBox
fetch('/api/artistasAgenda')
    .then(response => response.json())
    .then(data => {
        const tatuadoresComboBox = document.getElementById('artistasAgendaComboBox');
        data.forEach(tatuador => {
            const option = document.createElement('option');
            option.value = tatuador.artista_id;
            option.textContent = tatuador.nombre;
            tatuadoresComboBox.appendChild(option);
        });
    })
    .catch(error => console.error('Error cargando tatuadores:', error));

// Manejar el envío de la cita
document.getElementById('agendarCitaBtn').addEventListener('click', function(event) {
    event.preventDefault();

    const artistaId = document.getElementById('artistasAgendaComboBox').value;
    const fechaCita = document.getElementById('fechaCita').value;
    const correo = document.getElementById('correoAgenda').value;
    const descripcion = document.getElementById('descripcionAgenda').value;

    // Validar campos
    if (!artistaId || !fechaCita || !correo || !descripcion) {
        alert("Por favor complete todos los campos.");
        return;
    }

    // Obtener el usuario_id mediante el correo
    fetch(`/api/usuarioPorCorreo?correo=${correo}`)
        .then(response => response.json())
        .then(usuario => {
            if (!usuario) {
                alert("Usuario no encontrado.");
                return;
            }

            const usuarioId = usuario.usuario_id;

            // Enviar los datos de la cita al servidor
            fetch('/api/agendarCita', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuario_id: usuarioId,
                    artista_id: artistaId,
                    fecha: fechaCita,
                    descripcion: descripcion,
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Cita agendada con éxito.");
                } else {
                    alert("Error al agendar la cita.");
                }
            })
            .catch(error => console.error('Error al agendar la cita:', error));
        })
        .catch(error => console.error('Error al obtener usuario:', error));
});