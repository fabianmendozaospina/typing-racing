'use strict';

import { select, listen } from "./utils.js";
import data from "./data.js"

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
let counterRightWords = 0;
let currentIndexWord = 0;
let wordToType = '';
let intervalId = null;
let wordBank = data;

gameCounterObj.innerText = `${TOTAL_SECONDS}`;

function play() {
    introVideoObj.pause();
    introAudioObj.pause();
    introVideoObj.currentTime = 0;    
    introAudioObj.currentTime = 0;    

    containerIntroObj.style.display = 'none';
    containerRacingObj.style.visibility = 'hidden';
    containerStartObj.style.display = 'block';

    currentIndexWord = 0;
    wordBank = getShuffleWords();
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

    let counter = TOTAL_SECONDS;
    counterRightWords = 0;
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

function getShuffleWords() {
    return wordBank.toSorted(() => Math.random() - 0.5);
}

function showShuffleWord() {
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
        counterRightWords++;
        hitsObj.innerText = `Hits: ${formatCounter(counterRightWords)}`;

        if (currentIndexWord < wordBank.length) {
            wordToType = showShuffleWord();

        } else {
            outputObj.innerText = 'Congrats!!';
            stop();
        }
    }
});


listen('click', startObj, play);

listen('click', restartObj, play);

