const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".highscore");
const controls = document.querySelectorAll(".controls i");

let setIntervalId;
let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let score = 0;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `Pontuação Máxima: ${highScore}`;

const generateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {  
    clearInterval(setIntervalId);
    alert("Fim de Jogo! Pressione OK para jogar novamente...");
    location.reload();
}

const changeDirection = (e) => {
    //Varia a velocidade conforme a seta precionada 
    if (e.key === "ArrowUp" && velocityY != 1){
        velocityX = 0;
        velocityY = -1;    
    } 
    else if (e.key === "ArrowDown" && velocityY != -1){
        velocityX = 0;
        velocityY = 1;
    }
    else if (e.key === "ArrowLeft" && velocityX != 1){
        velocityX = -1;
        velocityY = 0;
    }
    else if (e.key === "ArrowRight" && velocityX != -1){
        velocityX = 1;
        velocityY = 0;
    }    

    iniciarJogo();
}

controls.forEach(key => {
    key.addEventListener("click", () => changeDirection({ key: key.dataset.key }));
})

const iniciarJogo = () => {   
    if (gameOver) return handleGameOver();
    
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    //Verifica se tocou a maçã
    if (snakeX === foodX && snakeY === foodY) {
        generateFoodPosition();
        snakeBody.push([foodX, foodY]);

        score++;
        highScore = score >= highScore ? score: highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Pontuação: ${score}`;
        highScoreElement.innerText = `Pontuação Máxima: ${highScore}`;
    }

    //Aumenta o tamanho do corpo da cobra
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    } 

    snakeBody[0] = [snakeX, snakeY];

    //Atualiza a cabeça da cobra baseada na velocidade atual
    snakeX += velocityX;
    snakeY += velocityY;

    //Verifica se a cobra bateu na parede
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        //Cria uma div para cada parte do corpo da cobra
        htmlMarkup += `<div class="snake-head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

        //Verifica se a cobra bateu nela mesma
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] == snakeBody[i][0]) {
            gameOver = true;            
        }
    }    

    playBoard.innerHTML = htmlMarkup;
}

generateFoodPosition();
setIntervalId = setInterval(iniciarJogo, 125);
document.addEventListener("keydown", changeDirection);