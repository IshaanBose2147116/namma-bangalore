var phone = document.getElementById('Phone-No');
var password= document.getElementById('password');
var span = document.getElementsByTagName('span');
function testphone(event) {
    let code = event.which;
    if (code > 57 && code < 91) {
        span[0].innerText = "alphabets not allowed!";
        span[0].style.color = "red";
        return false;
      
    }
      else
       return true;
        
    
}

function scrollToTop() {
    window.scrollTo(0, 0);
  }

function validate() {
    if (phone.value == ""  || password.value == "" ) {
      span[1].innerText= "*Mandatory";
      span[1].style.color="red";
      span
      phone.style.border = "2px red solid"; 
      password.style.border="2px red solid";
      

      scrollToTop();
      validatePhone();
  
    }
    else {
      window.open("./index.html", "_self")
    }
  }





function validatePhone() {
    const regex_num = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    if (phone.value.trim() == "" || phone.value.trim() == null) {
        span[0].innerText = "Blank Space not allowed";
        span[0].style.color = "red";
        phone.style.border = "2px red solid";
        return false;
    }
    if (regex_num.test(phone.value)) {

        span[0].innerText = "Your number is Valid!";
        span[0].style.color = "lime";
        phone.style.border = "2px lime solid";
    }
    else {
        span[0].innertext = "Invalid Phone number";
        span[0].style.color = "red";
        phone.style.border = "2px red solid";
    }
}

