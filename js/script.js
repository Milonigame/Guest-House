const TOKEN = "6190534304:AAExBy7_bP4uHfQlObJTrLU60CT-hCtkDcY",
     CHAT_ID = "-1001777196683",
     URL_API=`https://api.telegram.org/bot${ TOKEN }/sendMessage`,
     success=document.getElementById('success');
     





 document.getElementById('tg').addEventListener('submit', function (e){
    e.preventDefault();
   
    let message =`<b>Заявка с сайта!</b>\n`;
        message +=`<b>Отправитель:</b> ${this.name.value}\n`;
        message +=`<b>Почта:</b> ${this.email.value}\n`;
        message +=`<b>Номер телефона:</b> ${this.phone.value}`;
        
        window.axios.post(URL_API, {
            chat_id:CHAT_ID,
            parse_mode:'html',
            text:message
        })
        .then((res)=>{
            this.name.value="";
            this.email.value="";
            this.phone.value="";
            success.innerHTML="Заявка принята, скоро с вами свяжутся!";
            success.style.display="block";
            setTimeout(()=>{
                success.remove();
            },2300);

            
        })
        .catch((err)=>{
            console.warn('err');
        })
        .finally(()=>{
            console.log('Конец');
        });

});
// CЛАЙДЕР КОМНАТ//

let slideIndex = 1;
const slides = document.querySelectorAll('.offer__slide'),
    prev = document.querySelector('.offer__slider-prev'),
    next = document.querySelector('.offer__slider-next'),
    total = document.querySelector('#total'),
    current = document.querySelector('#current');

showSlides(slideIndex);

// if (slides.length < 10) {
//     total.textContent = `0${slides.length}`;
// } else {
//     total.textContent = slides.length;
// }

function showSlides(n) {
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }

    function slideHide(){
        slides.forEach(item =>{
            item.classList.add('hide');
            item.classList.remove('show');
        });
        }
        slides.forEach((item) => item.style.display = 'none');

        slides[slideIndex - 1].style.display = 'block'; // Как ваша самостоятельная работа - переписать на использование классов show/hide
    
   
    if (slides.length < 10) {
        current.textContent =  `0${slideIndex}`;
    } else {
        current.textContent =  slideIndex;
    }
}

function plusSlides (n) {
    showSlides(slideIndex += n);
}

prev.addEventListener('click', function(){
    plusSlides(-1);
});

next.addEventListener('click', function(){
    plusSlides(1);
});


// about us slider

$(document).ready(function(){
$('.slider').slick({

    arrows:true,
    dots:true
});

});

