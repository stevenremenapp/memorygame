// debugger;

const allCards = [
  {
    name: 'typingCat',
    src: 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy-downsized.gif'
  },
  {
    name: 'fancyCat',
    src: 'https://media.giphy.com/media/lE5u6gdLEXA9W/giphy.gif'
  },
  {
    name: 'sandalCat',
    src: 'https://media.giphy.com/media/8vQSQ3cNXuDGo/giphy-downsized.gif'
  },
  {
    name: 'laserCat',
    src: 'https://media.giphy.com/media/3oEduQAsYcJKQH2XsI/giphy-downsized.gif'
  },
  {
    name: 'stairCat',
    src: 'https://media.giphy.com/media/l4KibK3JwaVo0CjDO/giphy-downsized.gif'
  },
  {
    name: 'pirateCat',
    src: 'https://media.giphy.com/media/NGxO35FivioMw/giphy.gif'
  },
  {
    name: 'purrito',
    src: 'https://media.giphy.com/media/5HSYaZTcRpYnS/200w_d.gif'
  },
  {
    name: 'massageCat',
    src: 'https://media.giphy.com/media/FQaQtdbLnk676/giphy.gif'
  }
];

const cards = [];

const gameModes = {
  four: {
    pairs: 2,
    rating: [3, 4, 5, 6]
  },
  eight: {
    pairs: 4,
    rating: [6, 8, 10, 12]
  },
  sixteen: {
    pairs: 8,
    rating: [12, 15, 18, 21]
  }
};

// Variables to track guessing in gameplay
let selectedCount = 0;
let firstGuess = '';
let secondGuess = '';
let matchCardCount = 0;
let matchCardCountToCompletion;
let numCardsSelected;
let ratingArray;
let delay = 1000;
let moveCount = 0;

//Function to randomly select from all cards array
function randomCardSelect() {
  //Clear previous card selections
  while (cards[0]) {
    cards.shift();
  }

  while (cards.length < numCardsSelected) {
    let cardChosen = allCards[Math.floor(Math.random() * allCards.length)];
    if (cards.includes(cardChosen) === false) {
      cards.push(cardChosen);
    }
  }
}

//Function to start gameplay
function startGame() {
  //Close the modal
  closeStartModal();

  //Check for existing game/grid and remove it
  checkForGrid();

  //Reset the cat game rating
  resetGameRating();

  //Reset the Move Counter
  resetMoveCounter();

  //Reset the Matched Card Counter
  resetMatchCardCounter();

  //Choose cards for deck based on difficulty chosen
  randomCardSelect();

  // Shuffle the cards
  let gameGrid = cards.concat(cards);
  gameGrid.sort(function() {
    return 0.5 - Math.random();
  });

  // Create cards grid and append to the DOM
  const game = document.getElementById('game');
  const grid = document.createElement('section');
  grid.setAttribute('class', 'grid');
  game.appendChild(grid);

  // Display the cards on the screen
  // Steve Griffith: https://www.youtube.com/watch?v=AqgVLYpBWG8
  for (let i = 0; i < gameGrid.length; i++) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.name = gameGrid[i].name;
    card.tabIndex = 1;

    // Create front of card
    const front = document.createElement('div');
    front.classList.add('front');

    // Create back of card
    const back = document.createElement('div');
    back.classList.add('back');
    back.style.backgroundImage = `url(${gameGrid[i].src})`;

    // Append to grid and card
    grid.appendChild(card);
    card.appendChild(front);
    card.appendChild(back);
  }

  //Start the timer
  timer();

  //Initiate gameplay function
  gameplay();
}

