const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const email = document.getElementById("email");
const registerAccount = document.getElementById("registerUsername");
const registerPassword = document.getElementById("registerPassword");
const confirmPassword = document.getElementById("confirmPassword");
const messageDiv = document.getElementById("registerMessage");
const loginDiv = document.getElementById("loginMessage");

const loginUsername = document.getElementById("username");
const loginPassword = document.getElementById("password");

function show_hide() {
    let login = document.getElementById("container1");
    let signup = document.getElementById("container2");
    let copyright = document.getElementById("copyright");

    if (login.style.display === "none") {
        login.style.display = "block";  //login出現
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
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            username: loginUsername.value,
            password: loginPassword.value
        })
    }).then(result => {
        if (result.ok || result.status === 303) {
            console.log("login success!!!");
            return result.text();
        }
        return result.json().then(err => {
            throw new Error(err.error || "Unknown error");
        });
    }).then(data => {
        console.log("type of data:");
        console.log(typeof data);
        console.log("data: " + data);
        console.log("replace...");
        let redirectDst = data.replace("redirect:","");
        console.log("data: " + redirectDst);
        window.location.href = redirectDst;
    }).catch (error => {
        console.log("Error:",error.message);
        loginDiv.style.color = "red";
        loginDiv.textContent = "登入失敗";
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
                        'Accept': 'application/json'},
            body: JSON.stringify({     email: email.value,
                username: registerAccount.value,
                password: registerPassword.value
            })
        }).then (result => {
            if (result.ok) {
                console.log("result.ok");
                return result.text();
            } else {
                console.log(result);
                return result.json().then(err => {
                            throw new Error(err.error || "Unknown error");
                        });
            }
        }).then (data => {
            console.log(data);
            messageDiv.style.color = "#82e371";
            messageDiv.textContent = "註冊成功！";
        }).catch (error => {
            console.log("Error:",error.message);
            messageDiv.style.color = "red";
            messageDiv.textContent = "註冊失敗";
        })
    }

}