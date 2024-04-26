const mainBox = document.querySelector('.main-box');
const resetBtn = document.querySelector('button');
const scoreHtml = document.getElementById('score')
const clicksResult = document.querySelector('.clicks-result')
const time = document.querySelector('.time')

const emojis = ["😇", "😇", "🤩", "🤩", "👀", "👀", "💛", "💛", "🙈", "🙈", "✨", "✨", "🥶", "🥶", "😶‍🌫️", "😶‍🌫️"];
const mixEmojis = emojis.sort(() => (Math.random() > .5) ? 2 : -1);


let flippedCards = []
let openedCards = []
let scores = 0
let timer
let clicks = 0

resetBtn.onclick = () => {
    window.location.reload();
};

for (let emoji of emojis) {
    const card = document.createElement('div');
    card.className = 'card';
    const front = document.createElement('div');
    front.className = 'front';
    const back = document.createElement('div');
    back.className = 'back';

    front.textContent = "";
    back.innerHTML = "";

    mainBox.appendChild(card)
    card.appendChild(front)
    card.appendChild(back)

    card.onclick = () => {
        clicks++
        clicksResult.textContent = clicks
        console.log(clicks);
        if (!timer) {
            countTime();
        }
        front.textContent = emoji;

        if (!flippedCards.includes(card) && !openedCards.includes(emoji)) {
            card.classList.toggle('hover');
            flippedCards.push(card);

            if (flippedCards.length === 2) {
                const emoji1 = flippedCards[0].textContent;
                const emoji2 = flippedCards[1].textContent;
                console.log(emoji1);
                console.log(emoji2);
                if (emoji1 !== emoji2) {
                    setTimeout(() => {
                        flippedCards.forEach(flippedCard => flippedCard.classList.toggle('hover'));
                        flippedCards = [];
                    }, 1000);
                } else {
                    openedCards.push(emoji1, emoji2);
                    scores++
                    scoreHtml.textContent = scores
                    flippedCards = [];
                    if (allCardsOpened()) {
                        console.log(time);
                        clearInterval(timer)
                    }
                }
            }
        }
    };
};

function countTime() {
    let sec = 0
    timer = setInterval(() => {
        if (sec < 60) {
            if (sec <= 9) {
                time.textContent = '00:0' + sec;
            } else {
                time.textContent = '00:' + sec;
            }
        } else {
            const minutes = Math.floor(sec / 60);
            const remainingSeconds = sec % 60;
            const displayMinutes = minutes <= 9 ? '0' + minutes : minutes;
            const displaySeconds = remainingSeconds <= 9 ? '0' + remainingSeconds : remainingSeconds;
            time.textContent = `${displayMinutes}:${displaySeconds}`;
        }
        sec++;
        console.log(time);
    }, 1000)
}

function allCardsOpened() {
    return openedCards.length === emojis.length;
}