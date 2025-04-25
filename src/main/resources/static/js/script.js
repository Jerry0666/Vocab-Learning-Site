const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const email = document.getElementById("email");
const registerAccount = document.getElementById("registerUsername");
const registerPassword = document.getElementById("registerPassword");
const confirmPassword = document.getElementById("confirmPassword");
const messageDiv = document.getElementById("registerMessage");

const loginUsername = document.getElementById("username");
const loginPassword = document.getElementById("password");

function show_hide() {
    let login = document.getElementById("container1");
    let signup = document.getElementById("container2");
    let copyright = document.getElementById("copyright");

    if (login.style.display === "none") {
        login.style.display = "block";  //lonin出現
        loginUsername.value="";
        loginPassword.value="";
        signup.style.display = "none";  //signup消失
    } else {
        login.style.display = "none";   //login消失
        signup.style.display = "block"; //signup出現
        signup.style.visibility="visible";

        email.value="";
        registerAccount.value="";
        registerPassword.value="";
        confirmPassword.value="";
        messageDiv.textContent = "";
    }
}

loginBtn.onclick = function (event){
    console.log("login Btn clicked");
    fetch('/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/plain'
        },
        body: JSON.stringify({
            username: loginUsername.value,
            password: loginPassword.value
        })
    }).then(result => {
        if (result.ok) {
            console.log("login success!!!");
            console.log(document.cookie);
            return result.text();
        }
    }).then(data => {
        console.log(data);
    })
}

registerBtn.onclick = function(event){
    console.log("register Btn clicked");
    if (email.value === "" || registerAccount.value === "" || registerPassword.value === "") {
        console.log("Please fill in all fields");
    }
    else if (confirmPassword.value !== registerPassword.value) {
        confirmPassword.setCustomValidity('請與密碼一致');
    }
    else{
         fetch('/register', {
            method: 'POST',
            headers: {  'Content-Type': 'application/json',
                        'Accept': 'text/plain'},
            body: JSON.stringify({     email: email.value,
                username: registerAccount.value,
                password: registerPassword.value
            })
        }).then (result => {
            if (result.ok) {
                return result.text();
            } else {
                return result.text();
            }
        }).then (data => {
            console.log(data);
            if (data === "success"){
                messageDiv.style.color = "#82e371";
                messageDiv.textContent = "註冊成功！";
            } else if (data === "user already exists") {
                messageDiv.style.color = "red";
                messageDiv.textContent = "註冊失敗:用戶已存在";
                throw new Error('Http BAD_REQUEST)');
            }

        }).catch (error => {
            console.log("Error:",error.message);
            // handle some error
        })

    }

}