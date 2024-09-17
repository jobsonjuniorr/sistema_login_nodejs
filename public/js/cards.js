document.querySelectorAll('.box-container .box').forEach(card => {
    card.addEventListener('click', function() {
        const description = card.querySelector('.ttt');
        if (description) {
            if (description.classList.contains('active')) {
               
                description.classList.remove('active');
                setTimeout(() => {
                    description.style.maxHeight = '0'; 
                    description.style.opacity = '0';
                }, 10);
            } else {
                description.style.maxHeight = '150px'; 
                description.style.opacity = '1';
                setTimeout(() => {
                    description.classList.add('active');
                }, 10);
            }
        }
    });
});
