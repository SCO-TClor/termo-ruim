//  // Importação de bibliotecas:

//  // Declaração de constantes:
const termoTable = document.getElementById('termoTable');
const termoMain = document.getElementById('termoMain');
const reloadButton = document.getElementById('reloadButton');
const hintButton = document.getElementById('hintButton');
const gameCard = document.getElementById('gameCard');
const gameBoard = document.getElementById('gameBoard');
const html = document.querySelector('html');
const themeButton = document.getElementById('themeButton');

//  //  Declaração de variáveis:
let inputs = Array.from(document.querySelectorAll('.termoInput'));
let usedTermoDivs = Array.from(document.querySelectorAll('.termoCells'));
let newTermoDiv = [];
let wordGuess = [];
let mainGuess = [];
let rightGuess = [];
let letter = {};
let temas = [];

//  // Importação de localStorage:
let mainWord    = JSON.parse(localStorage.getItem('answer'))      || '';
let trys        = JSON.parse(localStorage.getItem('try'))         || 0 ;
let atualTheme  = JSON.parse(localStorage.getItem('theme'))       || 0 ;
let localInputs = JSON.parse(localStorage.getItem('localInputs')) || [];

//  // Correção do joguinho:
if(trys >= 6) {
    localStorage.removeItem('answer');
    localStorage.removeItem('try');
    localStorage.removeItem('localInputs');
};

