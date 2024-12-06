'use strict';

export function select(selector, scope = document) {
    return scope.querySelector(selector);
}

export function selectAll(selector, scope = document) {
    return [...scope.querySelectorAll(selector)];
}

export function listen(event, selector, callback) {
    return selector.addEventListener(event, callback);
}

export function getElement(selector, scope = document) {
    return scope.getElementById(selector);
}

export function formatCounter(counter, symbol = '0') {
    return (counter < 10 ? symbol : '') + `${counter}`;
}

export function formatDate(input) {
    let date;

    if (typeof input === "string") {
        date = new Date(input);
    }

    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'long',  
        day: 'numeric',
        year: 'numeric' 
    });

    return formattedDate;
}