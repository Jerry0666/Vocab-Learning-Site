
const registerBtn = document.getElementById("registerBtn");
const fullName = document.getElementById("fullname");
const registerAccount = document.getElementById("registerUsername");
const registerPassword = document.getElementById("registerPassword");
const confirmPassword = document.getElementById("confirmPassword");

function show_hide() {
    let login = document.getElementById("container1");
    let signup = document.getElementById("container2");
    let copyright = document.getElementById("copyright");

    if (login.style.display === "none") {
        login.style.display = "block";  //lonin出現
        document.getElementById("username").value="";
        document.getElementById("password").value="";
        signup.style.display = "none";  //signup消失
    } else {
        login.style.display = "none";   //login消失
        signup.style.display = "block"; //signup出現
        signup.style.visibility="visible";

        document.getElementById("fullname").value="";
        document.getElementById("registerUsername").value="";
        document.getElementById("registerPassword").value="";
        document.getElementById("confirmPassword").value="";
    }
}

registerBtn.onclick = function(event){
    if (fullName.value === "" || registerAccount.value === "" || registerPassword.value === "") {
        console.log("Please fill in all fields");
    }
    else if (confirmPassword.value !== registerPassword.value) {
        confirmPassword.setCustomValidity('請與密碼一致');
    }
    else{
        fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({     name: fullName.value,
                account: registerAccount.value,
                password: registerPassword.value
            })
        })
    }

}