const currentUrl = window.location.href;

let wordlist;
let currentPage = 0;
const SwitchRight = document.getElementById("SwitchBtnRight");
const SwitchLeft = document.getElementById("SwitchBtnLeft");

let englishVoices = [];
const voiceSelect = document.getElementById('voiceSelect');
const vocabSelector = document.getElementById("vocabSelect");

const PerDayWordMax = 70;
let todayWordId = 71;
const MyWordsBtn = document.getElementById("MyWordsBtn");
const DailyWordsBtn = document.getElementById('DailyWordsBtn');
const DailyWordListContainer = document.getElementById('DailyWordListContainer');

const MainWindow = Object.freeze({
    DailyWordsList: 0,
    MyWordsList: 1
});

let currentWindow = MainWindow.DailyWordsList;

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
    let baseUrl = currentUrl;
    baseUrl = baseUrl.replace("home","words");
    const params = new URLSearchParams();
    params.append("start_index", todayWordId);
    params.append("required_amount", PerDayWordMax);
    const finalUrl = baseUrl + '?' + params.toString();
    fetch(finalUrl, {method: 'GET'}).then( response => {
        console.log(response);
        return response.json();
    }).then( response => {
        console.log(response);
        wordlist = response;
        changeVocabCards();
        populateVocabIndexList();
        vocabSelector.addEventListener("change", (event) => {
            currentPage = parseInt(event.target.value, 10);
            if(currentPage === PerDayWordMax - 1) {
                currentPage--;
            }
            // change arrow color
            if (currentPage === 0) {
                SetColor(SwitchLeft,true);
            }
            if (currentPage < PerDayWordMax - 2) {
                SetColor(SwitchRight,false);
            }
            if (currentPage === PerDayWordMax - 2) {
                SetColor(SwitchRight,true);
            }
            if (currentPage > 0) {
                SetColor(SwitchLeft,false);
            }
            changeVocabCards();
        });
    }).catch( error => {
        console.log(`Error: ${error}`);
    });
    // 載入語音列表
    if ('speechSynthesis' in window) {
        speechSynthesis.onvoiceschanged = populateVoiceList;
        populateVoiceList();
    }
};

SwitchRight.onclick = function() {

    if (currentPage === PerDayWordMax - 2) {
        return;
    } else if (currentPage === (PerDayWordMax - 3)) {
        currentPage+=1;
    } else {
        currentPage+=2;
    }
    if (currentPage === PerDayWordMax - 2) {
        SetColor(SwitchRight,true);
    }
    if (currentPage > 0) {
        SetColor(SwitchLeft,false);
    }
    changeVocabCards();
    vocabSelector.selectedIndex = currentPage;
}

SwitchLeft.onclick = function() {
    if (currentPage === 0) {
        return;
    } else if (currentPage === 1) {
        currentPage-=1;
    } else {
        currentPage-=2;
    }
    if (currentPage === 0) {
        SetColor(SwitchLeft,true);
    }
    if (currentPage < PerDayWordMax - 2) {
        SetColor(SwitchRight,false);
    }
    changeVocabCards();
    vocabSelector.selectedIndex = currentPage;
}

function SetColor(button,stop) {
    const arrowPath = button.querySelector('polygon'); // 假設你的箭頭是 <polygon> 元素
    const arrowLine = button.querySelector('line');
    if (stop) {
        arrowPath.setAttribute('fill', "#c59090");
        arrowLine.setAttribute('stroke', "#c59090");
    } else {
        arrowPath.setAttribute('fill', "#B0B0B0");
        arrowLine.setAttribute('stroke', "#B0B0B0");
    }
}

function changeVocabCards() {
    console.log("currentPage: " + currentPage);
    const vocabCards = document.querySelectorAll(".vocab-card");


    vocabCards.forEach((card, index) => {
        const wordText = card.querySelector(".wordText");
        const meaningText = card.querySelector(".meaning");
        const exampleEnglishText = card.querySelector(".example-english-span");
        const exampleChineseText = card.querySelector(".example-chinese");
        const wordIndex = card.querySelector(".wordIndex");

        wordIndex.textContent = currentPage + index + 1;
        wordIndex.textContent += "."
        wordText.textContent = wordlist[currentPage + index].word;
        wordText.style = "margin-left: 15px;";
        meaningText.textContent = wordlist[currentPage + index].type + " " + wordlist[currentPage + index].def;
        exampleEnglishText.textContent = wordlist[currentPage + index].example_sentence1;
        exampleChineseText.textContent = wordlist[currentPage + index].example_translation1;
    });
}

document.addEventListener('DOMContentLoaded', () => {
   const speakButtons = document.querySelectorAll('.speak-btn');

    speakButtons.forEach(button => {
        button.addEventListener('click', handleSpeakButtonClick);
    });
});

document.addEventListener('DOMContentLoaded', function(){
    const addBtns = document.querySelectorAll('.addBtn');

    addBtns.forEach((button,index) => {
        button.addEventListener('click', function() {
            let vocabIndex = currentPage + index;
            console.log("vocabulary " + wordlist[vocabIndex].id + " is added to my list.")
            // 馬上post到server上
            fetch('/UserWord', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'text/plain'
                },
                body: JSON.stringify({
                    wordId: wordlist[vocabIndex].id
                })
            }).then( response => {
                console.log(response);
            });
            // 記錄起來，避免重複發送
        })
    })
})

MyWordsBtn.onclick = function() {
    // 先做畫面切換
    currentWindow = MainWindow.MyWordsList;
    console.log("currentWindow:" + currentWindow);
    DailyWordListContainer.classList.add('hidden');

    // fetch 使用者單字庫資料，先回傳單字列表(只有word)，之後單字的詳細資料再慢慢傳。
    let baseUrl = currentUrl;
    baseUrl = baseUrl.replace("home","CustomizedWords");
    // add some parameter
    const finalUrl = baseUrl;
    fetch(finalUrl, {method: 'GET'});

    // 要處理效能了，不能讓使用者一次載入太多單字。
    
}

DailyWordsBtn.onclick = function() {
    // 做畫面切換
    currentWindow = MainWindow.DailyWordsList;
    DailyWordListContainer.classList.remove('hidden');
}

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

