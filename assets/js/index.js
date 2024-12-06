'use strict';

import { select, listen } from "./utils.js";
import data from "../data/word-bank.js";
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
let wordToTypeIndex = 0;
let intervalId = null;
let hits = 0;
let letterElements = [];
let animatedLetters = [];

intro();

function intro() {
    stop();
    containerIntroObj.style.display = 'block';
}

function play() {
    stop();
    wordToTypeIndex = 0;
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
    gameCounterObj.innerText = `${TOTAL_SECONDS}`;

    let counter = TOTAL_SECONDS;
    hits = 0;
    wordToType = getWordToType();

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

function getWordToType() {
    letterElements = [];
    animatedLetters = [];

    const wordToType = wordBank[wordToTypeIndex];

    if (wordToType.length > 9) {
        outputObj.style.fontSize = '77px';
    } else {
        outputObj.style.fontSize = '90px';
    }

    //BEFORE: outputObj.innerText = wordToType;
    outputObj.innerHTML = [...wordToType]
        .map(letter => `<span class="letter">${letter}</span>`)
        .join('');

    letterElements = document.querySelectorAll('.letter');

    return wordToType;
}

function areWordsIquals(input, wordToType) {
    if (input.toLowerCase() === wordToType.toLowerCase()) {
        wordToTypeIndex++;
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

function applyEffect(input, wordToType) {
    for (let i = 0; i < input.length; i++) {
        if (input[i] === wordToType[i] && 
            !animatedLetters.includes(i) && 
            input.slice(0, i) === wordToType.slice(0, i)) {
            const letter = letterElements[i];

            if (letter) {
                letter.style.transform = 'translateX(-300px)';
                letter.style.opacity = '0';
                animatedLetters.push(i);
            }
        }
    }
}

listen('input', inputObj, () => {
    const input = inputObj.value.trim();

    applyEffect(input, wordToType);

    if (areWordsIquals(input, wordToType)) {
        hits++;
        console.log(" wordBank.length", wordBank.length)
        const percentage = (hits * 100) / wordBank.length;
        hitsObj.innerText = `${hits} hit${hits === 1 ? '' : 's'}\n${percentage}%\n`;

        if (wordToTypeIndex < wordBank.length) {
            wordToType = getWordToType();

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
    gameVideoObj.currentTime = 10;
    gameVideoObj.play();
});

listen('ended', gameAudioObj, () => {
    gameAudioObj.currentTime = 4;
    gameAudioObj.play();
});