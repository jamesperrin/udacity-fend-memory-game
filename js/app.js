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
    var MemoryGame = {};

    /*
     * Global variables
     */
    var MemoryGame = {};
    var openedCardsList = []; // Create a list that holds all of your cards

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
            //console.log(openedCardsList);
        }
    }

    /**
     * @description (4) if the list already has another card,
     *                  check to see if the two cards match
     */
    MemoryGame.CheckOpenCardsList = function () {
        if (openedCardsList.length == 2) {
            setTimeout(function () {
                if (openedCardsList[0].firstElementChild.classList.value === openedCardsList[1].firstElementChild.classList.value) {
                    // Do something
                    MemoryGame.OpenCardsDoMatch();
                } else {
                    // Do something
                }

                // Resets openedCardsList list Array
                openedCardsList = [];
            }, 600);
        }
    }

    /**
     * @description (5) if the cards do match, lock the cards in the open position
     */
    MemoryGame.OpenCardsDoMatch = function () {
        openedCardsList.forEach(function (el) {
            el.classList.add('match');
            hideCard(el);
        });
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