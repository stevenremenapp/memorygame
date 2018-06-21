/*
 * Create a list that holds all of your cards
 */

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

 // Shuffle function from http://stackoverflow.com/a/2450976
// function shuffle(array) {
//  let currentIndex = array.length, temporaryValue, randomIndex;
//
//  while (currentIndex !== 0) {
//    randomIndex = Math.floor(Math.random() * currentIndex);
//    currentIndex--;
//    temporaryValue = array[currentIndex];
//    array[currentIndex] = array[randomIndex];
//    array[randomIndex] = temporaryValue;
//  }
//  return array;
// }

 /*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// let cardDeck = document.querySelector('.deck');
//
//
// cardDeck.addEventListener('click', function(event) {
//   const clickedCard = event.target;
//   console.log(clickedCard);
//   if (clickedCard.classList.contains('card')) {
//     clickedCard.classList.toggle('open');
//     clickedCard.classList.toggle('show');
//   }
// });

const cards = [{
  'name': 'typingCat',
  'src': 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy-downsized.gif'
},
{
  'name': 'fancyCat',
  'src': 'https://media.giphy.com/media/lE5u6gdLEXA9W/giphy.gif'
},
{
  'name': 'sandalCat',
  'src': 'https://media.giphy.com/media/8vQSQ3cNXuDGo/giphy-downsized.gif'
},
{
  'name': 'laserCat',
  'src': 'https://media.giphy.com/media/3oEduQAsYcJKQH2XsI/giphy-downsized.gif'
},
{
  'name': 'stairCat',
  'src': 'https://media.giphy.com/media/l4KibK3JwaVo0CjDO/giphy-downsized.gif'
},
{
  'name': 'pirateCat',
  'src': 'https://media.giphy.com/media/NGxO35FivioMw/giphy.gif'
},
{
  'name': 'purrito',
  'src': 'https://media.giphy.com/media/5HSYaZTcRpYnS/200w_d.gif'
},
{
  'name': 'massageCat',
  'src': 'https://media.giphy.com/media/FQaQtdbLnk676/giphy.gif'
}
];

// Shuffle the cards
let gameGrid = cards.concat(cards);
gameGrid.sort(function() {
  return 0.5 - Math.random()
});

// Create cards grid and append to the DOM
const game = document.getElementById('game');
const grid = document.createElement('section');
grid.setAttribute('class', 'grid');
game.appendChild(grid);

// Display the cards on the screen
// Steve Griffith: https://www.youtube.com/watch?v=AqgVLYpBWG8
for (let i = 0; i < gameGrid.length; i++) {
  console.log(gameGrid[i]);
  console.log(gameGrid[i].name);
  console.log(gameGrid[i].src);
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.name = gameGrid[i].name;

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

// Variables to track guessing in gameplay
// Restriction to selecting only two cards only works if selectedCount is outside of the event listener function
let selectedCount = 0;
let firstGuess = '';
let secondGuess = '';
// let previousSelection = null;
let delay = 1000;
let moveCount = 0;

// Allow to select certain cards
grid.addEventListener('click', function(event) {
  // Grab the clicked item
  let clickedCard = event.target;

  // Avoid clicking on certain items
  if (clickedCard.nodeName === 'SECTION' || clickedCard.parentNode.classList.contains('selected') || clickedCard.parentNode.classList.contains('matched')) {
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
        setTimeout(selectedCardsMatch, delay);
        setTimeout(resetGuesses, delay);
        setTimeout(moveCounter, delay);
        setTimeout(displayCatRating, delay);
      } else {
        setTimeout(resetGuesses, delay);
        setTimeout(moveCounter, delay);
        setTimeout(displayCatRating, delay);
      }
    }
    //Did not work with previousSelection assigned with let
    // previousSelection = clickedCard;
    // console.log(previousSelection);
    // console.log(clickedCard);
  }
});

// Function to check if cards match
function selectedCardsMatch() {
  let selected = document.querySelectorAll('.selected');
  selected.forEach(function(card) {
    card.classList.add('matched');
  });
};

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
};

// Function to track and display moveCount
function moveCounter() {
  moveCount++;
  let moveCountDisplay = document.querySelector('.moves');
  let moveTextDisplay = document.querySelector('.move-plural');
  moveCountDisplay.textContent = moveCount;
  if (moveCount >= 2) {
    moveTextDisplay.textContent = " Moves";
  } else {
    moveTextDisplay.textContent = " Move";
  }
}

// Function to track and display cat rating
function displayCatRating() {
  let catsList = document.getElementById('catRating');
  let cat = document.querySelectorAll('.cat');
  if (moveCount === 11) {
    catsList.removeChild(cat[0]);
  } else if (moveCount === 16) {
    catsList.removeChild(cat[0]);
  } else if (moveCount === 21) {
    catsList.removeChild(cat[0]);
  } else if (moveCount === 26) {
    catsList.removeChild(cat[0]);
  } else if (moveCount === 31) {
    catsList.removeChild(cat[0]);
  }
}
