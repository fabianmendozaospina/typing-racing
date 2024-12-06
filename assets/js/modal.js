'use strict';

import { select, listen } from "./utils.js";

const infoBtn = select('.info');
const infoVideo = select('.info-video');
const modalOverlay = select('.modal-overlay');
const modal = select('.modal');
const logo = select('.logo');
const closeBtn = select('.info-close');

const closeModal = () => {
    modalOverlay.classList.remove('active');
    modal.classList.remove('active');
    logo.style.visibility = 'visible';
    infoVideo.pause();
};

listen('click', infoBtn, () => {
    modalOverlay.classList.add('active');
    modal.classList.add('active');

    setTimeout(() => {
        logo.style.visibility = 'hidden';
    }, 300);

    infoVideo.currentTime = 0;
    infoVideo.play();
});

listen('click', closeBtn, () => {
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