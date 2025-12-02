// Importação de bibliotecas:

//  // Declaração de variáveis:
const termoTable = document.getElementById('termoTable');
const termoMain = document.getElementById('termoMain');
const reloadButton = document.getElementById('reloadButton');
const hintButton = document.getElementById('hintButton');
const gameCard = document.getElementById('gameCard');
const gameBoard = document.getElementById('gameBoard');
let usedTermoDivs = Array.from(document.querySelectorAll('.termoCells'));
let newTermoDiv = [];
let inputs = Array.from(document.querySelectorAll('.termoInput'));
let wordGuess = [];
let mainGuess = [];
let winCond;
//  // Função de cálculo da tentavia:
function guessAnalisis(param) {
    inputs.forEach((input, idx) => {
        wordGuess[idx] = param.value || input.value;
    });
};
//  // Função de cálculo dos Handlers:
function handlerKeyboard(e, inp, idx, arrayRngWord) {
    guessAnalisis(e);
    const target = e.target;
    console.log(wordGuess);
    if(e.ctrlKey || e.metaKey) e.preventDefault();
    if(e.key === 'Backspace' && target.value !== '') {
        target.value = '';
    } else if(e.key === 'Backspace' && target.value === '') {
        if(idx > 0){
            inputs[idx - 1].focus();
        };
    };
    if(e.key === 'ArrowLeft') {
        if(idx > 0) {
            inputs[idx - 1].focus();
        } else if(idx == 0) {
            inputs[4].focus();
        };
    } else if(e.key === 'ArrowRight' || e.key === ' ') {
        if(idx < 4 ) {
            inputs[idx + 1].focus();
        } else if(idx == 4){
            inputs[0].focus();
        }
    } else if(e.key !== 'Enter' && isNaN(e.key)) {
        inp.value = '';
    };
    if(e.key === 'Enter') {
        wordGuess = wordGuess.filter(x => x != '');
        if(wordGuess.length == 5){
            wordGuess.forEach((String, idx) => {
                if(wordGuess[idx] == arrayRngWord[idx]) {
                    mainGuess[idx] = 1;
                } else if(arrayRngWord.includes(wordGuess[idx])) {
                    mainGuess[idx] = 2;
                } else {
                    mainGuess[idx] = 0;
                };
            });
            nextTry(mainGuess, arrayRngWord);
        };
    };
};
function handlerInput(e, inp, idx) {
    guessAnalisis(e);
    const target = e.target;
    target.value = target.value.replace(/[^a-zA-Z\s]/g, '');
    target.value = target.value.toUpperCase();
    if(inp.value !== '' && idx < 4) {
        if(inputs[idx + 1].value == '') {
            inputs[idx + 1].focus();
        };
    };
}
function inputLife(inputs, arrayRngWord) {
    inputs.forEach((inp, idx) => {
        inp.addEventListener('keydown', (e) => handlerKeyboard(e, inp, idx, arrayRngWord));
        inp.addEventListener('input', (e) => handlerInput(e, inp, idx));
        inp.addEventListener('paste', (e) => e.preventDefault());
    });
};
//  // Função de cálculo da próxima tentativa:
function nextTry(guess, arrayRngWord) {
    console.log(guess);
    // Remove os inputs e salva:
    inputs.forEach((input, idx) => {
        const parent = inputs[idx].parentElement
        inputs[idx].remove();
        parent.innerHTML = input.value;
        if(guess[idx] == 1) {
            parent.classList.add('termoRight');
        } else if(guess[idx] == 2) {
            parent.classList.add('termoDoubt');
        } else if(guess[idx] == 0) {
            parent.classList.add('termoWrong');
        };
    });
    winCond = 0;
    guess.forEach(El => {
        if(El != 1) {
            winCond += 1;
        };
    });
    if(winCond == 0) {
    //  //  // Vitória:
        console.log('Parabéns! Você ganhou!!!')
        gameCard.style.zIndex = '0';
        gameBoard.innerText = 'Parabéns! Você ganhou!!!';
    } else if(usedTermoDivs.length == 5) {
    //  //  // Derrota:
        console.log('Que pena! Você Perdeu :(')
        gameCard.style.zIndex = '0';
        gameBoard.innerText = 'Que pena! Você Perdeu :(';
    } else {
    //  //  // Next input:
        usedTermoDivs.splice(0, 5);
        newTermoDiv = usedTermoDivs.filter((El, idx) => idx < 5);
        console.log(usedTermoDivs);
        console.log(newTermoDiv);
        newTermoDiv.forEach((El) => {
            const input = document.createElement('input');
            input.classList.add('termoInput');
            input.type = 'text';
            input.autocomplete = 'off';
            El.appendChild(input);
        });
        inputs = Array.from(document.querySelectorAll('.termoInput'));
        wordGuess = [];
        mainGuess = [];
        winCond = 0;
        inputs[0].focus();
        inputLife(inputs, arrayRngWord);
    };
};
//  // Declaração da palavra:
async function rngWord() {
    const respostaFetch = await fetch('./palavras.json');
    const palavritas = await respostaFetch.json();
    let wordArray = Array.from(palavritas.palavras);
    wordArray = wordArray.filter(StringAtual => StringAtual.length == 5);
    const wordNum = Math.floor(Math.random()*wordArray.length);
    const randomWord = wordArray[wordNum]
    return randomWord;
};
//  // Funcionamento do jogo:
async function InitGame() {
    const randomWord = await rngWord();
    console.log(randomWord);
    let arrayRngWord = Array.from(randomWord);
    arrayRngWord.forEach((El, idx) => {
        arrayRngWord[idx] = El.toUpperCase();
    });
    console.log(arrayRngWord);
    inputLife(inputs, arrayRngWord);
    // Facilitamento de jogo:
        // Foco de Clique:
    termoMain.addEventListener('click', (e) => {
        if(!e.target.closest('input')) {
            const firstEmpty = inputs.find(inp => inp.value === '');
            (firstEmpty || inputs[0]).focus();
        };
    });
        // Foco de Teclado:
    termoTable.addEventListener('keydown', (e) => {
        const target = e.target;
        if(e.key === 'Ctrl') {
            e.preventDefault();
        };
        if(target.value != '' && e.key != 'Backspace' || !isNaN(e.key)) {
            e.preventDefault();
        };
    });
};
InitGame()
reloadButton.addEventListener('click', () => {
    location.reload()
})
hintButton.addEventListener('click', () => {
    gameBoard.innerHTML = 'Bem vindo ao termo do pae!';
    gameCard.style.zIndex = '0';

})