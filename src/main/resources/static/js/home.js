
let wordlist;
let currentPage = 0;
const SwitchRight = document.getElementById("SwitchBtnRight");
const SwitchLeft = document.getElementById("SwitchBtnLeft");

let englishVoices = [];
const voiceSelect = document.getElementById('voiceSelect');
const vocabSelector = document.getElementById("vocabSelect");

function populateVoiceList() {
    const voices = speechSynthesis.getVoices();
    englishVoices = voices.filter(voice => voice.lang.startsWith('en-'));

    voiceSelect.innerHTML = ''; // 清空原本的選項

    englishVoices.forEach((voice, i) => {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${voice.name} (${voice.lang})${voice.default ? ' [default]' : ''}`;
        voiceSelect.appendChild(option);
    });
}

function populateVocabIndexList() {
    vocabSelector.innerHTML = '';
    wordlist.forEach((word,i) => {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i+1}.  ${word.word}`;
        vocabSelector.appendChild(option);
    });
}

window.onload = (event) => {
    const currentUrl = window.location.href;
    console.log(currentUrl);
    let baseUrl = currentUrl;
    baseUrl = baseUrl.replace("home","words");
    const params = new URLSearchParams();
    params.append("start_index", 1);
    params.append("required_amount", 70);
    const finalUrl = baseUrl + '?' + params.toString();
    fetch(finalUrl, {method: 'GET'}).then( response => {
        console.log(response);
        return response.json();
    }).then( response => {
        console.log(response);
        wordlist = response;
        changeVocabCards(wordlist.slice(0,2));
        populateVocabIndexList();
        vocabSelector.addEventListener("change", (event) => {
            currentPage = event.target.value;
            console.log("value is " + currentPage);
            changeVocabCards(wordlist.slice(currentPage,currentPage+2));
        });
    }).catch( error => {
        console.log(`Error: ${error}`);
    });
    // 載入語音列表
    if ('speechSynthesis' in window) {
        speechSynthesis.onvoiceschanged = populateVoiceList;
        // populateVoiceList();
    }
};

SwitchRight.onclick = function() {
    currentPage+=2;
    changeVocabCards(wordlist.slice(currentPage,currentPage+2));
}

SwitchLeft.onclick = function() {
    currentPage-=2;
    changeVocabCards(wordlist.slice(currentPage,currentPage+2));
}

function changeVocabCards(wordsData) {
    const vocabCards = document.querySelectorAll(".vocab-card");

    if (vocabCards.length !== wordsData.length) {
        console.error("資料數量與單字卡數量不符！");
        console.log("vocabCards length: " + vocabCards.length);
        console.log("wordsData.length: " + wordsData.length);
        return;
    }

    vocabCards.forEach((card, index) => {
        const wordText = card.querySelector(".wordText");
        const meaningText = card.querySelector(".meaning");
        const exampleEnglishText = card.querySelector(".example-english-span");
        const exampleChineseText = card.querySelector(".example-chinese");

        wordText.textContent = wordsData[index].word;
        meaningText.textContent = wordsData[index].type + " " + wordsData[index].def;
        exampleEnglishText.textContent = wordsData[index].example_sentence1;
        exampleChineseText.textContent = wordsData[index].example_translation1;
    });
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
    } else if (clickedButton.parentNode && clickedButton.parentNode.classList.contains('word')) {
        // 如果按鈕在包含單字的 div 內
        textToSpeak = clickedButton.parentNode.textContent.replace('Speak', '').trim();
    } else if (clickedButton.parentNode && clickedButton.parentNode.classList.contains('example-english')) {
        // 如果按鈕在包含英文例句的 div 內
        textToSpeak = clickedButton.parentNode.textContent.trim();
    }
    textToSpeak = textToSpeak.replace('🔊','');
    console.log(textToSpeak);
    // 找到選單中被選取的語音
    const selectedVoiceIndex = document.getElementById('voiceSelect')?.value;
    const selectedVoice = englishVoices?.[selectedVoiceIndex];
    const rate = parseFloat(document.getElementById('rateSelect')?.value) || 1;

    speakEnglish(textToSpeak, selectedVoice, rate);

}

function speakEnglish(text, voice = null, rate = 1) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);

        if (voice) {
            utterance.voice = voice;
            utterance.lang = voice.lang; // 使用該 voice 對應的語言
        } else {
            utterance.lang = 'en-US'; // fallback
        }

        utterance.rate = rate;
        speechSynthesis.speak(utterance);
    } else {
        console.log('Your browser does not support text-to-speech.');
    }
}

