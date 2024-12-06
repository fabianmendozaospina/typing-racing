'use strict';

import { select, listen } from "./utils.js";

const scoreOpen = select('.score-open');
const modalOverlay = select('.modal-score-container');
const modal = select('.modal-score');
const logo = select('.logo');
const scoreClose = select('.score-close');

const closeModal = () => {
    modalOverlay.classList.remove('active');
    modal.classList.remove('active');
    logo.style.visibility = 'visible';
};

listen('click', scoreOpen, () => {
    modalOverlay.classList.add('active');
    modal.classList.add('active');

    setTimeout(() => {
        logo.style.visibility = 'hidden';
    }, 300);
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