// Gameplay wrapped up in function
function gameplay() {
  function cardClickBehavior(event) {
    // Grab the clicked item
    // const clickedCard = {
    //   click: {

    //   },
    //   pressed: {

    //   }
    // }

    let clickedCard;

    console.log(event.type);
    if (event.type === 'click') {
      clickedCard = event.target;
    } else {
      clickedCard = event.target.children[0];
    }
    
    // let pressedCard = event.target.children[0];
    console.log(clickedCard);

    // Avoid clicking on certain items
    if (
      clickedCard.nodeName === 'SECTION' ||
      clickedCard.parentNode.classList.contains('selected') ||
      clickedCard.parentNode.classList.contains('matched')
    ) {
      return;
    }

    // Only allow two selected cards
    if (selectedCount < 2) {
      selectedCount++;
      // Track which card was selected for first guess
      if (selectedCount === 1) {
        firstGuess = clickedCard.parentNode.dataset.name;
        clickedCard.parentNode.classList.add('selected');
        // Track which card was selected for second guess
      } else {
        secondGuess = clickedCard.parentNode.dataset.name;
        clickedCard.parentNode.classList.add('selected');
      }
      // Run the match function if both guesses are not empty and the guesses' dataset names match
      if (firstGuess !== '' && secondGuess !== '') {
        if (firstGuess === secondGuess) {
          setTimeout(moveCounter, delay);
          setTimeout(displayGameRating, delay);
          setTimeout(selectedCardsMatch, delay);
          setTimeout(resetGuesses, delay);
        } else {
          setTimeout(moveCounter, delay);
          setTimeout(displayGameRating, delay);
          setTimeout(resetGuesses, delay);
        }
      }
    }
  }

  let grid = document.querySelector('.grid');

  // Allow to select certain cards by click
  grid.addEventListener('click', cardClickBehavior);

  // Allow to select certain cards by pressing enter when focused
  grid.addEventListener('keyup', function(e) {
    if (e.keyCode === 13) {
      // console.log(event);
      // let cardPressed = e.target.firstChild;
      // console.log(cardPressed);
      // let pressedCard = event.target.children[0];
      // console.log(pressedCard);
      cardClickBehavior(event);
      // let cardPressed = e.path[0].firstChild;
      // console.log(cardPressed);
      // console.log(e);
      // console.log(event);
      // cardClickBehavior(cardPressed);
    }
  });
}

// Function to reset guess cards & count
function resetGuesses() {
  firstGuess = '';
  secondGuess = '';
  selectedCount = 0;

  let selected = document.querySelectorAll('.selected');
  selected.forEach(function(card) {
    // Do not remove selected class if the cards match (aka leave them flipped over on the board)
    if (card.classList.contains('matched')) {
      return;
      // If the cards do not match flip them back over
    } else {
      card.classList.remove('selected');
    }
  });
}

// Function to track and display moveCount
function moveCounter() {
  moveCount++;
  let moveCountDisplay = document.querySelector('.moves');
  let moveTextDisplay = document.querySelector('.move-plural');
  moveCountDisplay.textContent = moveCount;
  if (moveCount >= 2) {
    moveTextDisplay.textContent = ' Moves';
  } else {
    moveTextDisplay.textContent = ' Move';
  }
}

// Function to track and display cat rating
function displayGameRating() {
  let catsList = document.getElementById('catRating');
  let cat = document.querySelectorAll('.cat');
  if (ratingArray.indexOf(moveCount) > -1) {
    catsList.removeChild(cat[0]);
  }
}

// Function to check if cards match
function selectedCardsMatch() {
  let selected = document.querySelectorAll('.selected');
  selected.forEach(function(card) {
    card.classList.add('matched');
  });

  //Check for game over and perform game over actions
  matchCardCount++;
  console.log('Match card count:' + matchCardCount);
  gameCompleted();
}

//Called so it can be accessed in the reset button event listener
let clock;

// Function for count up timer
function timer() {
  let sec = 0;

  function padValue(value) {
    if (value > 9) {
      return value;
    } else {
      return '0' + value;
    }
  }

  clock = setInterval(function() {
    // Putting minutes first causes weird hiccup at each turn from 59 secs to the next minute
    document.querySelector('.seconds').innerHTML = padValue(++sec % 60);
    document.querySelector('.minutes').innerHTML = padValue(parseInt(sec / 60, 10));
  }, 1000);
}

//Restart Icon functionality
let restartBtn = document.getElementById('restart');
restartBtn.addEventListener('click', function() {
  resetGuesses();
  clearInterval(clock);
  startGame();
});

function checkForGrid() {
  let grid = document.querySelector('.grid');
  if (document.body.contains(grid)) {
    grid.parentNode.removeChild(grid);
  }
}

