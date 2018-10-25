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
    element.style.backgroundColor = color;
    parent.appendChild(element);
}

function getPegs(guess, answer) {
    let pegs = {};
    // get number of items of same position and value
    pegs["blackpegs"] = guess.filter((item, index) => item === answer[index]).length;

    // items in answer that were not guessed correctly
    let notGuessed = answer.filter((item, index) => item !== guess[index]);
    // item in notGuessed that appear in guess, only once per color
    pegs["whitepegs"] = notGuessed.filter(
        (item, index) => guess.includes(item) && index === notGuessed.lastIndexOf(item)
    ).length;
    return pegs;
}

function moveGuess(e) {
    let guessrow = Array.from(DOM.activeGuess.children);
    let length = parseInt(DOM.length.value);
    if (activeGuess.length < length) {
        activeGuess.push(e.target.dataset.color);
        guessrow[activeGuess.length - 1].style.backgroundColor =
            e.target.style.backgroundColor;
    }
    if (activeGuess.length === length) {
        guesses.push(activeGuess);
        let pegs = getPegs(activeGuess, answer);
        console.log(pegs);
        if (pegs["blackpegs"] === length) {
            console.log("You win!");
            Array.from(DOM.answer.children).forEach(item => (item.className = "color"));
        }
        guessrow.forEach(ele => (ele.style.backgroundColor = "#FFFFFF"));
        DOM.guesses.insertBefore(document.createElement("div"), DOM.guesses.firstChild);
        activeGuess.forEach(item =>
            createColorElement(DOM.guesses.firstChild, item, false)
        );
        activeGuess = [];
    }
}

function main() {
    reset();
    for (let i = 0; i < parseInt(DOM.colorLength.value); i++) {
        // create random colors
        colors.push(randomColor());
        createColorElement(DOM.choices, colors[i], false);
    }
    for (let i = 0; i < parseInt(DOM.length.value); i++) {
        // pick random colors from previously generated list to create answer
        answer.push(colors[Math.floor(Math.random() * colors.length)]);
        createColorElement(DOM.answer, answer[i], true);
        createColorElement(DOM.activeGuess, "#FFFFFF", false);
    }
    DOM.settings.style.width = "0";
}

DOM.start.addEventListener("click", main);
DOM.choices.addEventListener("click", moveGuess);