//  // Declaração da palavra:
async function rngWord(mainWord, trys) {
    //  // Caso queria escolher manualmente a palavra, escreva-a dentro
    //  //  do fallback e adicione uma string na constante 'calibrator'
    const calibrator = '';
    const fallback = 'cacau';
    if(calibrator.length === 0) {
        if(mainWord === '' && trys === 0) {
            const respostaFetch = await fetch('./palavras.json');
            const palavritas = await respostaFetch.json();
            let wordArray = Array.from(palavritas.palavras);
            wordArray = wordArray.filter(StringAtual => StringAtual.length == 5);
            const wordNum = Math.floor(Math.random()*wordArray.length);
            const randomWord = wordArray[wordNum];
            localStorage.setItem('answer', JSON.stringify(randomWord));
            return randomWord;
        } else {
            return mainWord;
        };
    } else {
        if(fallback.length != 5) {
            console.log('A palavra escolhida é inválida!');
            return;
        } else {
            return fallback;
        };
    };  
};
//  // localStorage use:
async function inputBuilder() {
    const chosed = await rngWord(mainWord, trys);
    console.log('localStorage:', localStorage);
    console.log(localInputs);
    for(let i = 0; i < trys; i++) {
        console.log(trys)
        inputs.forEach((input, idx) => {
            const parent = inputs[idx].parentElement;
            // Colocar o local Storage aqui
            inputs[idx].remove();
            parent.innerHTML = String(localInputs[i].wordGuess[idx]) || '';
            if(localInputs[i].mainGuess[idx] == 1) {
                parent.classList.add('termoRight');
            } else if(localInputs[i].mainGuess[idx] == 2) {
                parent.classList.add('termoDoubt');
            } else if(localInputs[i].mainGuess[idx] == 0) {
                parent.classList.add('termoWrong');
            };
        });
        usedTermoDivs.splice(0, 5);
        newTermoDiv = usedTermoDivs.filter((_El, idx) => idx < 5);
        newTermoDiv.forEach((El) => {
            const input = document.createElement('input');
            input.classList.add('termoInput');
            input.type = 'text';
            input.autocomplete = 'off';
            El.appendChild(input);
        });
        inputs = Array.from(document.querySelectorAll('.termoInput'));
    };
    inputs[0].focus();
    inputLife(inputs, Array.from(chosed).map(upper => upper.toUpperCase()));
    return chosed;
};
//  // Async function para os temas:
async function themeColor() {
    const themeCss = await fetch('./themes.css');
    const themes = await themeCss.text();
    temas = [...themes.matchAll(/:root\[data-theme='([^']+)'\]/g)].map(match => match[1])
    html.dataset.theme = temas[atualTheme];
    console.log('tema atual         :', temas[atualTheme]);
}
themeColor();
//  // Função de cálculo da tentavia:
function guessAnalisis() {
    inputs.forEach((input, idx) => {
        wordGuess[idx] = input.value || '';
    });
};
//  // Função de cálculo dos Handlers:
function handlerKeyboard(e, inp, idx, arrayRngWord, inputs) {
    guessAnalisis();
    const target = e.target;

    //  // Debug:
    console.log(e.key);

    //  // Tratamento inicial:
    if(e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Backspace' && e.key !== 'Enter') {
        if(e.key === 'F5') return;
        if(e.key === 'F12') return;
        if(!/^[a-z]$/i.test(e.key)) {
            e.preventDefault();
            return;
        };
    };
    //  // Backspace:
    if(e.key === 'Backspace' && target.value !== '') {
        e.preventDefault();
        target.value = '';
    } else if(e.key === 'Backspace' && target.value === '') {
        e.preventDefault();
        if(idx > 0){
            inputs[idx - 1].focus();
            if(inputs[idx - 1].value !== '') {
                inputs[idx - 1].value = '';
            };
        };
    };
    //  // Setas:
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
        };
    } else if(e.key !== 'Enter' && !isNaN(e.key)) {
        e.preventDefault();
        return;
    } else if(e.key !== 'Enter' && isNaN(e.key) && target.value != '') {
        target.value = '';
    };
    //  // Cálculo enter:
    if(e.key === 'Enter') {
        wordGuess = wordGuess.filter(x => x != '');
        if(wordGuess.length != 5) return;

        for(let i = 0; i < wordGuess.length; i++) {
            rightGuess[i] = 0;
        };
        letter = {};
        wordGuess.forEach((_tent, idx) => {
            if(wordGuess[idx] == arrayRngWord[idx]) {
                mainGuess[idx] = 1;
            };
        });
        // Quantas vezes aparece verde?
        for(let i = 0; i < wordGuess.length; i++) {
            if(mainGuess[i] == 1 ) {
                rightGuess[i] += 1;
            };
        };
        wordGuess.forEach((_tent, idx) => {
            if(arrayRngWord.includes(wordGuess[idx]) && 
            wordGuess[idx] !== arrayRngWord[idx]) {
                mainGuess[idx] = 2;
            } else {
                mainGuess[idx] = 0;
            };
        });
        wordGuess.forEach((tent, _idx) => {            // Para cada letra da resposta
            if(letter[tent] == null) {
                letter[tent] = { 
                    guessRep: 1,
                    answeRep: 0,
                    rightPlace: 0
                };
            } else {
                letter[tent].guessRep += 1;
            };
        });
        arrayRngWord.forEach((tent, _idx) => {            // Para cada letra da resposta
            if(letter[tent] == null) {
                letter[tent] = { 
                    guessRep: 0,
                    answeRep: 0,
                    rightPlace: 0
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
                    answeRep: 0,
                    rightPlace: 0
                };
                letter[key].rightPlace = (letter[key].rightPlace ?? 0) + 1;
            };
        });
        let usedLetters = {};
        for(let i = 0; i < wordGuess.length; i++) {
            const key = wordGuess[i];

            const guessRep = letter[key].guessRep;
            const answeRep = letter[key].answeRep;
            const rightPlace = letter[key].rightPlace;
            if(rightGuess[i] == 1) {
                mainGuess[i] = 1;
                //  // answeRep = Quantidade da resposta
                //  // guessRep = Quantidade da tentativa
                //  // rightPlace = Quantos no lugar correto
            } else if(mainGuess[i] == 2) {
                usedLetters[key] = usedLetters[key] || 0;
                if(usedLetters[key] + rightPlace >= answeRep) {
                    mainGuess[i] = 0;
                } else {
                    usedLetters[key]++;
                };
            };
        };

        // console.log('Letter setted  : ', letter);
        // Dados a serem salvos:
        console.log('Cor final      : ', mainGuess);
        console.log('Cor final      : ', wordGuess);
        console.log(localInputs);
        
        localInputs[trys] = { 
            wordGuess,
            mainGuess
        };
        trys = localInputs.length;
        console.log(trys);
        // Armazenamento de dados:
        localStorage.setItem('localInputs', JSON.stringify(localInputs));
        localStorage.setItem('try', JSON.stringify(trys));
        console.log('Tentativas : ',localStorage.getItem('try'));
        console.log('Inputs     : ',localStorage.getItem('localInputs'));

        nextTry(mainGuess, arrayRngWord);
    };
};
function handlerInput(e, inp, idx, inputs) {
    const target = e.target;
    const firstIdx = inputs.findIndex((input) => input.value === '');
    target.value = target.value.replace(/[^a-zA-Z\s]/g, '');
    target.value = target.value.toUpperCase();
    if(e.key !== 'Backspace') {
        if(inp.value !== '' && idx < 4) {
            if(inputs[idx + 1].value == '') {
                inputs[idx + 1].focus();
            } else if(firstIdx !== -1) {
                inputs[firstIdx].focus();
            };
        } else if(inp.value !== '' && idx == 4) {
            if(firstIdx !== -1) {
                inputs[firstIdx].focus();
            };
        };
    } else {
        inputs[idx - 1].value = '';
    };
};
function inputLife(inputs, arrayRngWord) {
    inputs.forEach((inp, idx) => {
        inp.addEventListener('keydown', (e) => handlerKeyboard(e, inp, idx, arrayRngWord, inputs));
        inp.addEventListener('input', (e) => handlerInput(e, inp, idx, inputs));
        inp.addEventListener('paste', (e) => e.preventDefault());
    });
};
//  // Função de cálculo da próxima tentativa:
function nextTry(guess, arrayRngWord) {
    // Remove os inputs e salva:
    inputs.forEach((input, idx) => {
        const parent = inputs[idx].parentElement;
        // Colocar o local Storage aqui
        inputs[idx].remove();
        if(parent == null) return;
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

        localStorage.removeItem('answer');
        localStorage.removeItem('try');
        localStorage.removeItem('localInputs');
    } else if(usedTermoDivs.length == 5) {
    //  //  // Derrota:
        console.log('Que pena! Você Perdeu :(')
        gameCard.style.zIndex = '0';
        gameBoard.innerText = 'Que pena! Você Perdeu :(';

        localStorage.removeItem('answer');
        localStorage.removeItem('try');
        localStorage.removeItem('localInputs');
    } else {
    //  //  // Next input:
        usedTermoDivs.splice(0, 5);
        newTermoDiv = usedTermoDivs.filter((_El, idx) => idx < 5);
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
//  // Funcionamento do jogo:
async function InitGame() {
    const randomNum = await inputBuilder()
    console.log(randomNum);
    let arrayRngWord = Array.from(randomNum);
    arrayRngWord.forEach((El, idx) => {
        arrayRngWord[idx] = El.toUpperCase();
    });
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
    localStorage.removeItem('answer');
    localStorage.removeItem('try');
    localStorage.removeItem('localInputs');
    location.reload();
});
hintButton.addEventListener('click', () => {
    if(gameCard.style.zIndex != '0') {
        gameBoard.innerHTML = 'Bem vindo ao termo do pae!';
        gameCard.style.zIndex = '0';
    } else {
        gameCard.style.zIndex = '-1';
    }
});
themeButton.addEventListener('click', () => {
    console.log('Quantidade de temas: ', temas.length);
    // Aqui deveria ter um + 1 no atualTheme, mas removi o último tema das opções (branco d+);
    if(atualTheme < temas.length - 1) {
        atualTheme++;
    } else {
        atualTheme = 0;
    };
    html.dataset.theme = temas[atualTheme];
    localStorage.setItem('theme', JSON.stringify(atualTheme))
    console.log('tema atual         :', temas[atualTheme]);
});

// Ao clicar