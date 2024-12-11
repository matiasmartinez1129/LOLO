document.addEventListener('DOMContentLoaded', function () {
    const thanksSection = document.getElementById('thanks-section');
    const h1 = thanksSection.querySelector('h1'); 

    function checkVisibility() {
        const rect = thanksSection.getBoundingClientRect(); 
        const windowHeight = window.innerHeight;

        
        if (rect.top <= windowHeight * 0.8) {
            h1.classList.add('animate');  
        }
    }

   
    window.addEventListener('scroll', checkVisibility);

   
    checkVisibility();
});


