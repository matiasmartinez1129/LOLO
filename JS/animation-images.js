const thumbnails = document.querySelectorAll('.thumbnail');
const mainImage = document.getElementById('main-image');

const originalSrc = mainImage.src;


thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener('click', () => {
    
        mainImage.src = thumbnail.src;

       
        setTimeout(() => {
            mainImage.src = originalSrc;
        }, 3000); 
    });
});

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}




