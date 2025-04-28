const card = document.getElementById('card');
const exampleButton = document.querySelector('.example');
const exampleContainer = document.querySelector('.example-container');
const exampleList = exampleContainer.querySelector('ul');
const cardFront = document.querySelector('.card-front');
const wordExamples = {
    "abundant": [
        "The forest was abundant in wildlife.",
        "There was an abundant supply of food at the party."
    ],
    "another_word": [
        "Example sentence for another word 1.",
        "Example sentence for another word 2."
    ]
};
let showingExamples = false; // 追蹤是否正在顯示例句

card.addEventListener('click', () => {
    card.classList.toggle('flipped');
});

exampleButton.addEventListener('click', () => {
    const currentWord = cardFront.textContent.trim();

    if (!showingExamples) {
        // 顯示例句
        if (wordExamples[currentWord]) {
            exampleList.innerHTML = ''; // 清空之前的例句
            wordExamples[currentWord].forEach(example => {
                const li = document.createElement('li');
                li.textContent = example;
                exampleList.appendChild(li);
            });
            exampleContainer.style.display = 'block'; // 顯示例句容器
            exampleButton.textContent = 'Hide Examples';
            showingExamples = true;
        } else {
            alert('No examples available for this word.');
        }
    } else {
        // 隱藏例句
        exampleContainer.style.display = 'none';
        exampleButton.textContent = 'Example';
        showingExamples = false;
    }
});