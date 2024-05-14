const body = document.querySelector('body')
const mainBox = document.querySelector('.main-box');
const resetBtn = document.querySelector('.reset-btn');
const scoreHtml = document.getElementById('score')
const clicksResult = document.querySelector('.clicks')
const time = document.querySelector('.time')
const playAgain = document.querySelector('.play-again-btn')
const startBtn = document.getElementById('startBtn')
const playerName = document.getElementById('playerName')
const resultsPlace = document.querySelector('.results-place')
const resultsPlayerName = document.querySelector('.results-name')
const resultsTime = document.querySelector('.results-time')
const resultsClicks = document.querySelector('.results-clicks')

const emojis = ["😇", "😇", "🤩", "🤩", "👀", "👀", "💛", "💛", "🙈", "🙈", "✨", "✨", "🥶", "🥶", "😶‍🌫️", "😶‍🌫️"];
const mixEmojis = emojis.sort(() => (Math.random() > .5) ? 2 : -1);

mainBox.classList.add('disable')

let flippedCards = []
let openedCards = []
let scores = 0
let timer
let clicks = 0
let round = 0
let playersArr = []

resetBtn.onclick = () => {
    window.location.reload();
};


startBtn.onclick = () => {
    console.log(playerName.value);
    mainBox.classList.remove('disable')
}


playAgain.onclick = () => {
    openedCards = [];
    scores = 0;
    clicks = 0;
    scoreHtml.textContent = scores;
    clicksResult.textContent = clicks;
    clearInterval(timer);
    timer = null;
    time.textContent = '00:00';
    playerName.value = playerName.value;
    const shuffledEmojis = [...emojis];
    shuffledEmojis.sort(() => 0.5 - Math.random());

    mainBox.innerHTML = '';

    shuffledEmojis.forEach(emoji => {
        const card = document.createElement('div');
        card.className = 'card';
        const front = document.createElement('div');
        front.className = 'front';
        const back = document.createElement('div');
        back.className = 'back';
        back.classList.add('backbg')
        back.textContent = ''
        front.textContent = emoji;
        card.appendChild(front);
        card.appendChild(back);
        mainBox.appendChild(card);
        card.onclick = () => {
            countUpdateClicks();
            if (!timer) {
                countTime();
            }
            if (!flippedCards.includes(card)) {
                card.classList.add('hover');

                flippedCards.push(card);

                if (flippedCards.length === 2) {
                    const emoji1 = flippedCards[0].querySelector('.front').textContent;
                    const emoji2 = flippedCards[1].querySelector('.front').textContent;
                    if (emoji1 !== emoji2) {
                        setTimeout(() => {
                            flippedCards.forEach(flippedCard => {
                                flippedCard.classList.remove('hover');
                            });
                            flippedCards = [];
                        }, 1000);
                    } else {
                        openedCards.push(emoji1, emoji2);
                        scores++;
                        scoreHtml.textContent = scores;
                        countUpdateClicks();
                        flippedCards = [];
                        if (allCardsOpened()) {
                            clearInterval(timer);
                            consoleResult(time.textContent);
                        }
                    }
                }
            }
        };
    });
};


function getCard() {
    for (let emoji of mixEmojis) {
        const card = document.createElement('div');
        card.className = 'card';
        const front = document.createElement('div');
        front.className = 'front';
        const back = document.createElement('div');
        back.className = 'back';
        back.classList.add('backbg')
        front.textContent = "";
        back.innerHTML = "";
        mainBox.appendChild(card)
        card.appendChild(front)
        card.appendChild(back)

        card.onclick = () => {
            countUpdateClicks()
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
                    if (emoji1 !== emoji2) {
                        setTimeout(() => {
                            flippedCards.forEach(flippedCard => flippedCard.classList.toggle('hover'));
                            flippedCards = [];
                        }, 1000);
                    } else {
                        openedCards.push(emoji1, emoji2);
                        scores++
                        scoreHtml.textContent = scores
                        countUpdateClicks()
                        flippedCards = [];
                        if (allCardsOpened()) {
                            clearInterval(timer);
                            consoleResult(time.textContent);
                        }
                    }
                }
            }
        };
    };
}
getCard()



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
    }, 1000)
}


function countUpdateClicks() {
    clicks++
    clicksResult.textContent = clicks
}

function allCardsOpened() {
    return openedCards.length === emojis.length;
}

function consoleResult(formattedTime) {
    resultsPlayerName.textContent = playerName.value;
    resultsClicks.textContent = clicks;
    resultsTime.textContent = "Time: " + formattedTime;
    const playerResult = {
        name: playerName.value,
        time: formattedTime,
        clicks: clicks
    };
    playersArr.push(playerResult);
    const resultsTableBody = document.getElementById('resultsTableBody');
    resultsTableBody.innerHTML = '';


    playersArr.sort((a, b) => {
        const timeComparison = timeToSeconds(a.time) - timeToSeconds(b.time);
        if (timeComparison !== 0) {
            return timeComparison;
        }
        return a.clicks - b.clicks;
    });

    playersArr.forEach((player, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${index + 1}</td><td>${player.name}</td><td>${player.time}</td><td>${player.clicks}</td>`;
        resultsTableBody.appendChild(row);
    });
}

function timeToSeconds(timeString) {
    const [minutes, seconds] = timeString.split(':').map(Number);
    return minutes * 60 + seconds;
}
