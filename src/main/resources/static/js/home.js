const currentUrl = window.location.href;

let wordlist;
let MyWordsList;
// 根據現在所處的畫面，把currentList設定成wordList或MyWordsList，之後切換卡片都使用currentList存取。
let currentList;
let WordsListPage = 0;
let MyWordsListPage = 0;
let currentPage = 0;

const SwitchRight = document.getElementById("SwitchBtnRight");
const SwitchLeft = document.getElementById("SwitchBtnLeft");

let englishVoices = [];
const voiceSelect = document.getElementById('voiceSelect');
const vocabSelector = document.getElementById("vocabSelect");
let previouslySelectedIndex = null; // 用於追蹤先前被選中的索引

const PerDayWordMax = 66;
let todayWordId = 433;
let WordMax = PerDayWordMax;
let getUserWordList = false;


const MyWordsBtn = document.getElementById("MyWordsBtn");

const DailyWordsBtn = document.getElementById('DailyWordsBtn');
const DailyWordListContainer = document.getElementById('DailyWordListContainer');
const DictationTestBtn = document.getElementById('DictationTestBtn');
const DictationTestContainer = document.getElementById('DictationTestContainer');

const MainWindow = Object.freeze({
    DailyWordsList: 0,
    MyWordsList: 1,
    DictationTest: 2,
});

let currentWindow = MainWindow.DailyWordsList;


function populateVoiceList() {
    const voices = speechSynthesis.getVoices();
    englishVoices = voices.filter(voice => voice.lang.startsWith('en-'));

    voiceSelect.innerHTML = ''; // 清空原本的選項

    englishVoices.forEach((voice, i) => {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${(i + 1).toString().padStart(2, '0')}. ${voice.name} (${voice.lang})${voice.default ? ' [default]' : ''}`;
        // 添加 data-index 屬性來追蹤語音在 englishVoices 陣列中的索引
        option.dataset.index = i;
        voiceSelect.appendChild(option);
    });

    // 設定default語音顏色
    const defaultSelectedIndex = voiceSelect.value;
    const defaultOption = voiceSelect.querySelector(`[data-index="${defaultSelectedIndex}"]`);
    if (defaultOption) {
        defaultOption.classList.add('selected-voice');
        previouslySelectedIndex = defaultSelectedIndex;
    }
}

// 改變選擇語音的顏色
voiceSelect.addEventListener('change', function() {
    const selectedIndex = this.value; // 獲取目前選中的 option 的 value (也就是在 englishVoices 中的索引)

    // 移除先前選中項目的顏色
    if (previouslySelectedIndex !== null) {
        const previousOption = this.querySelector(`[data-index="${previouslySelectedIndex}"]`);
        if (previousOption) {
            previousOption.classList.remove('selected-voice');
        }
    }

    // 找到目前選中項目的 option 元素並添加顏色
    const currentOption = this.querySelector(`[data-index="${selectedIndex}"]`);
    if (currentOption) {
        currentOption.classList.add('selected-voice');
    }

    previouslySelectedIndex = selectedIndex; // 更新先前選中的索引
});

function populateVocabIndexList(list) {
    vocabSelector.innerHTML = '';
    list.forEach((word,i) => {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i+1}.  ${word.word}`;
        vocabSelector.appendChild(option);
    });
    vocabSelector.selectedIndex = currentPage;
}

window.onload = (event) => {
    DictationTestContainer.classList.add('hidden');
    console.log(typeof(currentUrl));
    let baseUrl = currentUrl;
    baseUrl = baseUrl.replace("home","words");
    const params = new URLSearchParams();
    params.append("start_index", todayWordId);
    params.append("required_amount", PerDayWordMax);
    const finalUrl = baseUrl + '?' + params.toString();
    fetch(finalUrl, {method: 'GET'}).then( response => {
        console.log(response);
        if (response.ok) {
            return response.json();
        } else {
            return response.json().then(err => {
                throw new Error(err.error || "Unknown error");
            });
        }

    }).then( response => {
        console.log(response);
        wordlist = response;
        currentList = wordlist;
        changeVocabCards(currentList);
        populateVocabIndexList(currentList);
        const removeBtns = document.querySelectorAll('.removeBtn');
        removeBtns.forEach((button) => {
            button.classList.add('hidden');
        })
        vocabSelector.addEventListener("change", (event) => {
            currentPage = parseInt(event.target.value, 10);
            console.log("currentPage: " + currentPage);
            checkPageAndChangeCard();
        });
    }).catch( error => {
        console.log("Error:",error.message);
    });
    // 載入語音列表
    if ('speechSynthesis' in window) {
        speechSynthesis.onvoiceschanged = populateVoiceList;
        populateVoiceList();
    }
};

