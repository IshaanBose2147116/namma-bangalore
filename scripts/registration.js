import ServerAPI from "./server_api.js";

var fullname = document.getElementById('fullname');
var email = document.getElementById('email');
var password = document.getElementById('password');
var phone = document.getElementById('phone');
var adhaar = document.getElementById('adhaarnumber');
var address1 = document.getElementById('address-1');
var address2 = document.getElementById('address-2');
var address3 = document.getElementById('address-3');
var pincode = document.getElementById('pincode');
var span = document.getElementsByTagName('span');

fullname.onkeyup = validateName; fullname.onkeydown = event => {
  if (event.which > 47 && event.which < 58 && event.key !== 'Backspace') {
    event.preventDefault();
  }
};
email.onkeyup = validateEmail;
phone.onkeyup = validatePhone; phone.onkeydown = event => {
  if ((event.which > 58 || event.which < 47) && event.key !== 'Backspace') {
    event.preventDefault();
  }
};
password.onkeyup = validatePassword;
adhaar.onkeyup = validateadhaar; adhaar.onkeydown = event => {
  if ((event.which > 58 || event.which < 47) && event.key !== 'Backspace') {
    event.preventDefault();
  }
}
address1.onkeyup = validateaddress;
pincode.onkeyup = validatePincode; pincode.onkeydown = event => {
  if ((event.which > 58 || event.which < 47) && event.key !== 'Backspace') {
    event.preventDefault();
  }
}

document.getElementById("reg-form").onsubmit = event => {
  event.preventDefault();
  validate();
}

function testphone(event) {
  let pcode = event.which;
  if (pcode > 58 && pcode < 47) {
    span[2].innerText = "characters not allowed!!";
    span[2].style.color = "red";
  }
}

function scrollToTop() {
  window.scrollTo(0, 0);
}

function validate()
{
  if (document.getElementById("guRadio").checked) {
    if (validateName() && validatePhone() && validateEmail() && validatePassword()) {
      var name = document.getElementById("fullname").value.trim();
      name = name.split(' ');

      if (name.length <= 2) {
        name.splice(1, 0, null);

        if (name.length == 2) {
          name.splice(1, 0, null);
        }
      }

      ServerAPI.registerGeneralUser(
        email.value, password.value, phone.value, name[0], name[1], name[2], response => {
          if (response.status === 200) {
            window.open('/login', "_self");
          } else if (response.status === 400) {
            console.log(response);
            if (response.errCode === 1000) {
              span[3].innerText = "Email already registered!";
              span[3].style.color = "red";
              email.style.border = "1px red solid";
              console.log("here");
            } else {
              span[4].innerText = "Phone number already registered!";
              span[4].style.color = "red";
              phone.style.border = "1px red solid";
              console.log("here1");
            }
          } else {
            console.log(response);
            alert("Internal server error! Please try again later.");
          }
        });
    }
  } else {
    if (validateName() && validatePhone() && validateEmail() && validatePassword() && validateaddress() && validateadhaar()) {
      ServerAPI.registerLocalBusiness(
        email.value, password.value, phone.value, address1.value, address2.value, address3.value, pincode.value, fullname.value, adhaar.value, response => {
          if (response.status === 200) {
            window.open('/login', "_self");
          } else if (response.status === 400) {
            if (response.errCode === 1000) {
              span[1].innerText = "Email already registered!";
              span[1].style.color = "red";
              email.style.border = "1px red solid";
            } else {
              span[2].innerText = "Phone number already registered!";
              span[2].style.color = "red";
              phone.style.border = "1px red solid";
            }
          } else {
            console.log(response);
            alert("Internal server error! Please try again later.");
          }
        });
    }
  }
}

function validateName() {
  const regex = /^([a-zA-Z]+\s){1,3}$/;
  var name = fullname.value.trim();

  if (name == "" || name == null) {
    span[0].innerText = "*mandatory";
    span[0].style.color = "red";
    fullname.style.border = "1px red solid";
    return false;
  }

  if (regex.test(name + " ")) {
    span[0].innerText = "Valid Name!";
    span[0].style.color = "lime";
    fullname.style.border = "1px lime solid";
    return true;
  }

  span[0].innerText = "Invalid Name!";
  span[0].style.color = "red";
  fullname.style.border = "1px red solid";

  return false;
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
    return true;
  }

  span[2].innertext = "Invalid Phone number";
  span[2].style.color = "red";
  phone.style.border = "1px red solid";
  
  return false;
}

//^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$/
function validatePassword() {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,30}$/;

  if (password.value.trim() == "" || password.value.trim() == null) {
    span[3].innerText = "*mandatory";
    span[3].style.color = "red";
    password.style.border = "1px red solid";

    return false;
  }

  if (regex.test(password.value.trim())) {
      span[3].innerText = "Strong Password!";
      span[3].style.color = "lime";
      password.style.border = "1px lime solid";

      return true;
  }
  else if (password.value.trim().length > 30) {
      span[3].innerText = "Too long password!";
      span[3].style.color = "red";
      password.style.border = "1px red solid";
      
      return false;
  }
  else {
    span[3].innerText = "Weak Password!";
    span[3].style.color = "orange";
    password.style.border = "1px orange solid";

    return true;
  }
}

function validateEmail() {
  const regex = /^.+@.+\.[a-z]{2,3}$/;


  if (email.value.trim() == "" || email.value.trim() == null) {
    span[1].innerText = "*mandatory";
    span[1].style.color = "red";
    email.style.border = "1px red solid";

    return true;
  }
  if (regex.test(email.value.trim())) {
    span[1].innerText = "Valid Email!";
    span[1].style.color = "lime";
    email.style.border = "1px lime solid";
    
    return true;
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
  if (adhaar.value.trim() == "" || adhaar.value.trim() == null) {
    span[4].innerText = "*i";
    span[4].style.color = "red";
    adhaar.style.border = "1px red solid";

    return false;
  }
  if (adhaar.value.length === 12) {
    span[4].innerText = "Adhaar number is Valid!";
    span[4].style.color = "lime";
    adhaar.style.border = "1px lime solid";
    
    return true;
  }

  span[4].innerText = "Invalid aadhaar number!";
  span[4].style.color = "red";
  adhaar.style.border = "1px red solid";
  
  return false;
}

function validateaddress() {
  if (address1.value == "" || address1.value == null) {
    span[5].innerText = "Blank Space not allowed";
    span[5].style.color = "red";
    address1.style.border = "1px red solid";
    return false;
  }

  span[5].innerText = "Address is Valid!";
  span[5].style.color = "lime";
  address1.style.border = "1px lime solid";

  return true;
}

function validatePincode() {
  if (pincode.value == "" || pincode.value == null) {
    span[8].innerText = "Blank Space not allowed";
    span[8].style.color = "red";
    pincode.style.border = "1px red solid";
    return false;
  }
  
  if (pincode.value.includes('-')) {
    span[8].innerText = "Negative numbers not allowed";
    span[8].style.color = "red";
    pincode.style.border = "1px red solid";
    return false;
  }

  span[8].innerText = "Pincode is Valid!";
  span[8].style.color = "lime";
  pincode.style.border = "1px lime solid";

  return true;
}