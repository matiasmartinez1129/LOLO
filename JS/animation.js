document.addEventListener('DOMContentLoaded', function () {
    const thanksSection = document.getElementById('thanks-section');
    const h1 = thanksSection.querySelector('h1');  // Seleccionamos el h1 dentro de la sección

    function checkVisibility() {
        const rect = thanksSection.getBoundingClientRect(); // Obtenemos la posición de la sección
        const windowHeight = window.innerHeight;

        // Si el top del contenedor está dentro del viewport (80% visible)
        if (rect.top <= windowHeight * 0.8) {
            h1.classList.add('animate');  // Añadimos la clase 'animate' para activar la animación
        }
    }

    // Revisamos la visibilidad al hacer scroll
    window.addEventListener('scroll', checkVisibility);

    // Verificamos la visibilidad cuando se carga la página
    checkVisibility();
});


