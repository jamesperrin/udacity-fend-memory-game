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

(function () {
    /*
     * Global variables
     */
    var MemoryGame = {};
    var openedCardsList = []; // Create a list that holds all of your cards
    let playerMovesCounter = 0;
    let playerRatingCounter = 3;

    MemoryGame.Init = function () {
        // (1) set up the event listener for a card. If a card is clicked:
        document.querySelector('.deck').addEventListener('click', function (e) {
            //console.log(e.target);

            // Checks if e.target is a LI tag
            if (e.target && e.target.nodeName === 'LI') {
                // (2) display the card's symbol
                MemoryGame.ShowCard(e.target);

                // (3) add the card to a *list* of "open" cards
                MemoryGame.AddToOpenCards(e.target);
            }
        });
    }

    /**
     * @description (2) display the card's symbol
     * @param {*} element 
     */
    MemoryGame.ShowCard = function (element) {
        element.classList.add('open', 'show');
    }

    MemoryGame.HideCard = function (element) {
        element.classList.remove('open', 'show');
    }

    /**
     * @description (3) add the card to a * list * of "open" cards
     * @param {*} element 
     */
    MemoryGame.AddToOpenCards = function (element) {
        if (openedCardsList.length < 2) {
            openedCardsList.push(element);

            // DEBUG CODE
            // console.log('AddToOpenCards:');
            // console.log(openedCardsList);
        }

        MemoryGame.CheckOpenCardsList();
    }

    /**
     * @description (4) if the list already has another card,
     *                  check to see if the two cards match
     */
    MemoryGame.CheckOpenCardsList = function () {
        if (openedCardsList.length == 2) {
            setTimeout(function () {
                if (openedCardsList[0].firstElementChild.classList.value === openedCardsList[1].firstElementChild.classList.value) {
                    // Checks if Player selected cards match
                    MemoryGame.OpenCardsDoMatch();

                    // Checks if Play has won game
                    MemoryGame.CheckHasWonGame();
                } else {
                    // Do something
                    MemoryGame.OpenCardsNotMatch();
                }

                // Resets openedCardsList list Array
                openedCardsList = [];
            }, 600);

            MemoryGame.HandlePlayerMoves();
        }
    }

    /**
     * @description (5) if the cards do match, lock the cards in the open position
     */
    MemoryGame.OpenCardsDoMatch = function () {
        openedCardsList.forEach(function (el) {
            el.classList.add('match');
            MemoryGame.HideCard(el);
        });
    }

    /**
     * @description (6) if the cards do not match, remove the cards from the list and hide the card's symbol
     */
    MemoryGame.OpenCardsNotMatch = function () {
        openedCardsList.forEach(function (el) {
            console.log(el);
            MemoryGame.HideCard(el);
        });
    }

    /**
     * @description (7) increment the move counter and display it on the page
     */
    MemoryGame.HandlePlayerMoves = function () {
        let movesSpan = document.querySelector('span.moves');
        playerMovesCounter++;
        movesSpan.textContent = playerMovesCounter;
        MemoryGame.HandlePlayerRating();
    }

    /**
     * @description  Change rating based on move counter and display it on the page
     * @see: CSS: nth - child() Selector - https: //www.w3schools.com/cssref/sel_nth-child.asp
     */
    MemoryGame.HandlePlayerRating = function () {
        if (playerMovesCounter == 12) { // 12
            let firstStar = document.querySelector('ul.stars li:nth-child(1) i:nth-child(1)');
            playerRatingCounter--;
            StarRating(firstStar);
        } else if (playerMovesCounter == 16) { // 16
            let secondStar = document.querySelector('ul.stars li:nth-child(2) i:nth-child(1)');
            StarRating(secondStar);
            playerRatingCounter--;
        } else if (playerMovesCounter == 18) { // 18
            let thirdStar = document.querySelector('ul.stars li:nth-child(3) i:nth-child(1)');
            StarRating(thirdStar);
            playerRatingCounter--;
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Local function to modify rating stars. - DRY/SOLID
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        function StarRating(element) {
            element.classList.add('fa-star-o');
            element.classList.remove('fa-star');
        }
    }

    /**
     * @description (9) if all cards have matched, display a message with the final score
     */
    MemoryGame.CheckHasWonGame = function () {
        const matchedCards = document.querySelectorAll('li.match');

        if (matchedCards.length >= 16) {
            alert(`Congratulations!\nMoves: ${playerMovesCounter}\nRating: ${playerRatingCounter}`);
        }
    }

    /**
     * @description: Display the cards on the page
     *   - shuffle the list of cards using the provided "shuffle" method below
     *   - loop through each card and create its HTML
     *   - add each card's HTML to the page 
     * @see: Shuffle function from http: //stackoverflow.com/a/2450976
     * @param {*} array 
     */
    MemoryGame.Shuffle = function (array) {
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

    window.onload = MemoryGame.Init;

    return MemoryGame;
}());