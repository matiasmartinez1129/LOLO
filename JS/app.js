// Seleccionamos las miniaturas y la imagen principal
const thumbnails = document.querySelectorAll('.thumbnail');
const mainImage = document.getElementById('main-image');

// Guardamos el `src` original de la imagen principal
const originalSrc = mainImage.src;

// Añadimos un evento de clic a cada miniatura
thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener('click', () => {
        // Cambia el src de la imagen principal al de la miniatura seleccionada
        mainImage.src = thumbnail.src;

        // Inicia el temporizador de 3 segundos para volver a la imagen original
        setTimeout(() => {
            mainImage.src = originalSrc;
        }, 3000); // 3000 milisegundos = 3 segundos
    });
});
