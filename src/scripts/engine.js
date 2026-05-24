const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardsSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides: {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards"),
    },
    actions:{
        button: document.getElementById("next-duel"),
    }
};

const playerSides = {
    player1: "player-cards",
    computer: "computer-cards"
};

const cardData = [
    {
        id: 0,
        name: "Blue-Eyes White Dragon",
        type: "Paper",
        image: "./src/assets/icons/dragon.png",
        WindOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        image: "./src/assets/icons/magician.png",
        WindOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        image: "./src/assets/icons/exodia.png",
        WindOf: [0],
        LoseOf: [1],
    },
];

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);   
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if (fieldSide === playerSides.player1) {
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });

        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(IdCard);
        });

        cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    }
    return cardImage;
}

async function setCardsField(IdCard) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    await hiddenCardDetails();

    state.fieldCards.player.src = cardData[IdCard].image;
    state.fieldCards.computer.src = cardData[computerCardId].image;

    let duelResult = await checkDuelResult(IdCard, computerCardId);

    await updateScore();
    await drawButton(duelResult);
}

async function hiddenCardDetails() {
    state.cardsSprites.avatar.src = "";
    state.cardsSprites.name.innerText = "";
    state.cardsSprites.type.innerText = "";
}

async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function checkDuelResult(playerCardId, computerCardId) {
    let duelResult = "DRAW";
    let playerCard = cardData[playerCardId];

    if (playerCard.WindOf.includes(computerCardId)) {
        duelResult = "win";
        state.score.playerScore++;
    }

    if (playerCard.LoseOf.includes(computerCardId)) {
        duelResult = "lose";
        state.score.computerScore++;
    }

    await playAudio(duelResult);

    return duelResult;
}

async function removeAllCardsImages() {
    let cards = state.playerSides.computerBOX;
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    cards = state.playerSides.player1BOX;
    imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(IdCard) {
    state.cardsSprites.avatar.src = cardData[IdCard].image;
    state.cardsSprites.name.innerText = cardData[IdCard].name;
    state.cardsSprites.type.innerText = "Atributte: " + cardData[IdCard].type;
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const IdCard = await getRandomCardId();
        const cardImage = await createCardImage(IdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);

    }
}

async function resetDuel(){
    state.cardsSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}


async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.volume = 0.2;
    
    try{
        audio.play();
    }catch{

    }

}

function init() {
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
    
    
    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.volume = 0.1;
    bgm.play();
}

init();