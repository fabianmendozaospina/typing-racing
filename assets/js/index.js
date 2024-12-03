'use strict';

import { select, listen } from "./utils.js";
import data from "./data.js"
import Score from "./Score.js";

const TOTAL_SECONDS = 99;
const containerIntroObj = select('.container-intro');
const containerStartObj = select('.container-start');
const containerRacingObj = select('.container-racing');
const introAudioObj = select('.intro-audio');
const introVideoObj = select('.intro-video');
const inputObj = select('.input');
const outputObj = select('.output');
const hitsObj = select('.hits');
const startObj = select('.start');
const restartObj = select('.restart');
const gameCounterObj = select('.racing-counter');
const scores = [];
let hits = 0;
let currentIndexWord = 0;
let intervalId = null;
let wordToType = '';
let wordBank = data;

gameCounterObj.innerText = `${TOTAL_SECONDS}`;

function intro() {
    stop();
    containerIntroObj.style.display = 'block';
}

function play() {
    stop();
    containerStartObj.style.display = 'block';

    currentIndexWord = 0;
    wordBank = shuffleWords();
    inputObj.disabled = false;
    inputObj.value = '';
    outputObj.innerText = '';
    hitsObj.innerText = '';

    setTimeout(() => {
        introVideoObj.play();
        introAudioObj.play(); 
    }, 1000);

    setTimeout(() => {    
        containerIntroObj.style.display = 'none';
        containerRacingObj.style.visibility = 'visible';
        start();        

    }, 4100);  
}

function start() {
    inputObj.style.visibility = 'visible';
    inputObj.focus();
    inputObj.value = '';

    let counter = TOTAL_SECONDS;
    hits = 0;
    wordToType = getShuffledWord();

    intervalId = setInterval(() => {
        if (counter > 0) {
            counter--;
            gameCounterObj.innerText = formatCounter(counter);
        }

        if (counter === 0) {
            outputObj.innerText = 'Game Over!';
            stop();
            createScore();
        }
    }, 1000);
}

function stop() {
    clearInterval(intervalId);

    introVideoObj.pause();
    introAudioObj.pause();
    introVideoObj.currentTime = 0;    
    introAudioObj.currentTime = 0;    

    containerIntroObj.style.display = 'none';
    containerRacingObj.style.visibility = 'hidden';
    inputObj.style.visibility = 'hidden';
}

function shuffleWords() {
    return wordBank.toSorted(() => Math.random() - 0.5);
}

function getShuffledWord() {
    const wordToShow = wordBank[currentIndexWord];
    outputObj.innerText = wordToShow;

    return wordToShow;
}

function areWordsIquals(input, wordToType) {
    if (input.toLowerCase() === wordToType.toLowerCase()) {
        currentIndexWord++;
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

        if (currentIndexWord < wordBank.length) {
            wordToType = getShuffledWord();

        } else {
            outputObj.innerText = 'Congrats!!';
            stop();
            createScore();
        }
    }
});


listen('click', startObj, play);

listen('click', restartObj, play);

intro();