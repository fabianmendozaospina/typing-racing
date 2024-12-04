'use strict';

import { select, listen } from "./utils.js";
import data from "./data.js"
import Score from "./Score.js";

const TOTAL_SECONDS = 99;
const containerIntroObj = select('.container-intro');
const containerGameObj = select('.container-game');
const gameControlsObj = select('.game-controls');
const gameAudioObj = select('.game-audio');
const gameVideoObj = select('.game-video');
const inputObj = select('.input');
const outputObj = select('.output');
const hitsObj = select('.hits');
const startObj = select('.start');
const restartObj = select('.restart');
const gameCounterObj = select('.racing-counter');
const scores = [];

let wordBank = data;
let wordToType = '';
let indexWordToType = 0;
let hits = 0;
let intervalId = null;

gameCounterObj.innerText = `${TOTAL_SECONDS}`;

function intro() {
    stop();
    containerIntroObj.style.display = 'block';
}

function play() {
    stop();
    indexWordToType = 0;
    wordBank = shuffleWords();
    inputObj.disabled = false;
    inputObj.value = '';
    outputObj.innerText = '';
    hitsObj.innerText = '';

    setTimeout(() => {
        gameVideoObj.play();
        gameAudioObj.play(); 
    }, 1000);

    setTimeout(() => {    
        containerIntroObj.style.display = 'none';
        gameControlsObj.style.visibility = 'visible';
        start();        

    }, 4100);  
}

function start() {
    inputObj.style.visibility = 'visible';
    inputObj.focus();
    inputObj.value = '';

    let counter = TOTAL_SECONDS;
    let second = 0;
    hits = 0;
    wordToType = getShuffledWord();

    intervalId = setInterval(() => {
        if (counter > 0) {
            counter--;
            gameCounterObj.innerText = formatCounter(counter);
        }

        if (counter === 0) {
            outputObj.innerText = 'Game Over!';
            stop(false);
            createScore();
        }

        if (second === 100) {
            gameVideoObj.currentTime = 10; 
        }
        second++;
    }, 1000);
}

function stop(hideOutput = true) {
    clearInterval(intervalId);

    gameVideoObj.pause();
    gameAudioObj.pause();
    gameVideoObj.currentTime = 0;    
    gameAudioObj.currentTime = 0;    

    containerIntroObj.style.display = 'none';
    if (hideOutput) gameControlsObj.style.visibility = 'hidden';
    inputObj.style.visibility = 'hidden';
    containerGameObj.style.display = 'block';
}

function shuffleWords() {
    return wordBank.toSorted(() => Math.random() - 0.5);
}

function getShuffledWord() {
    const wordToShow = wordBank[indexWordToType];
    outputObj.innerText = wordToShow;

    return wordToShow;
}

function areWordsIquals(input, wordToType) {
    if (input.toLowerCase() === wordToType.toLowerCase()) {
        indexWordToType++;
        inputObj.value = '';

        return true;
    } 
    
    return false;
}

function createScore() {
    const date = new Date();
    const percentage = 0;
    scores.push(new Score(date, hits, percentage));    
}

function formatCounter(counter) {
    return (counter < 10 ? '0' : '') + `${counter}`;
}

listen('input', inputObj, () => {
    const input = inputObj.value.trim();

    if (areWordsIquals(input, wordToType)) {
        hits++;
        hitsObj.innerText = `Hits: ${formatCounter(hits)}\nPerc: 0%\n` ;

        if (indexWordToType < wordBank.length) {
            wordToType = getShuffledWord();

        } else {
            outputObj.innerText = 'Congrats!!';
            stop(false);
            createScore();
        }
    }
});

listen('click', startObj, play);

listen('click', restartObj, play);

listen('ended', gameVideoObj, () => {
    console.log("**** REINICIA VIDEO");
    gameVideoObj.currentTime = 10;
});

intro();