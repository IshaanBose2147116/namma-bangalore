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
				document.getElementById("email-err").innerText = "Email already registered!";
				document.getElementById("email-err").style.color = "red";
				email.style.border = "1px red solid";
				console.log("here");
            } else {
				document.getElementById("phone-err").innerText = "Phone number already registered!";
				document.getElementById("phone-err").style.color = "red";
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
              document.getElementById("email-err").innerText = "Email already registered!";
              document.getElementById("email-err").style.color = "red";
              email.style.border = "1px red solid";
            } else {
              document.getElementById("phone-err").innerText = "Phone number already registered!";
              document.getElementById("phone-err").style.color = "red";
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
    document.getElementById("name-err").innerText = "*mandatory";
    document.getElementById("name-err").style.color = "red";
    fullname.style.border = "1px red solid";
    return false;
  }

  if (regex.test(name + " ")) {
    document.getElementById("name-err").innerText = "Valid Name!";
    document.getElementById("name-err").style.color = "lime";
    fullname.style.border = "1px lime solid";
    return true;
  }

  document.getElementById("name-err").innerText = "Invalid Name!";
  document.getElementById("name-err").style.color = "red";
  fullname.style.border = "1px red solid";

  return false;
}

function validatePhone() {
  const regex_num = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

  if (phone.value.trim() == "" || phone.value.trim() == null) {
    document.getElementById("phone-err").innerText = "*mandatory";
    document.getElementById("phone-err").style.color = "red";
    phone.style.border = "1px red solid";
    return false;
  }

  if (regex_num.test(phone.value)) {
    document.getElementById("phone-err").innerText = "Your number is Valid!";
    document.getElementById("phone-err").style.color = "lime";
    phone.style.border = "1px lime solid";
    return true;
  }

  document.getElementById("phone-err").innertext = "Invalid Phone number";
  document.getElementById("phone-err").style.color = "red";
  phone.style.border = "1px red solid";
  
  return false;
}

//^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$/
function validatePassword() {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,30}$/;

  if (password.value.trim() == "" || password.value.trim() == null) {
    document.getElementById("strengthDisplay").innerText = "*mandatory";
    document.getElementById("strengthDisplay").style.color = "red";
    password.style.border = "1px red solid";

    return false;
  }

  if (regex.test(password.value.trim())) {
      document.getElementById("strengthDisplay").innerText = "Strong Password!";
      document.getElementById("strengthDisplay").style.color = "lime";
      password.style.border = "1px lime solid";

      return true;
  }
  else if (password.value.trim().length > 30) {
      document.getElementById("strengthDisplay").innerText = "Too long password!";
      document.getElementById("strengthDisplay").style.color = "red";
      password.style.border = "1px red solid";
      
      return false;
  }
  else {
    document.getElementById("strengthDisplay").innerText = "Weak Password!";
    document.getElementById("strengthDisplay").style.color = "orange";
    password.style.border = "1px orange solid";

    return true;
  }
}

function validateEmail() {
  const regex = /^.+@.+\.[a-z]{2,3}$/;


  if (email.value.trim() == "" || email.value.trim() == null) {
    document.getElementById("email-err").innerText = "*mandatory";
    document.getElementById("email-err").style.color = "red";
    email.style.border = "1px red solid";

    return true;
  }
  if (regex.test(email.value.trim())) {
    document.getElementById("email-err").innerText = "Valid Email!";
    document.getElementById("email-err").style.color = "lime";
    email.style.border = "1px lime solid";
    
    return true;
  }
  else {
    document.getElementById("email-err").innerText = "Invalid Email!";
    document.getElementById("email-err").style.color = "red";
    email.style.border = "1px red solid";

    return false;
  }
}

// hereby validating adhaar no..
function validateadhaar() {
  if (adhaar.value.trim() == "" || adhaar.value.trim() == null) {
    document.getElementById("aadhaar-err").innerText = "*mandatory";
    document.getElementById("aadhaar-err").style.color = "red";
    adhaar.style.border = "1px red solid";

    return false;
  }
  if (adhaar.value.length === 12) {
    document.getElementById("aadhaar-err").innerText = "Adhaar number is Valid!";
    document.getElementById("aadhaar-err").style.color = "lime";
    adhaar.style.border = "1px lime solid";
    
    return true;
  }

  document.getElementById("aadhaar-err").innerText = "Invalid aadhaar number!";
  document.getElementById("aadhaar-err").style.color = "red";
  adhaar.style.border = "1px red solid";
  
  return false;
}

function validateaddress() {
  if (address1.value == "" || address1.value == null) {
    document.getElementById("address-err").innerText = "*mandatory";
    document.getElementById("address-err").style.color = "red";
    address1.style.border = "1px red solid";
    return false;
  }

  document.getElementById("address-err").innerText = "Address is Valid!";
  document.getElementById("address-err").style.color = "lime";
  address1.style.border = "1px lime solid";

  return true;
}

function validatePincode() {
  if (pincode.value == "" || pincode.value == null) {
    document.getElementById("pincode-err").innerText = "*mandatory";
    document.getElementById("pincode-err").style.color = "red";
    pincode.style.border = "1px red solid";
    return false;
  }
  
  if (pincode.value.includes('-')) {
    document.getElementById("pincode-err").innerText = "Negative numbers not allowed";
    document.getElementById("pincode-err").style.color = "red";
    pincode.style.border = "1px red solid";
    return false;
  }

  if (pincode.value.length !== 6) {
	document.getElementById("pincode-err").innerText = "Pincode must be 6 digits long";
    document.getElementById("pincode-err").style.color = "red";
    pincode.style.border = "1px red solid";
    return false;
  }

  document.getElementById("pincode-err").innerText = "Pincode is Valid!";
  document.getElementById("pincode-err").style.color = "lime";
  pincode.style.border = "1px lime solid";

  return true;
}