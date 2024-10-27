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
    });
});

// Restauramos la imagen original cuando el cursor sale de `product-container`
const productContainer = document.querySelector('.product-container');
productContainer.addEventListener('mouseleave', () => {
    mainImage.src = originalSrc;
});
