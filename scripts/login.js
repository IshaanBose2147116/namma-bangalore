import ServerAPI from "./server_api.js";

document.getElementById("login-form").onsubmit = (event) => {
    event.preventDefault();
    validate();
};

var phone = document.getElementById('Phone-No');
var password= document.getElementById('password');
var span = document.getElementsByTagName('span');

phone.onkeydown = (event) => {
    if ((event.which > 58 || event.which < 47) && event.key !== 'Backspace') {
        event.preventDefault();
    }
};
phone.onkeyup = validatePhone;
password.onkeyup = () => {
    if (password.value.length === 0) {
        span[1].innerText= "*Mandatory";
        span[1].style.color="red";
        password.style.border="2px red solid";
    } else {
        span[1].innerText= "";
        span[1].style.color="red";
        password.style.border="2px lime solid";
    }
}

function scrollToTop() {
    window.scrollTo(0, 0);
}

function validate() {
    if (!validatePhone() || password.value === "" ) {
        console.log(password.value);
        scrollToTop();
        span[1].innerText= "* Mandatory";
        span[1].style.color="red";
        password.style.border="2px red solid";
    }
    else {
        ServerAPI.loginUser(phone.value, password.value, false, response => {
            if (response.status === 404) {
                if (response.errCode === 1012) {
                    span[0].innerText = "Unregistered phone number!";
                    span[0].style.color = "red";
                    phone.style.border = "1px red solid";
                }
                else {
                    span[1].innerText = "Incorrect password!";
                    span[1].style.color = "red";
                    password.style.border = "1px red solid";
                }
            } else if (response.status === 200) {
                window.open('/', "_self");
            } else {
                alert("Internal server error! Please try again later.");
                console.log(response); // internal server error
            }
        });
    }
}

function validatePhone() {
    const regex_num = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

    if (phone.value.trim() == "" || phone.value.trim() == null) {
        span[0].innerText = "*mandatory";
        span[0].style.color = "red";
        phone.style.border = "1px red solid";
        return false;
    }

    if (regex_num.test(phone.value)) {
        span[0].innerText = "Your number is Valid!";
        span[0].style.color = "lime";
        phone.style.border = "1px lime solid";
        console.log("hiya");
        return true;
    }

    span[0].innertext = "Invalid Phone number";
    span[0].style.color = "red";
    phone.style.border = "1px red solid";
    
    return false;
}

