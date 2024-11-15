
        // Obtener el combobox de categorías y el contenedor de preguntas
        const categoriasComboBox = document.getElementById('categoriasComboBoxPreguntas');
        const preguntasContainer = document.getElementById('preguntas-container');
        const newQuestionForm = document.getElementById('new-question-form');

        // Función para cargar categorías
        async function cargarCategorias() {
            try {
                const response = await fetch('/api/categoriasPreguntas');
                if (!response.ok) {
                    throw new Error('Error al cargar categorías');
                }
                const categorias = await response.json();

                // Limpiar el combobox
                categoriasComboBox.innerHTML = '<option value="">Selecciona una Categoría</option>';

                // Llenar el combobox de categorías
                categorias.forEach(categoria => {
                    const option = document.createElement('option');
                    option.value = categoria;
                    option.textContent = categoria;
                    categoriasComboBox.appendChild(option);
                });

                cargarPreguntas();  // Cargar preguntas
            } catch (error) {
                console.error('Error al cargar categorías:', error);
            }
        }

        // Cargar las preguntas frecuentes
        async function cargarPreguntas(categoria = '') {
            try {
                const response = await fetch(`/api/preguntas?categoria=${categoria}`);
                const preguntas = await response.json();

                // Limpiar las preguntas previas
                preguntasContainer.innerHTML = '';

                // Mostrar las preguntas
                preguntas.forEach(pregunta => {
                    const div = document.createElement('div');
                    div.classList.add('faq');
                    div.innerHTML = `
                        <strong>${pregunta.pregunta}</strong><br>
                        <p><strong>Respuesta:</strong> ${pregunta.respuesta}</p>
                    `;
                    preguntasContainer.appendChild(div);
                });
            } catch (error) {
                console.error('Error al cargar preguntas:', error);
            }
        }

        // Filtrar preguntas cuando se selecciona una categoría
        categoriasComboBox.addEventListener('change', (event) => {
            const categoriaSeleccionada = event.target.value;
            cargarPreguntas(categoriaSeleccionada);  // Filtrar por categoría
        });

        newQuestionForm.addEventListener('submit', async (event) => {
            event.preventDefault();
        
            // Obtener la pregunta
            const preguntaInput = document.getElementById('new-question');
            const pregunta = preguntaInput.value.trim();
        
            // Validar que la pregunta no esté vacía
            if (!pregunta) {
                alert('Por favor, ingresa una pregunta válida.');
                return;
            }
        
            try {
                // Enviar la nueva pregunta con el estado "pendiente"
                const response = await fetch('/api/agregar-pregunta', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ pregunta, estado: 'pendiente' }),  // Se agrega el estado
                });
        
                const data = await response.json();
        
                if (data.success) {
                    alert('Pregunta enviada con éxito');
                    preguntaInput.value = '';  // Limpiar el campo
                    cargarPreguntas();  // Recargar preguntas
                } else {
                    alert('Hubo un error al enviar la pregunta');
                }
            } catch (error) {
                console.error('Error al enviar la pregunta:', error);
            }
        });

        // Llamar la función para cargar las categorías al cargar la página
        document.addEventListener('DOMContentLoaded', cargarCategorias);
