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
        })
        .catch((err)=>{
            console.warn('err');
        })
        .finally(()=>{
            console.log('Конец');
        });

});