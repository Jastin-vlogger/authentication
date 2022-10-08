const form = document.querySelector('form');
const email = document.querySelector('input[type=email]');
const password = document.querySelector('input[type=password]');


form.addEventListener("submit" , onsubmit )

function onsubmit(event){
    event.preventDefault();
    if(email.value === "" || password.value ===""){
        document.getElementById("emailmsg").style.display=""
        return false;
    } else{
        form.submit();
    }
}