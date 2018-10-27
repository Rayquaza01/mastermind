const DOM = generateElementsVariable([
    "settings",
    "colorLength",
    "length",
    "game",
    "answer",
    "guesses",
    "activeGuess",
    "maxGuess",
    "choices",
    "start",
    "timer",
    "reset"
]);
let colors = [];
let answer = [];
let activeGuess = [];
let guesses = [];
let timer;

function generateElementsVariable(list) {
    let dom = {};
    for (let item of list) {
        dom[item] = document.getElementById(item);
    }
    return dom;
}

function incrementTimer() {
    DOM.timer.innerText = parseInt(DOM.timer.innerText) + 1;
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
    answer = [];
    clearInterval(timer);
    DOM.activeGuess.innerText = "";
    DOM.guesses.innerText = "";
    DOM.answer.innerText = "";
    DOM.choices.innerText = "";
    DOM.timer.innerText = "0";
    DOM.settings.style.width = "100%";
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
    // items in guess that were not guessed correctly
    let guessIncorrect = guess.filter((item, index) => item !== answer[index]);
    // get number of items of same position and value
    pegs["blackpegs"] = guess.length - guessIncorrect.length;
    // items in answer that were not guessed correctly
    let answerIncorrect = answer.filter((item, index) => item !== guess[index]);
    // item in notGuessed that appear in guess, only once per color
    pegs["whitepegs"] = answerIncorrect.filter(
        (item, index) =>
            // color was incorrect in guess and appears in answer
            guessIncorrect.includes(item) &&
            // trigger only once per color
            index === answerIncorrect.indexOf(item)
    ).length;
    return pegs;
}

function createPegs(pegs) {
    let ele = document.createElement("div");
    ele.className = "pegs";
    for (let i = 0; i < pegs.blackpegs; i++) {
        createColorElement(ele, "#000000", false);
    }
    for (let i = 0; i < pegs.whitepegs; i++) {
        createColorElement(ele, "#FFFFFF", false);
    }
    return ele;
}

function moveGuess(e) {
    if (e.target.classList.contains("color")) {
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
            guessrow.forEach(ele => (ele.style.backgroundColor = "#FFFFFF"));
            DOM.guesses.insertBefore(
                document.createElement("div"),
                DOM.guesses.firstChild
            );
            activeGuess.forEach(item =>
                createColorElement(DOM.guesses.firstChild, item, false)
            );
            DOM.guesses.firstChild.appendChild(createPegs(pegs));
            activeGuess = [];
            if (pegs.blackpegs === length) {
                // win code
                clearInterval(timer);
                Array.from(DOM.answer.children).forEach(ele =>
                    ele.classList.remove("hiddenColor")
                );
                DOM.choices.innerText = "You Win!";
            } else if (guesses.length === parseInt(DOM.maxGuess.value)) {
                // lose code
                Array.from(DOM.answer.children).forEach(ele =>
                    ele.classList.remove("hiddenColor")
                );
                clearInterval(timer);
                DOM.choices.innerText =
                    "You Lose! You guessed incorrectly " +
                    DOM.maxGuess.value +
                    " times!";
            }
        }
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
    timer = setInterval(incrementTimer, 1000);
}

DOM.start.addEventListener("click", main);
DOM.choices.addEventListener("click", moveGuess);
DOM.reset.addEventListener("click", reset);
