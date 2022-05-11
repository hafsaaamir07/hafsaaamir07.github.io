<<<<<<< HEAD
Two PLayer Hangman
Game Logic:
1) The start screen is shown where player 1 and 2 input their names
2) Once the start button is clicked the game screen is shown
3) On the game screen before starting the player can take a look and once familiarized with the set-up player one clicks the start game button
4) Once the start button is clicked player ones timer starts
    a) When player 1 clicks a letter and the letter is in the word, player 1 continues to play
    b) If the letter clicked is not in the word then their (player 1) timer stops, a hangman body part is drawn, and it is player 2's turn
5) As soon as player 1's turn is over, player 2's turn starts and player 2's timer begins
    a) Player two goes and clicks a letter and if the letter is in the word then player two continues to play
    b) If the letter clicked not in the word then the timer stops, a hangman body part is drawn, and it is players 1's turn
6) This continues until one player consecutively guesses the letter correct and they guess the whole word or if all the hangman body parts are drawn (no guesses left).
7) If one of the player gets the word correct then the game ends and their time along with their name is recorded in the leaderboard using localstorage
8) If both players are unable to guess then the game is over and the word that they were supposed to guess is diaplayed
9) In both cases above (7 and 8) at the end of the game both players are given the option to play again
10) When they click play again they are taken to the start screen and all the values in the game screen are reset for another round.

Game Functionality:
  - start screen: screen with game instructions + form to submit player name
  - game screen: screem with player names along with time, keyboard, and hangman display
  - game over screen: 
        a) first game over screen is for if one of the player guesses the word correct and their name and time is shown on the leaderboard
        b) second game over screen is if the players are unable to guess the word and at the end the word is displayed.
    - function time takes the arguemnts of the time varaible of current player and the queryslected div that displays the time of that player
    - function stop_time stops the timer using clearInterval
    - function keyboard_keys returns alphabet buttons to the screen that remseble the keyboard
        a) has a varible called alpahbet that is a string of the alphabet in uppercase joined with no space
        b) I split the varaible alpahbet using .split("") and store the value that is returned in an varible called letter bc the value returned is an array that has each of the letters.
        c) I use map to go throughthe array and create a button for each element and give it a class of btn_key that styles the buttons.
        d) I use the letter key word in the map function to make the innerHTML of each button the value of the string in the array letter.
        e) Ia append each button to the keyboard div in the html file
    - function hangman has a switch case that draws each hangman body part based on the the number of guesses left.
        a) In the last switch case (0) I call the function game_end because the last case indicates that there are no more guesses left
    - function game_end rests all the values of the game_screen so the game can be played again

1) Inorder to go from the start screen to game screen I attach an onclick to the start button in the start screen where the player submit their names
    a) once the start button is clicked i use preventDefault to prevent the page from reloading because the name input is a form in the start screen.
    b) the start screen is given a classs of hidden and the class hidden is removed from the game screen inorder to display it.
    c) I call the functopn stand which is what the hangman is displayed on
    d) I also call the function dashes which displays the dashed lines on the screen where the letters guessed will go

2) I make a fetch request to a word api so I can get a random word that the player can guess
    a) I set parameters in by fetch request that I only want random words that are of length 6
    b) The response from the fetch is stored in a global varible called word.
3) I attach an onclick to the start game button in the game screen and once that is clicked...
    a) I first check wether there are any previously stored items (name and time) in localstoarge and if there is then i add them to an array called best_time
    b) The response the api returns is an array of length one with a random word. I index to position 0 and use toUpperCase() to make all the letters uppercase since my keyboard keys are uppercase. 
        1) I store the uppercase word in a an array called word_array using the .split("") method.
    c) I add a css class called glow to player 1's name that is displayed to indicate that is the current player playing
    d) I start player 1's timer using setInterval
    e) I define a variable called currPlay that has a value of 1 or 2 which keeps track of which player is playing
    f) I querySelect my keybaord (which displays the alpahabet) and use a for loop to atatch an eventlistener inorder to tell which key is being clicked and also call the function play
4) The function play uses event.target to tell the exact letter being clicked since the querySelectorAll returns an array
    a) I define a varaible called letterMatch which tells me wether or not the letter/key clicked on is in the word.
        1) if the letter is in the word then the dash is replced by that letter in the index position the letter is found in the word.
        2) lettermatch return true and false indicating wether or not letter was found or not in the word.
        3) if letterMatch return true then player keeps playing and if false then we switch to the other player.
    b) If letterMatch returns false then we decraese the lives and upadate the guesses left div and call the hangman function which draws a hangman body part based on the number of guesses remaining
    c) In the if letterMatch equals false if statment if the the currPLay is 1 (player 1) then we switch to player 2 beacuse it means the letter clicked was not found in the word.
    d) To switch between player I call the switch player function which takes the arguments of the current players name, the 2nd players name, the current players time, along with the current players font color.
        1) The switch player removes the glwo glass from the current player and adds it to the other player. It also stops the current players time and adds the other players name font color to the keyboard (another way of indicating what players turn it is).
    e) Depending on the value of what currPlay is in the if statement for letterMatch I change the value of currPlay to the other player and also start their timer.

Citations:
1) for css glow key frames I used w3 schools template and adjusted it to my liking
2) for modal I used bootstrap and adjusted the code



