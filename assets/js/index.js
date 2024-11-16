'use strict';

const COUNTER = 99;
const containerIntroObj = select('.container-intro');
const containerStartObj = select('.container-start');
const containerRacingObj = select('.container-racing');
const introAudioObj = select('.intro-audio');
const introVideoObj = select('.intro-video');
const inputObj = select('.input');
const outputObj = select('.output');
const hitsObj = select('.hits');
const formContainerObj = select('.form-container');
const startObj = select('.start');
const restartObj = select('.restart');
const gameCounterObj = select('.racing-counter');
const baseWord = [
    'dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building',
    'population', 'weather', 'bottle', 'history', 'dream', 'character', 'money',
    'absolute', 'discipline', 'machine', 'accurate', 'connection', 'rainbow',
    'bicycle', 'eclipse', 'calculator', 'trouble', 'watermelon', 'developer',
    'philosophy', 'database', 'periodic', 'capitalism', 'abominable', 'phone',
    'component', 'future', 'pasta', 'microwave', 'jungle', 'wallet', 'canada',
    'velvet', 'potion', 'treasure', 'beacon', 'labyrinth', 'whisper', 'breeze',
    'coffee', 'beauty', 'agency', 'chocolate', 'eleven', 'technology',
    'alphabet', 'knowledge', 'magician', 'professor', 'triangle', 'earthquake',
    'baseball', 'beyond', 'evolution', 'banana', 'perfume', 'computer',
    'butterfly', 'discovery', 'ambition', 'music', 'eagle', 'crown',
    'chess', 'laptop', 'bedroom', 'delivery', 'enemy', 'button', 'door', 'bird',
    'superman', 'library', 'unboxing', 'bookstore', 'language', 'homework',
    'beach', 'economy', 'interview', 'awesome', 'challenge', 'science',
    'mystery', 'famous', 'league', 'memory', 'leather', 'planet', 'software',
    'update', 'yellow', 'keyboard', 'window', 'beans', 'truck', 'sheep',
    'blossom', 'secret', 'wonder', 'enchantment', 'destiny', 'quest', 'sanctuary',
    'download', 'blue', 'actor', 'desk', 'watch', 'giraffe', 'brazil',
    'audio', 'school', 'detective', 'hero', 'progress', 'winter', 'passion',
    'rebel', 'amber', 'jacket', 'article', 'paradox', 'social', 'resort',
    'mask', 'escape', 'promise', 'band', 'level', 'hope', 'moonlight', 'media',
    'orchestra', 'volcano', 'guitar', 'raindrop', 'inspiration', 'diamond',
    'illusion', 'firefly', 'ocean', 'cascade', 'journey', 'laughter', 'horizon',
    'exploration', 'serendipity', 'infinity', 'silhouette', 'wanderlust',
    'marvel', 'nostalgia', 'serenity', 'reflection', 'twilight', 'harmony',
    'symphony', 'solitude', 'essence', 'melancholy', 'melody', 'vision',
    'silence', 'whimsical', 'eternity', 'cathedral', 'embrace', 'poet', 'ricochet',
    'mountain', 'dance', 'sunrise', 'dragon', 'adventure', 'galaxy', 'echo',
    'fantasy', 'radiant', 'serene', 'legend', 'starlight', 'light', 'pressure',
    'bread', 'cake', 'caramel', 'juice', 'mouse', 'charger', 'pillow', 'candle',
    'film', 'jupiter'
];

const shuffleWords = [...baseWord];
let wordsRightTyped = 0;
let wordToType = '';
let intervalId = null;

gameCounterObj.innerText = `${COUNTER}`;

function listen(event, scope, callback) {
    return scope.addEventListener(event, callback);
}

function select(scope, parent = document) {
    return parent.querySelector(scope);
}

function getElement(scope, parent = document) {
    return parent.getElementById(scope);
}

function play() {
    introVideoObj.pause();
    introAudioObj.pause();
    introVideoObj.currentTime = 0;    
    introAudioObj.currentTime = 0;    

    containerIntroObj.style.display = 'none';
    containerRacingObj.style.visibility = 'hidden';
    containerStartObj.style.display = 'block';

    shuffleWords.length = 0;
    shuffleWords.push(...baseWord);
    inputObj.disabled = false;
    inputObj.value = '';
    outputObj.innerText = '';
    hitsObj.innerText = '';

    setTimeout(() => {
        introVideoObj.play();
        introAudioObj.play(); 
    }, 1000);

    setTimeout(() => {    
        clearInterval(intervalId);
        containerIntroObj.style.display = 'none';
        containerRacingObj.style.visibility = 'visible';
        start();        

    }, 4100);  
}

function start() {
    inputObj.style.visibility = 'visible';
    inputObj.focus();
    inputObj.value = '';

    let counter = COUNTER;
    wordsRightTyped = 0;
    wordToType = showShuffleWord();

    intervalId = setInterval(() => {
        if (counter > 0) {
            counter--;
            gameCounterObj.innerText = formatCounter(counter);
        }

        if (counter === 0) {
            outputObj.innerText = 'Game Over!';
            stop();
        }
    }, 1000);
}

function getShuffleWord(array) {
    //TODO: See the way to do it with the method toSorted();
    let index = Math.floor(Math.random() * array.length);
    return array[index];
}

function showShuffleWord() {
    const wordToShow = getShuffleWord(shuffleWords);
    outputObj.innerText = wordToShow;
    return wordToShow;
}

function areWordsIquals(input, wordToType) {
    if (input.toLowerCase() === wordToType.toLowerCase()) {
        const index = shuffleWords.findIndex(word => word.toLowerCase() === wordToType.toLowerCase());

        if (index !== -1) {
            shuffleWords.splice(index, 1);
        }

        inputObj.value = '';

        return true;
    } 
    
    return false;
}

function stop() {
    clearInterval(intervalId);
    inputObj.style.visibility = 'hidden';
    introVideoObj.pause();
    introAudioObj.pause();
    introVideoObj.currentTime = 0;                    
    introAudioObj.currentTime = 0;
}

function formatCounter(counter) {
    return (counter < 10 ? '0' : '') + `${counter}`;
}

listen('input', inputObj, () => {
    const input = inputObj.value.trim();

    if (areWordsIquals(input, wordToType)) {
        wordsRightTyped++;
        hitsObj.innerText = `Hits: ${formatCounter(wordsRightTyped)}`;

        if (shuffleWords.length > 0) {
            wordToType = showShuffleWord();

        } else {
            outputObj.innerText = 'Congrats!!';
            stop();
        }
    }
});


listen('click', startObj, play);

listen('click', restartObj, play);