function checkPageAndChangeCard() {
    if(currentPage === WordMax - 1) {
        currentPage--;
    }
    // change arrow color
    if (currentPage === 0) {
        SetColor(SwitchLeft,true);
    }
    if (currentPage < WordMax - 2) {
        SetColor(SwitchRight,false);
    }
    if (currentPage === WordMax - 2) {
        SetColor(SwitchRight,true);
    }
    if (currentPage > 0) {
        SetColor(SwitchLeft,false);
    }
    changeVocabCards(currentList);
}

SwitchRight.onclick = function() {

    if (currentPage === WordMax - 2) {
        console.log("WordMax - 2");
        return;
    } else if (currentPage === (WordMax - 3)) {
        console.log("WordMax - 3");
        currentPage+=1;
    } else {
        currentPage+=2;
    }
    if (currentPage === WordMax - 2) {
        SetColor(SwitchRight,true);
    }
    if (currentPage > 0) {
        SetColor(SwitchLeft,false);
    }
    changeVocabCards(currentList);
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
    if (currentPage < WordMax - 2) {
        SetColor(SwitchRight,false);
    }
    changeVocabCards(currentList);
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

function changeVocabCards(list) {
    console.log("currentPage: " + currentPage);
    const vocabCards = Array.from(document.querySelectorAll(".vocab-card"))
                           .filter(card => card.offsetParent !== null);


    vocabCards.forEach((card, index) => {
        const wordText = card.querySelector(".wordText");
        const meaningText = card.querySelector(".meaning");
        const exampleEnglishText = card.querySelector(".example-english-span");
        const exampleChineseText = card.querySelector(".example-chinese");
        const wordIndex = card.querySelector(".wordIndex");

        wordIndex.textContent = currentPage + index + 1;
        wordIndex.textContent += "."
        wordText.textContent = list[currentPage + index].word;
        wordText.style = "margin-left: 15px;";
        meaningText.textContent = list[currentPage + index].type + " " + list[currentPage + index].def;
        exampleEnglishText.textContent = list[currentPage + index].example_sentence1;
        exampleChineseText.textContent = list[currentPage + index].example_translation1;
    });
}

// Add speakBtn event
document.addEventListener('DOMContentLoaded', () => {
    const speakButtons = document.querySelectorAll('.speak-btn');

    speakButtons.forEach(button => {
        button.addEventListener('click', handleSpeakButtonClick);
    });
});

// Add addBtn event
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
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    wordId: wordlist[vocabIndex].id
                })
            }).then( response => {
                if (response.ok) {
                    return response.text();
                } else {
                    return response.json().then( err => {
                        throw new Error(err.error || "Unknown error");
                    });
                }
            }).then (data => {
                console.log("post success: " + data);
            }).catch( error => {
                console.log("post error:",error.message);
            });
            // 記錄起來，避免重複發送
        })
    })
})

// Add removeBtn event
document.addEventListener('DOMContentLoaded', function(){
    const removeBtns = document.querySelectorAll('.removeBtn');
    removeBtns.forEach((button,index) => {
        button.addEventListener('click', function() {
            let vocabIndex = currentPage + index;
            console.log("vocabulary " + currentList[vocabIndex].id + " is removed from my list.")
            const params = new URLSearchParams();
            params.append("id", currentList[vocabIndex].id);
            let url = '/UserWord'
            url += '?' + params.toString();
            console.log("url:" + url);
            // 發送delete到server上
            fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then( response => {
                if (response.ok) {
                    return response.text();
                } else {
                    return response.json().then( err => {
                        throw new Error(err.error || "Unknown error");
                    });
                }
            }).then (data => {
                console.log("post success: " + data);
            }).catch( error => {
                console.log("post error:",error.message);
            });

        })
    })
})