function resetGameRating() {
  let catsList = document.getElementById('catRating');
  let catCount = catsList.childElementCount;
  console.log(catCount);

  // Can't append already existing cat li item because it is a textNode and appendChild only takes node object
  while (catCount < 5) {
    let newCatRating = document.createElement('li');
    newCatRating.innerHTML = '😸';
    newCatRating.setAttribute('class', 'cat');
    // let newCatRating = document.createTextNode('😸');
    catCount++;
    catsList.appendChild(newCatRating);
  }
  // try {
  //   throw new Error("hdsjfhgsdfh");
  // } catch (exception) {
  //   console.log("Error occurred, but handled.");
  // }
}

function resetMoveCounter() {
  moveCount = 0;
  let moveCountDisplay = document.querySelector('.moves');
  let moveTextDisplay = document.querySelector('.move-plural');
  moveCountDisplay.innerHTML = '';
  moveTextDisplay.innerHTML = '';
}

function resetMatchCardCounter() {
  matchCardCount = 0;
}

function gameCompleted() {
  // if (matchCardCount === 2) {
  if (matchCardCount === matchCardCountToCompletion) {
    console.log('GAME OVER!');

    //Display modal
    completedGameModal.style.display = 'block';

    //Display number of moves
    console.log(moveCount);
    let completedMovesDisplay = document.querySelector('.completedMoves');
    completedMovesDisplay.textContent = moveCount;

    //Stop clock
    clearInterval(clock);

    //Display time required
    let min = document.querySelector('.minutes').textContent;
    console.log('Min elapsed ' + min);
    let completedMinutesDisplay = document.querySelector('.completedMinutes');
    // if (min >= 01) {
    completedMinutesDisplay.textContent = min;
    // }
    let secs = document.querySelector('.seconds').textContent;
    console.log('Secs elapsed: ' + secs);
    let completedSecondsDisplay = document.querySelector('.completedSeconds');
    completedSecondsDisplay.textContent = secs;

    //Reset previous completed cat rating to 0
    let completedCatRating = document.getElementById('completedCatRating');
    let completedCats = completedCatRating.getElementsByClassName('cat');
    while (completedCats[0]) {
      completedCats[0].parentNode.removeChild(completedCats[0]);
    }
    //Display completed cat rating
    let catsList = document.getElementById('catRating');
    let catCount = catsList.childElementCount;
    for (let i = 0; i < catCount; i++) {
      let completedCatAdded = document.createElement('li');
      completedCatAdded.innerHTML = '😸';
      completedCatAdded.setAttribute('class', 'cat');
      completedCatRating.appendChild(completedCatAdded);
    }
  }
}

// Modal Functioning -- Brad Traversy: https://www.youtube.com/watch?v=6ophW7Ask_0

//Grab elements
let startGameModal = document.getElementById('startGameModal');
let completedGameModal = document.getElementById('completedGameModal');
let playAgainBtn = document.getElementById('playAgain');
let catGifsBtn = document.getElementById('catGifs');

//Listen for click on the Go! buttons

let gameSizeBtns = document.querySelector('.gameSizeBtns');

gameSizeBtns.addEventListener('click', function(event) {
  console.log(event);
  if (event.target.tagName === 'BUTTON') {
    let numberOfCards = event.target.dataset.numCards;

    //Set gameplay variables based on number of cards selected by user
    if (!Object.keys(gameModes).includes(numberOfCards)) {
      throw new Error('Game does not support the number of cards chosen.');
    } else {
      numCardsSelected = gameModes[numberOfCards].pairs;
      matchCardCountToCompletion = gameModes[numberOfCards].pairs;
      ratingArray = gameModes[numberOfCards].rating;

      startGame();
    }
  }
  event.stopPropagation();
});

playAgainBtn.addEventListener('click', function() {
  closeCompletedGameModal();
  openStartModal();
});

catGifsBtn.addEventListener('click', function() {
  closeCompletedGameModal();
  location.href = 'https://giphy.com/explore/cat';
});

//Function to close modal
function closeStartModal() {
  startGameModal.style.display = 'none';
}

//Function to open start modal
function openStartModal() {
  startGameModal.style.display = 'block';
}

function closeCompletedGameModal() {
  completedGameModal.style.display = 'none';
}
