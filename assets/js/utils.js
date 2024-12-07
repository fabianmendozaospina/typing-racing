'use strict';

const rootStyles = getComputedStyle(document.documentElement);
export const mainFont = rootStyles.getPropertyValue('--app-main-font').trim();
export const monospaceFont = rootStyles.getPropertyValue('--app-monospace-font').trim();
export const outputFontBig = rootStyles.getPropertyValue('--app-output-font-size-big').trim();
export const outputFontSmall = rootStyles.getPropertyValue('--app-output-font-size-small').trim();


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

export function formatPercentage(input) {
    let value = input.toString();
    const sep = value.indexOf(',') > -1 ? ',' : '.';

    if (isInteger(value)) {
        value = value + '.0'
    }

    return value + '0'.repeat(5 - value.length) + '%';
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

function isInteger(value) {
    const regex = /^-?\d+$/;
    return regex.test(value);
}