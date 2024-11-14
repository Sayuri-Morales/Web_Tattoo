// Función para agregar mensajes al chat
function addMessage(content, sender) {
    const chatBox = document.getElementById('chat-box');
    const message = document.createElement('div');
    message.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    message.innerText = content;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight; // Desplazar hacia abajo
}

// Función para generar botones de respuesta
function addResponseButtons(options) {
    const buttonContainer = document.getElementById('response-buttons');
    buttonContainer.innerHTML = ''; // Limpiar botones anteriores

    options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option.text;
        button.onclick = () => handleUserResponse(option.value);
        buttonContainer.appendChild(button);
    });
}

// Lógica del chatbot: respuestas según la selección del usuario
function handleUserResponse(responseValue) {
    addMessage(responseValue, 'user');
    
    // Procesar respuesta según el valor de la opción seleccionada
    if (responseValue === 'saludo') {
        botResponse('¡Hola! ¿Te gustaría saber más sobre tatuajes?', [
            { text: 'Sí, quiero saber sobre diseños', value: 'diseños' },
            { text: 'Sí, quiero saber más sobre precios', value: 'precios' },
            { text: 'Quiero ver algunos ejemplos', value: 'ejemplos' }
        ]);
    } else if (responseValue === 'diseños') {
        botResponse('Tenemos muchos tipos de diseños. ¿Te gustaría saber más sobre alguno en particular?', [
            { text: 'Tatuajes tradicionales', value: 'tradicional' },
            { text: 'Tatuajes geométricos', value: 'geometrico' },
            { text: 'Tatuajes minimalistas', value: 'minimalista' },
            { text: 'Volver al inicio', value: 'saludo' }
        ]);
    } else if (responseValue === 'precios') {
        botResponse('Nuestros precios dependen del diseño y la complejidad. ¿Te gustaría saber más sobre precios por tipo de tatuaje?', [
            { text: 'Precios para tatuajes pequeños', value: 'pequeños' },
            { text: 'Precios para tatuajes grandes', value: 'grandes' },
            { text: 'Volver al inicio', value: 'saludo' }
        ]);
    } else if (responseValue === 'ejemplos') {
        botResponse('Aquí tienes algunos ejemplos de tatuajes que hemos realizado. ¿Te gustaría ver más?', [
            { text: 'Sí, quiero ver más ejemplos', value: 'ver_mas' },
            { text: 'Volver al inicio', value: 'saludo' }
        ]);
    } else if (responseValue === 'tradicional') {
        botResponse('Los tatuajes tradicionales son muy populares, con colores vibrantes y líneas definidas. ¿Te gustaría conocer más detalles?', [
            { text: 'Sí, quiero más información', value: 'informacion_tradicional' },
            { text: 'Volver al inicio', value: 'saludo' }
        ]);
    } else if (responseValue === 'informacion_tradicional') {
        botResponse('Los tatuajes tradicionales son conocidos por sus diseños vintage, como calaveras, anclas, flores, etc. ¿Te gustaría ver algunos ejemplos?', [
            { text: 'Sí, mostrar ejemplos', value: 'ejemplos_tradicional' },
            { text: 'Volver al inicio', value: 'saludo' }
        ]);
    } else if (responseValue === 'geometrico') {
        botResponse('Los tatuajes geométricos son muy modernos y utilizan formas y líneas precisas. ¿Te gustaría saber más sobre este estilo?', [
            { text: 'Sí, quiero más detalles', value: 'informacion_geometrico' },
            { text: 'Volver al inicio', value: 'saludo' }
        ]);
    } else if (responseValue === 'informacion_geometrico') {
        botResponse('Los tatuajes geométricos combinan patrones y formas simétricas. Son perfectos para personas que aman el arte abstracto. ¿Te gustaría ver ejemplos?', [
            { text: 'Sí, mostrar ejemplos', value: 'ejemplos_geometrico' },
            { text: 'Volver al inicio', value: 'saludo' }
        ]);
    } else if (responseValue === 'minimalista') {
        botResponse('Los tatuajes minimalistas utilizan pocos detalles y formas sencillas. ¿Te gustaría saber más?', [
            { text: 'Sí, quiero más detalles', value: 'informacion_minimalista' },
            { text: 'Volver al inicio', value: 'saludo' }
        ]);
    } else if (responseValue === 'informacion_minimalista') {
        botResponse('Los tatuajes minimalistas se caracterizan por líneas finas y detalles simples. Son ideales para aquellos que buscan algo sutil y elegante. ¿Te gustaría ver ejemplos?', [
            { text: 'Sí, mostrar ejemplos', value: 'ejemplos_minimalista' },
            { text: 'Volver al inicio', value: 'saludo' }
        ]);
    } else if (responseValue === 'pequeños') {
        botResponse('Los tatuajes pequeños generalmente cuestan entre $50 y $150. ¿Te gustaría saber más sobre este tipo de tatuajes?', [
            { text: 'Sí, quiero más detalles', value: 'detalles_pequeños' },
            { text: 'Volver al inicio', value: 'saludo' }
        ]);
    } else if (responseValue === 'detalles_pequeños') {
        botResponse('Los tatuajes pequeños son perfectos para lugares como muñecas, tobillos y cuello. ¿Te gustaría ver ejemplos de tatuajes pequeños?', [
            { text: 'Sí, mostrar ejemplos', value: 'ejemplos_pequeños' },
            { text: 'Volver al inicio', value: 'saludo' }
        ]);
    } else if (responseValue === 'grandes') {
        botResponse('Los tatuajes grandes, como los que cubren brazos o espalda, generalmente cuestan entre $200 y $500. ¿Te gustaría saber más?', [
            { text: 'Sí, quiero más detalles', value: 'detalles_grandes' },
            { text: 'Volver al inicio', value: 'saludo' }
        ]);
    } else if (responseValue === 'detalles_grandes') {
        botResponse('Los tatuajes grandes requieren más tiempo y detalle. Se suelen hacer en sesiones múltiples. ¿Te gustaría ver ejemplos de tatuajes grandes?', [
            { text: 'Sí, mostrar ejemplos', value: 'ejemplos_grandes' },
            { text: 'Volver al inicio', value: 'saludo' }
        ]);
    } else if (responseValue === 'ver_mas') {
        botResponse('Aquí tienes más ejemplos de tatuajes. ¿Te gustaría hacer una cita para tu tatuaje?', [
            { text: 'Sí, hacer una cita', value: 'cita' },
            { text: 'Volver al inicio', value: 'saludo' }
        ]);
    } else if (responseValue === 'cita') {
        botResponse('Para agendar tu cita, por favor contacta a nuestro estudio de tatuajes. ¡Te esperamos!', []);
    }
}

// Función para generar una respuesta del bot
function botResponse(message, options = []) {
    addMessage(message, 'bot');
    addResponseButtons(options);
}

// Iniciar la conversación
function startChat() {
    botResponse('¡Hola! Soy tu asistente virtual de tatuajes. ¿En qué te puedo ayudar hoy?', [
        { text: 'Quiero saber sobre tatuajes', value: 'saludo' }
    ]);
}

// Iniciar chat al cargar la página
window.onload = startChat;
