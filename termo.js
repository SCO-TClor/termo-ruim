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
let repNGuess;
let g = 0
let repeticoes = [];
let rightGuess = [];
let letter = {};
let winCond;
let x;
//  // Função de cálculo da tentavia:
function guessAnalisis(param) {
    inputs.forEach((input, idx) => {
        wordGuess[idx] = param.value || input.value;
    });
};
//  // Função de cálculo de repetição:          // Ver se a resposta já se repetiu
function repeatAnalisis(wordGuess, idx) {
    return wordGuess.some((item, i) => {
        return i < idx && item === wordGuess[idx];
    });
};
//  // Função de cálculo dos Handlers:
function handlerKeyboard(e, inp, idx, arrayRngWord) {
    guessAnalisis(e);
    const target = e.target;
    if(e.ctrlKey || e.metaKey || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault()
        return;
    };
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
            for(let i = 0; i <= wordGuess.length - 1; i++) {
                repeticoes[i] = 0;
                rightGuess[i] = 0;
            };
            wordGuess.forEach((tent, idx) => {
                if(wordGuess[idx] == arrayRngWord[idx]) {
                    mainGuess[idx] = 1;
                }
            });
            // Quantas vezes aparece verde?
            for(let i = 0; i <= wordGuess.length - 1; i++) {
                if(mainGuess[i] == 1 ) {
                    rightGuess[i] += 1;
                }
            }
            wordGuess.forEach((tent, idx) => {
                if(arrayRngWord.includes(wordGuess[idx]) && 
                wordGuess[idx] !== arrayRngWord[idx]) {
                    mainGuess[idx] = 2;
                } else {
                    mainGuess[idx] = 0;
                };
            });

            letter = {};

            wordGuess.forEach((tent, idx) => {            // Para cada letra da resposta
                if(letter[tent] == null) {
                    letter[tent] = {
                        guessRep: 1,
                        answeRep: 0
                    };
                } else {
                    letter[tent].guessRep += 1;
                }
            });
            arrayRngWord.forEach((tent, idx) => {            // Para cada letra da resposta
                if(letter[tent] == null) {
                    letter[tent] = {
                        answeRep: 0
                    };
                } else {
                    letter[tent].answeRep += 1;
                };
            });
            rightGuess.forEach((tent, idx) => {
                const key = arrayRngWord[idx];
                if(tent === 1) {
                    if(!letter[key]) letter[key] = { 
                        guessRep: 0,
                        answeRep: 0
                    };
                    letter[key].rightPlace = (letter[key].rightPlace ?? 0) + 1;
                }
            });
            for(let i = wordGuess.length - 1; i >= 0; i--) {
                if(rightGuess[i] == 1) {
                    mainGuess[i] = 1;
                } else if(mainGuess[i] == 2) {
                    mainGuess[i] = 2;
                } else {
                    mainGuess[i] = 0;
                }
            };
            console.log(letter);
            console.log(rightGuess)
            console.log('Cor final      : ', mainGuess);
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
};
function inputLife(inputs, arrayRngWord) {
    inputs.forEach((inp, idx) => {
        inp.addEventListener('keydown', (e) => handlerKeyboard(e, inp, idx, arrayRngWord));
        inp.addEventListener('input', (e) => handlerInput(e, inp, idx));
        inp.addEventListener('paste', (e) => e.preventDefault());
    });
};
//  // Função de cálculo da próxima tentativa:
function nextTry(guess, arrayRngWord) {
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
    // const randomWord = wordArray[wordNum]
    const randomWord = 'radar';
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
const html = document.querySelector('html');
let atualTheme = 0;
const themes = ['FutureNocturne', 'DesertMirage', 'ShineCoal', 'AuroraBloom', 'GalaxyPurple', 'ForestNight', 'DarkBlue'];
console.log('tema atual:',themes[atualTheme]);
hintButton.addEventListener('click', () => {
    // gameBoard.innerHTML = 'Bem vindo ao termo do pae!';
    // gameCard.style.zIndex = '0';
    console.log(themes.length);
    if(atualTheme+1 < themes.length) {
        atualTheme++;
    } else {
        atualTheme = 0;
    };
    html.dataset.theme = themes[atualTheme];
    console.log('tema atual:',themes[atualTheme]);
})