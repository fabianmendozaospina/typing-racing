'use strict';

import { select, listen } from "./utils.js";

const infoBtn = select('.info');
const modalOverlay = select('.modal-overlay');
const modal = select('.modal');
const logo = select('.logo');

listen('click', infoBtn, () => {
    modalOverlay.classList.add('active');
    modal.classList.add('active');
    setTimeout(() => {
        logo.style.visibility = 'hidden';
    }, 300)
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

const closeModal = () => {
    modalOverlay.classList.remove('active');
    modal.classList.remove('active');
    logo.style.visibility = 'visible';
};