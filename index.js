const DOM = generateElementsVariable([
    "settings",
    "colorLength",
    "length",
    "game",
    "answer",
    "guesses",
    "activeGuess",
    "choices",
    "start"
]);
let colors = [];
let answer = [];
let activeGuess = [];
let guesses = [];

function generateElementsVariable(list) {
    let dom = {};
    for (let item of list) {
        dom[item] = document.getElementById(item);
    }
    return dom;
}

function randomColor() {
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += Math.floor(Math.random() * 15).toString(16);
    }
    return color;
}

function reset() {
    colors = [];
    guesses = [];
    activeGuess = [];
    DOM.guesses.innerText = "";
    DOM.answer.innerText = "";
    DOM.choices.innerText = "";
}

function createColorElement(parent, color, hidden) {
    let element = document.createElement("div");
    element.className = hidden ? "color hiddenColor" : "color";
    element.dataset.color = color;
    parent.appendChild(element);
}

function moveGuess(e) {
    let guessrow = Array.from(DOM.activeGuess.children);
    let length = parseInt(DOM.length.value);
    if (activeGuess.length === length) {
        guesses.push(activeGuess);
        let blackpegs = 0;
        let whitepegs = 0;
        activeGuess.filter((item, index) => item === answer[index]);
        for (let i = 0; i < length; i++) {
            guessrow[i].dataset.color = "#FFFFFF";
            if (activeGuess[i] === answer[i]) {
                blackpegs++;
            }
        }
        activeGuess = [];
    } else {
        activeGuess.push(e.target.dataset.color);
        guessrow[activeGuess.length - 1].dataset.color = e.target.dataset.color;
    }
}

function main() {
    reset();
    for (let i = 0; i < parseInt(DOM.colorLength.value); i++) {
        // create random colors
        colors.push(randomColor());
        createColorElement(choices, colors[i], false);
    }
    for (let i = 0; i < parseInt(DOM.length.value); i++) {
        // pick random colors from previously generated list to create answer
        answer.push(colors[Math.floor(Math.random() * colors.length)]);
        createColorElement(answer, answer[i], true);
        createColorElement(activeGuess, "#FFFFFF", false);
    }
    DOM.settings.style.width = "0";
}

document.addEventListener("start");
DOM.choices.addEventListener("click", moveGuess);
