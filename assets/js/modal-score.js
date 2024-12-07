'use strict';

import { select, listen, formatCounter, formatDate, formatPercentage } from "./utils.js";
//TODO: Check possibility to use the class Score:
//import Score from "./Score.js";

const LS_SCORES = 'scores';
const scoreOpen = select('.score-open');
const modalOverlay = select('.modal-score-container');
const modal = select('.modal-score');
const logo = select('.logo');
const scoreClose = select('.score-close');
const scoreTable = select('.score-table');
const gameScoreOpen = select('.game-score-open');
const rootStyles = getComputedStyle(document.documentElement);
const mainFont = rootStyles.getPropertyValue('--app-main-font').trim();
const monospaceFont = rootStyles.getPropertyValue('--app-monospace-font').trim();

function openModal() {
    modalOverlay.classList.add('active');
    modal.classList.add('active');

    setTimeout(() => {
        logo.style.visibility = 'hidden';
        showScores();
    }, 300);
}

function closeModal() {
    modalOverlay.classList.remove('active');
    modal.classList.remove('active');
    logo.style.visibility = 'visible';
};

function existScores() {
    return localStorage.length > 0 && LS_SCORES in localStorage;
}

function getScores() {
    let scores = [];

    if (existScores()) {
        scores = JSON.parse(localStorage.getItem(LS_SCORES));
    }

    return scores;
}

export function saveScore(hits, percentage) {
    const date = new Date();
    
    //TODO: Check possibility to use the class Score:
    //scores.push(new Score(date, hits, percentage));

    let scores = getScores();
    const newScore = {
        hits,
        percentage,
        date
    };

    scores.push(newScore);
    scores.sort((a, b) => b.hits - a.hits);
    scores = scores.splice(0, 10);

    localStorage.setItem(LS_SCORES, JSON.stringify(scores));   
}

function showScores() {
    if (!existScores()) {
        scoreTable.style.fontFamily = mainFont;
        scoreTable.innerHTML = "<br>There are no scores yet";
        return;
    }

    scoreTable.style.fontFamily = monospaceFont;
    const scores = getScores();
    let table = `<table><th>Pos.</th>
                        <th>Hits</th>
                        <th>Perc.</th>
                        <th>Date</th>`;
    
    for (let i = 0; i < scores.length; i++) {
        const score = scores[i];
        const position = formatCounter(i + 1, ' ');
        const hits = formatCounter(score.hits);
        const percentage = formatPercentage(score.percentage);
        const date = formatDate(score.date);
        
        table = table + `<tr><td>#${position}</td>
                             <td>${hits}</td>
                             <td>${percentage}</td>
                             <td>${date}</td></tr>`;
    }

    table = table + '</table>';
    scoreTable.innerHTML = table;    
}

listen('click', scoreOpen, () => {
    openModal();
});

listen('click', gameScoreOpen, () => {
    openModal();
});

listen('click', scoreClose, () => {
    closeModal();
});

listen('keydown', document, (event) => {
    if (event.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
    }
});

listen('click', modalOverlay, (event) => {
    if (event.target === modalOverlay) {
        closeModal();
    }
});