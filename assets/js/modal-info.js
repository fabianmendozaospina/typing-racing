'use strict';

import { select, listen } from "./utils.js";

const infoOpen = select('.info-open');
const infoVideo = select('.info-video');
const modalOverlay = select('.modal-info-container');
const modal = select('.modal-info');
const logo = select('.logo');
const infoClose = select('.info-close');
const gameInfoOpen = select('.game-info-open');

function openModal() {
    modalOverlay.classList.add('active');
    modal.classList.add('active');

    setTimeout(() => {
        logo.style.visibility = 'hidden';
    }, 300);

    infoVideo.currentTime = 0;
    infoVideo.play();    
}

function closeModal() {
    modalOverlay.classList.remove('active');
    modal.classList.remove('active');
    logo.style.visibility = 'visible';
    infoVideo.pause();
};

listen('click', infoOpen, () => {
    openModal();
});

listen('click', gameInfoOpen, () => {
    openModal();
});

listen('click', infoClose, () => {
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