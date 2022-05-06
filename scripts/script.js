import ServerAPI from "./server_api.js";


var fullname = document.getElementById('fullname');
var email = document.getElementById('email');
var password = document.getElementById('password');
var phone = document.getElementById('phone');
var adhaar = document.getElementById('adhaarnumber');
var address= document.getElementById('address');
var span = document.getElementsByTagName('span');

function testname(event) {
  let code = event.which;
  if (code > 47 && code < 58) {
    span[0].innerText = "Numkey not allowed!";
    span[0].style.color = "red";
    return false;
  }

  else
    return true;

}

function testphone(event) {
  let pcode = event.which;
  if (pcode > 58 && pcode < 47) {
    span[2].innerText = "characters not allowed!!";
    span[2].style.color = "red";
    return false;
  }

  else
    return true;

}

function scrollToTop() {
  window.scrollTo(0, 0);
}

function validate() {
  if (fullname.value == "" || email.value == "" || password.value == "" || phone.value == "" ) {
    scrollToTop();
    validateName();
    validateaddress();
    

  }
  else {
    window.open("./registration.html", "_self")
  }
}

function validateName() {
  const regex = /^[(A-Za-z\s.)]+$/;
  if (fullname.value.trim() == "" || fullname.value.trim() == null) {
    span[0].innerText = "*mandatory";
    span[0].style.color = "red";
    fullname.style.border = "1px red solid";
    validateEmail();
    validatePhone();
   
  }
  else if (regex.test(fullname.value.trim())) {
    span[0].innerText = "Valid Name!";
    span[0].style.color = "lime";
    fullname.style.border = "1px lime solid";
    validateEmail();
  }
  else {
    span[0].innerText = "Invalid Name!";
    span[0].style.color = "red";
    fullname.style.border = "1px red solid";
    return false;
  }
}

function validatePhone() {
  const regex_num = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  if (phone.value.trim() == "" || phone.value.trim() == null) {
    span[2].innerText = "*mandatory";
    span[2].style.color = "red";
    phone.style.border = "1px red solid";
    return false;
  }
  if (regex_num.test(phone.value)) {

    span[2].innerText = "Your number is Valid!";
    span[2].style.color = "lime";
    phone.style.border = "1px lime solid";
  }
  else {
    span[2].innertext = "Invalid Phone number";
    span[2].style.color = "red";
    phone.style.border = "1px red solid";
  }

}







//^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$/

function validatePassword() {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,20})/;
  if (password.value.trim() == "" || password.value.trim() == null) {
    span[3].innerText = "*mandatory";
    span[3].style.color = "red";
    password.style.border = "1px red solid";
    return false;
  }
  else if (regex.test(password.value.trim())) {
    if (password.value.trim().length >= 8 && password.value.trim().length <= 15) {
      span[3].innerText = "Strong Password!";
      span[3].style.color = "lime";
      password.style.border = "1px lime solid";
      return true;
    }

    else {
      span[3].innerText = "Too long password!";
      span[3].style.color = "red";
      password.style.border = "1px red solid";
      return false;
    }
  }
  else if (password.value.trim().length < 8) {
    span[3].innerText = "Weak Password!";
    span[3].style.color = "orange";
    password.style.border = "1px orange solid";
    return false;
    validatePhone();
  }
  else {
    span[3].innerText = "Invalid!";
    span[3].style.color = "red";
    password.style.border = "1px red solid";
    return false;
    validatePhone();
  }
}


function validateEmail() {
  //const regex = /^\w+([\.-]?\w+)+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


  if (email.value.trim() == "" || email.value.trim() == null) {
    span[1].innerText ="*mandatory";
    span[1].style.color = "red";
    email.style.border = "1px red solid";
    validatePassword();

  }
  if (regex.test(email.value.trim())) {
    span[1].innerText = "Valid Email!";
    span[1].style.color = "lime";
    email.style.border = "1px lime solid";
    validatePassword();
  }
  else {
    span[1].innerText = "Invalid Email!";
    span[1].style.color = "red";
    email.style.border = "1px red solid";
    return false;
  }
}


// hereby validating adhaar no..
function validateadhaar() {
  adreg = /^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$/;
  if (adhaar.value.trim() == "" || adhaar.value.trim() == null) {
    span[4].innerText = "*mandatory";
    span[4].style.color = "red";
    adhaar.style.border = "1px red solid";
    return false;
  }
  if (adreg.test(adhaar.value)) {

    span[4].innerText = "Adhaar number is Valid!";
    span[4].style.color = "lime";
    adhaar.style.border = "1px lime solid";
    validateaddress();
  }
  else {
    span[4].innertext = "Invalid Adhaar number";
    span[4].style.color = "red";
    adhaar.style.border = "1px red solid";
    return false;
  }

}
 
function validateaddress()
{
  if (address.value == "" || address.value == null) {
    span[5].innerText = "Blank Space not allowed";
    span[5].style.color = "red";
    adhaar.style.border = "1px red solid";
    return false;
  }

  else
   return true;
}
 
