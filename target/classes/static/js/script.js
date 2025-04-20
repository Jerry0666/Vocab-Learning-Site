
console.log(`This is a test!`);

const Username = document.getElementById(`name`);
const SubmitBtn = document.getElementById(`SubmitBtn`);

SubmitBtn.onclick = function(event) {
    const UsernameStr = Username.value;
    console.log(UsernameStr);
    fetch("/api", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: UsernameStr})
    });
};
