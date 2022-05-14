import ServerAPI from "./server_api.js";

document.getElementById("login-form").onsubmit = (event) => {
    event.preventDefault();
    validate();
};

var phone = document.getElementById('Phone-No');
var password= document.getElementById('password');

phone.onkeydown = (event) => {
    if ((event.which > 58 || event.which < 47) && event.key !== 'Backspace') {
        event.preventDefault();
    }
};
phone.onkeyup = validatePhone;
password.onkeyup = () => {
    if (password.value.length === 0) {
        document.getElementById("password-err").innerText= "*Mandatory";
        document.getElementById("password-err").style.color="red";
        password.style.border="2px red solid";
    } else {
        document.getElementById("password-err").innerText= "";
        document.getElementById("password-err").style.color="red";
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
        document.getElementById("password-err").innerText= "* Mandatory";
        document.getElementById("password-err").style.color="red";
        password.style.border="2px red solid";
    }
    else {
        ServerAPI.loginUser(phone.value, password.value, false, response => {
            if (response.status === 404) {
                if (response.errCode === 1012) {
                    document.getElementById("phone-err").innerText = "Unregistered phone number!";
                    document.getElementById("phone-err").style.color = "red";
                    phone.style.border = "1px red solid";
                }
                else {
                    document.getElementById("password-err").innerText = "Incorrect password!";
                    document.getElementById("password-err").style.color = "red";
                    password.style.border = "1px red solid";
                }
            } else if (response.status === 200) {
                sessionStorage.setItem("name", response.name);
                sessionStorage.setItem("uid", response.uid);

                if (response.isAdmin !== undefined)
                    sessionStorage.setItem("isadmin", response.isAdmin);
                else
                    sessionStorage.setItem("isbusiness", response.isBusiness);

                if (response.isAdmin === undefined || response.isAdmin === false)
                    window.open('/', "_self");
                else
                    window.open(`/admin/${ response.uid }`, "_self");
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

    document.getElementById("phone-err").innerText = "Invalid Phone number";
    document.getElementById("phone-err").style.color = "red";
    phone.style.border = "1px red solid";
    
    return false;
}