DictationTestBtn.onclick = function() {
    DailyWordListContainer.classList.add('hidden');
    DictationTestContainer.classList.remove('hidden');
    // generate the test list
    const words = [
        "apple", "banana", "cherry", "date", "elderberry",
        "fig", "grape", "honeydew", "kiwi", "lemon",
    ];
//        "mango", "nectarine", "orange", "papaya", "quince",
//        "raspberry", "strawberry", "tangerine", "ugli fruit", "vanilla"
//    ];
    words.forEach(word => {
        // 創建 word-box div
        const wordBox = document.createElement("div");
        wordBox.classList.add("word-box");

        // 創建 DictationWord div
        const dictationWordDiv = document.createElement("div");
        dictationWordDiv.classList.add("DictationWord");
        dictationWordDiv.textContent = word;

        // 創建 Speak Button
        const speakButton = document.createElement("button");
        speakButton.classList.add("DictationSpeakBtn");
        speakButton.textContent = "🔊";
        // 你可以在這裡添加按鈕的事件監聽器，使其發聲

        dictationWordDiv.appendChild(speakButton);

        // 創建 input element
        const answerInput = document.createElement("input");
        answerInput.type = "text";
        answerInput.classList.add("answer");
        answerInput.placeholder = "";

        // 將 DictationWord 和 input 添加到 word-box
        wordBox.appendChild(dictationWordDiv);
        wordBox.appendChild(answerInput);

        // 將 word-box 添加到 DictationTestContainer
        DictationTestContainer.appendChild(wordBox);
    })

}

MyWordsBtn.onclick = function() {
    DictationTestContainer.classList.add('hidden');
    DailyWordListContainer.classList.remove('hidden');
    currentWindow = MainWindow.MyWordsList;
    console.log("currentWindow:" + currentWindow);
    const addBtns = document.querySelectorAll('.addBtn');
    addBtns.forEach((button) => {
        button.classList.add('hidden');
    })
    const removeBtns = document.querySelectorAll('.removeBtn');
    removeBtns.forEach((button) => {
        button.classList.remove('hidden');
    })
    if (!getUserWordList) {
        let baseUrl = currentUrl;
        baseUrl = baseUrl.replace("home","CustomizedWords");
        // add some parameter
        const finalUrl = baseUrl;
        console.log("fetch MyWordList");
        fetch(finalUrl, {method: 'GET'}).then( response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then( err => {
                    throw new Error(err.error || "Unknown error");
                });
            }
        }).then( result => {
            MyWordsList = result;
            console.log(MyWordsList);
            currentList = MyWordsList;
            WordsListPage = currentPage;
            currentPage = MyWordsListPage;
            checkPageAndChangeCard();
            populateVocabIndexList(currentList);
            WordMax = MyWordsList.length;
        }).catch( error => {
            console.log("get error:",error.message);
        })
        getUserWordList = true;
    } else {
        currentList = MyWordsList;
        WordsListPage = currentPage;
        currentPage = MyWordsListPage;
        console.log("MyWordsListPage: " + MyWordsListPage);
        console.log("currentPage: " + currentPage);
        checkPageAndChangeCard();
        populateVocabIndexList(currentList);
        WordMax = MyWordsList.length;
    }

}

DailyWordsBtn.onclick = function() {
    DictationTestContainer.classList.add('hidden');
    DailyWordListContainer.classList.remove('hidden');
    const removeBtns = document.querySelectorAll('.removeBtn');
    removeBtns.forEach((button) => {
        button.classList.add('hidden');
    })
    const addBtns = document.querySelectorAll('.addBtn');
    addBtns.forEach((button) => {
        button.classList.remove('hidden');
    })
    // 做畫面切換
    currentWindow = MainWindow.DailyWordsList;
    currentList = wordlist;
    MyWordsListPage = currentPage;
    console.log("MyWordsListPage: " + MyWordsListPage);
    currentPage = WordsListPage;
    checkPageAndChangeCard();
    populateVocabIndexList(currentList);
    WordMax = PerDayWordMax;
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
    textToSpeak = textToSpeak.replace('/',' ');
    textToSpeak = textToSpeak.replace('/',' ');
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

