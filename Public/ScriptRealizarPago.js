document.getElementById('formPago').addEventListener('submit', function(event) {
    event.preventDefault();

    const numeroTarjeta = document.getElementById('numeroTarjeta').value;
    const cvv = document.getElementById('cvv').value;
    const fechaVencimiento = document.getElementById('fechaVencimiento').value;
    const correo = document.getElementById('correo').value;  // Obtener el correo electrónico

    const datosPago = {
        numeroTarjeta,
        cvv,
        fechaVencimiento,
        correo  // Incluir correo en los datos que se envían
    };

    // Enviar los datos al servidor (suponiendo que tienes una ruta API para manejar el pago)
    fetch('/api/procesarPago', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosPago)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Pago procesado con éxito');
        } else {
            alert('Hubo un error procesando el pago');
        }
    })
    .catch(error => {
        console.error('Error al procesar el pago:', error);
    });
});