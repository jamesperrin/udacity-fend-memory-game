/*
 * Instructional guides:
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

( function () {
    'use strict';

    /*
     * Global variables
     */
    const MemoryGame = {};

    const startButtonState = {
        'start': 'start',
        'stop': 'stop'
    };

    const gameTimerState = {
        'start': true,
        'stop': false
    };

    const elementState = {
        'hide': true,
        'show': false
    };

    const cardsList = ['fa-anchor', 'fa-anchor', 'fa-bicycle', 'fa-bicycle', 'fa-bolt', 'fa-bolt', 'fa-bomb', 'fa-bomb', 'fa-cube', 'fa-cube', 'fa-diamond', 'fa-diamond', 'fa-leaf', 'fa-leaf', 'fa-paper-plane-o', 'fa-paper-plane-o'];
    const cardDeckGameboard = document.querySelector('.deck');
    const finalScoreModal = document.querySelector('.final-score-modal');
    const finalScoreMovesSpan = document.querySelector('.final-score-moves span');
    const finalScoreRatingSpan = document.querySelector('.final-score-rating span');
    const finalScoreTimeSpan = document.querySelector('.final-score-time span');
    const timerMintuesSpan = document.querySelector('.timer-minutes');
    const timerSecondsSpan = document.querySelector('.timer-seconds');
    const playerMovesSpan = document.querySelector('span.moves');
    let openedCardsList = []; // Create a list that holds all of your cards    
    let playerMovesCounter = 0;
    let playerRatingCounter = 3;
    let timerInterval = null;
    let gameTimer = 0;
    let timerMinutes = 0;
    let timerSeconds = 0;

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Private functions
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * @description Helper function to hide HTML elements
     * @param {boolean} doHide 
     * @param {Object} htmlElement 
     */
    function sectionHide(doHide, htmlElement) {
        if (doHide) {
            htmlElement.classList.add('hidden');
        } else {
            htmlElement.classList.remove('hidden');
        }
    }

    /**
     * @description Helper function to check gameboard for orphaned opened cards
     */
    function checkOrphanedOpenedCards() {
        const orphanedOpenCards = document.querySelectorAll('li.open');
        orphanedOpenCards.forEach(el => MemoryGame.HideCard(el) );
    }

    /**
     * @description Helper function to change Start button state.
     * @param {string} state 
     */
    function startButtonChange(state) {
        const startButton = document.querySelector('.start i');

        switch (state) {
            case startButtonState.start:
                startButton.classList.add('fa-play-circle-o');
                startButton.classList.remove('fa-play-circle', 'fa-stop-circle');
                break;

            case startButtonState.stop:
                startButton.classList.add('fa-stop-circle');
                startButton.classList.remove('fa-play-circle-o', 'fa-play-circle');
                break;
        }
    }

    /**
     * @description: Display the cards on the page
     *   - shuffle the list of cards using the provided "shuffle" method below
     *   - loop through each card and create its HTML
     *   - add each card's HTML to the page 
     * @see: Shuffle function from http://stackoverflow.com/a/2450976
     * @param {array} array 
     */
    function shuffle(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Public functions
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * @description Sets initial game features
     */
    MemoryGame.Init = () => {
        document.querySelector('.start').addEventListener('click',  e => {
            startButtonChange(startButtonState.start);

            MemoryGame.StartGame();
        });
    }

    /**
     * @description Starts Game play
     */
    MemoryGame.StartGame = () => {
        // (1) set up the event listener for a card. If a card is clicked:
        cardDeckGameboard.addEventListener('click', e => {
            // Checks if e.target is a LI tag
            if (e.target && e.target.nodeName === 'LI') {
                // (2) display the card's symbol
                MemoryGame.ShowCard(e.target);

                // (3) add the card to a *list* of "open" cards
                MemoryGame.AddToOpenCards(e.target);
            }
        });

        document.querySelector('.restart').addEventListener('click', MemoryGame.ResetGame);
        document.querySelector('.final-score-modal section button').addEventListener('click', MemoryGame.ResetGame);

        // Populate HTML section with cards
        MemoryGame.LoadCardDeck();

        // Starts Game Timer
        MemoryGame.GameTimer(gameTimerState.start);
    }

    /**
     * @description (2) Display the card's symbol
     * @param {Object} htmlElement
     */
    MemoryGame.ShowCard = htmlElement => htmlElement.classList.add('open', 'show');
    
    /**
     * @description Hides the card's symbol
     * @param {Object} htmlElement
     */
    MemoryGame.HideCard = htmlElement => htmlElement.classList.remove('open', 'show');
    
    /**
     * @description (3) add the card to a * list * of "open" cards
     * @param {Object} htmlElement
     */
    MemoryGame.AddToOpenCards = htmlElement => {
        if (openedCardsList.length < 2) {
            openedCardsList.push(htmlElement);
            MemoryGame.CheckOpenCardsList();
        }
    }

    /**
     * @description (4) If the list already has another card,
     *                  check to see if the two cards match
     */
    MemoryGame.CheckOpenCardsList = () => {
        if (openedCardsList.length === 2) {
            setTimeout(() => {
                // Checks if Player selected cards match
                if (openedCardsList[0].firstElementChild.classList.value === openedCardsList[1].firstElementChild.classList.value) {
                    // Handles when cards do match
                    MemoryGame.OpenCardsDoMatch();

                    // Checks if Play has won game
                    MemoryGame.CheckHasWonGame();
                } else {
                    // Handles when cards don't match
                    MemoryGame.OpenCardsNotMatch();
                }

                // Resets openedCardsList list Array
                openedCardsList = [];
            }, 500);

            // Handles player moves
            MemoryGame.HandlePlayerMoves();
        }
    }

    /**
     * @description (5) if the cards do match, lock the cards in the open position
     */
    MemoryGame.OpenCardsDoMatch = () => {
        openedCardsList.forEach(el => {
            el.classList.add('match');
            MemoryGame.HideCard(el);
        });

        checkOrphanedOpenedCards();
    }

    /**
     * @description (6) if the cards do not match, remove the cards from the list and hide the card's symbol
     */
    MemoryGame.OpenCardsNotMatch = () => {
        openedCardsList.forEach(el => MemoryGame.HideCard(el));

        checkOrphanedOpenedCards();
    }

    /**
     * @description (7) increment the move counter and display it on the page
     */
    MemoryGame.HandlePlayerMoves = () => {
        playerMovesCounter++;
        playerMovesSpan.textContent = playerMovesCounter;
        MemoryGame.HandlePlayerRating();
    }

    /**
     * @description  Change rating based on move counter and display it on the page
     * @see: CSS: nth-child() Selector - https: //www.w3schools.com/cssref/sel_nth-child.asp
     */
    MemoryGame.HandlePlayerRating = () => {
        if (playerMovesCounter === 14) { //  75%
            let firstStar = document.querySelector('ul.stars li:nth-child(1) i:nth-child(1)');
            StarRatingCounter(firstStar);
        } else if (playerMovesCounter === 18) { // 125%
            let secondStar = document.querySelector('ul.stars li:nth-child(2) i:nth-child(1)');
            StarRatingCounter(secondStar);
        } else if (playerMovesCounter === 22) { // 175%
            let thirdStar = document.querySelector('ul.stars li:nth-child(3) i:nth-child(1)');
            StarRatingCounter(thirdStar);
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Local function to modify rating stars. - DRY/SOLID
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        function StarRatingCounter(htmlElement) {
            htmlElement.classList.add('fa-star-o');
            htmlElement.classList.remove('fa-star');
            playerRatingCounter--;
        }
    }

    /**
     * @description (9) if all cards have matched, display a message with the final score
     */
    MemoryGame.CheckHasWonGame = () => {
        const matchedCards = document.querySelectorAll('li.match');

        if (matchedCards.length === cardsList.length) {
            //Stops Game Timer
            MemoryGame.GameTimer(gameTimerState.stop);
            startButtonChange(startButtonState.stop);
            sectionHide(elementState.hide, cardDeckGameboard);
            sectionHide(elementState.show, finalScoreModal);

            finalScoreMovesSpan.textContent = playerMovesCounter;
            finalScoreRatingSpan.innerHTML = document.querySelector('.stars').outerHTML;
            finalScoreTimeSpan.textContent = `${timerMintuesSpan.textContent} ${timerSecondsSpan.textContent} `;
        }
    }

    /**
     * @description (10) Enable Player to Reset the game
     */
    MemoryGame.ResetGame = () => {
        // Reset gameboard: Clears and Shuffles card deck
        MemoryGame.LoadCardDeck();

        // Hides Final score modal
        sectionHide(elementState.hide, finalScoreModal);
        sectionHide(elementState.show, cardDeckGameboard);
        startButtonChange(startButtonState.start);

        //Resets Star ratings
        const starsElements = document.querySelectorAll('.stars li i');

        starsElements.forEach(el => {
            el.classList.add('fa-star');
            el.classList.remove('fa-star-o');
        });

        // Resets
        playerMovesCounter = 0;
        playerMovesSpan.textContent = playerMovesCounter;
        finalScoreMovesSpan.textContent = '';
        finalScoreRatingSpan.textContent = '';

        // Stops Game Timer
        MemoryGame.GameTimer(gameTimerState.stop);

        // Reset Game Timer variables
        gameTimer = 0
        timerMinutes = 0;
        timerSeconds = 0
        timerMintuesSpan.innerHTML = `00m`;
        timerSecondsSpan.innerHTML = `00s`;

        // Restarts Game Timer
        MemoryGame.GameTimer(gameTimerState.start);
    }

    /**
     * @description Game timer
     * @see
     * https://www.w3schools.com/howto/howto_js_countdown.asp
     * https://stackoverflow.com/questions/10935026/how-to-clear-interval-and-set-it-again
     * @param {boolean} startTimer Determines to run timer
     */
    MemoryGame.GameTimer = startTimer => {
        if (startTimer) {
            timerInterval = setInterval(() =>{
                gameTimer++;
                timerMinutes = Math.floor((gameTimer / 60));
                timerSeconds = Math.floor((gameTimer % 60));
                timerMintuesSpan.innerHTML = `${timerMinutes < 10 ? `0${timerMinutes}` : timerMinutes}m`;
                timerSecondsSpan.innerHTML = `${timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}s`;
            }, 1000);
        } else {
            clearInterval(timerInterval);
        }
    }

    /**
     * @description Clears, Shuffles and Loads card deck.
     * @see
     *  https: //davidwalsh.name/documentfragment
     *  https: //developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
     */
    MemoryGame.LoadCardDeck = () => {
        //DEBUGGING CODE
        if (true) {
            // Used for Debugging/Testing
            const gameboardElements = document.querySelectorAll('.deck li');
            gameboardElements.forEach(el => {
                el.classList.remove('open', 'match', 'show');
            });
            return;
        }

        // Clears card deck
        cardDeckGameboard.innerHTML = '';

        // Shuffles card deck
        shuffle(cardsList);

        // Creates a temporary container
        let fragElement = document.createDocumentFragment();

        for (let i = 0, len = cardsList.length; i < len; i++) {
            let li = document.createElement("li");
            li.classList.add('card');
            li.innerHTML = `<i class="fa ${cardsList[i]}"></i>`;
            fragElement.appendChild(li);
        }

        // Loads cards
        cardDeckGameboard.appendChild(fragElement);
    }

    window.onload = MemoryGame.Init;

    return MemoryGame;
}());