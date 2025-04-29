
let wordlist;
let currentPage = 0;
const vocab = document.getElementById("wordText");
const meaning = document.getElementById("meaning");
const exampleEnglish = document.getElementById("example-english");
const exampleChinese = document.getElementById("example-chinese");
const SwitchRight = document.getElementById("SwitchBtnRight");
const SwitchLeft = document.getElementById("SwitchBtnLeft");

window.onload = (event) => {
    const currentUrl = window.location.href;
    console.log(currentUrl);
    let baseUrl = currentUrl;
    baseUrl = baseUrl.replace("home","words");
    const params = new URLSearchParams();
    params.append("start_index", 1);
    params.append("required_amount", 4);
    const finalUrl = baseUrl + '?' + params.toString();
    fetch(finalUrl, {method: 'GET'}).then( response => {
        console.log(response);
        return response.json();
    }).then( response => {
        console.log(response);
        wordlist = response;
        changeWord();
    }).catch( error => {
        console.log(`Error: ${error}`);
    });
};

SwitchRight.onclick = function() {
    currentPage++;
    changeWord();
}

SwitchLeft.onclick = function() {
    currentPage--;
    changeWord();
}

function changeWord() {
    vocab.innerHTML = wordlist[currentPage].word;
    meaning.innerHTML = wordlist[currentPage].type + wordlist[currentPage].def;
    exampleEnglish.innerHTML = wordlist[currentPage].example_sentence1;
    exampleChinese.innerHTML = wordlist[currentPage].example_translation1;
}

document.addEventListener('DOMContentLoaded', () => {
   const speakButtons = document.querySelectorAll('.speak-btn');

    speakButtons.forEach(button => {
        button.addEventListener('click', handleSpeakButtonClick);
    });
});

function handleSpeakButtonClick(){
    let textToSpeak = '';
    const clickedButton = this;
    // 根據按鈕在 HTML 結構中的位置，找到要朗讀的文字
    if (clickedButton.previousElementSibling) {
        textToSpeak = clickedButton.previousElementSibling.textContent.trim();
        console.log("1 " + textToSpeak);
    } else if (clickedButton.parentNode && clickedButton.parentNode.classList.contains('word')) {
        // 如果按鈕在包含單字的 div 內
        textToSpeak = clickedButton.parentNode.textContent.replace('Speak', '').trim();
        console.log("2 " + textToSpeak);
    } else if (clickedButton.parentNode && clickedButton.parentNode.classList.contains('example-english')) {
        // 如果按鈕在包含英文例句的 div 內
        textToSpeak = clickedButton.parentNode.textContent.trim();
        console.log("3 " + textToSpeak);
    }
    textToSpeak = textToSpeak.replace('🔊','');
    console.log(textToSpeak);
    speakEnglish(textToSpeak);
}

function speakEnglish(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; // Set the language to English (US)
        speechSynthesis.speak(utterance);
    } else {
        console.log('Your browser does not support text-to-speech.');
    }
}