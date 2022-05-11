/********************Start Screen Controls********************/ 
let start_screen = document.querySelector("#start_screen"); // div holding instructions + form
let form = document.querySelector("form") //form for player names
let form_btn = document.querySelector("#form_btn");
//will hold value of names from form
let p1_name; 
let p2_name;


/*************Game Screen Controls***************************/
let game_screen = document.querySelector("#game_screen");
let start_btn = document.querySelector("#start_btn");
let guesses = document.querySelector("#guesses");

let lives = 6;

//left and right side of the screen that displays p1 and p2 name + time
let player_nameDisplay = document.querySelectorAll(".display");

let p1_time = document.querySelector ("#p1_time");
let p2_time = document.querySelector ("#p2_time");

//displays dashes on the screen 
let word_dashes = document.querySelector("#word_dashes");

//canvas 
let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");

//has letter buttons
let keyboard = document.querySelector("#keyboard");
let rows = document.querySelectorAll(".row");

//word from api
let word;
let correct_letters = [];
let word_array;

//time counter for player 1 and 2
let time1 = 0; 
let time2 = 0;
let best_time = [];



//for clearInterval
let stop_time1;
let stop_time2;

//tracking who is currently playing
let currPlay;

/******************Game Over Screen Controls**********************/

let best_time1;
let best_time2;
let best_time3;

let game_over = document.querySelector("#game_over")
let play_again = document.querySelector("#play_again");
let correct_word = document.querySelector("#correct_word");




document.addEventListener("DOMContentLoaded", function(){
    let img = document.querySelector(".img");
    let close = document.querySelector(".close");
    let imgModal = new bootstrap.Modal(document.querySelector(".modal"));

    img.addEventListener("click",function(){
        imgModal.show();
    })
    close.addEventListener("click", function(){
        imgModal.hide();
        
    })
})

//when form is submit start screen is hidden and game screen is on
form_btn.onclick = function(event){
    event.preventDefault();
    //displays name of player 1 and 2 on opposite sides of the screen
    player_nameDisplay[0].innerHTML = `${form.children[0].value}`;
    player_nameDisplay[1].innerHTML = `${form.children[1].value}`;
    start_screen.classList.add("hidden");
    game_screen.classList.remove("hidden");
    stand();
    keyboard_keys();
    dashes();
}

//fetch request to get random word
async function randomWord(){
    const response = await fetch('https://random-word-api.herokuapp.com/word?length=6');
    word = await response.json();
} 
randomWord();

start_btn.onclick = function (){
    if (window.localStorage.getItem("leaderboard")){
        best_time = JSON.parse(localStorage.getItem("leaderboard"));
    }
    word = word[0].toUpperCase();
    word_array = word.split("");
    console.log(word);

    //glows player 1 name to indicate player 1 turn
    player_nameDisplay[0].classList.add("glow");

    //player 1 timer starts
    stop_time1 = setInterval (()=> {
        time(time1,p1_time)
        time1++
    },1000)

    currPlay = 1;
    let keys = document.querySelectorAll(".btn_key");

    for (let i = 0; i < keys.length; i++){
        keys[i].addEventListener ("click", play )
    }
}


function play(event){
    // true if match, false if not a match
    let match = letterMatch (event.target.id)
    event.target.style.pointerEvents = "none";
    event.target.style.backgroundColor = "#FFE3E3";//"#CBF9D9";
    if (correct_letters.join("") == word){
        console.log(currPlay)
        if (currPlay == 1){
            best(player_nameDisplay[currPlay-1].innerHTML,time1);
        }
        else{
            best(player_nameDisplay[currPlay-1].innerHTML,time2);
        }
        setTimeout(game_end,650);
    }

    //if there is not a match, then we switch players
    if (!match){
        lives --;
        hangMan();
        guesses.innerHTML = `Guesses Left: ${lives}`
        
        //if players 1 letter click not in word, switch to player 2
        if (currPlay === 1){
            currPlay = 2
            switchPlayer(player_nameDisplay[0], player_nameDisplay[1], stop_time1,"#87BDA4")
            stop_time2 = setInterval (()=> {
                time(time2,p2_time)
                time2++
            },1000)
        }

        // if player 2 letter click not in word switch player
        else{
            currPlay = 1
            switchPlayer(player_nameDisplay[1], player_nameDisplay[0], stop_time2,"#799FCB")
            stop_time1 = setInterval (()=> {
                time(time1,p1_time)
                time1++
            },1000)
        }
    }
}


function best (nm, tm){
    let objects = {};
    objects.name = nm;
    objects.time = tm;
    //would be [{name: nm, time: tm}]
    for (let i = 0; i < best_time.length; i++){
        if (best_time[i].time == tm && best_time[i].name == nm){
            best_time.pop(best_time[i]);
        }
    }
    
    best_time.push(objects); 
    best_time.sort(function(a,b){
        return a.time - b.time;
    });
    
    window.localStorage.setItem("leaderboard",JSON.stringify(best_time));
    console.log(best_time);

    // 1 -> currTime
    // 2 -> best1
    // 3 -> best2
    // 4 -> best3

    game_over.children[1].innerHTML = `${nm}'s current time: ${tm}`
    //best time 1
    game_over.children[2].innerHTML = `#1 Best time: ${best_time[0].time} -- ${best_time[0].name}`;
    
    if (best_time.length > 1){ //best time 2
        game_over.children[3].innerHTML = `#2 Best time: ${best_time[1].time} -- ${best_time[1].name}`;
    }
    if (best_time.length > 2){
        game_over.children[4].innerHTML = `#3 Best time: ${best_time[2].time} -- ${best_time[2].name}`;

    }

}
    
//takes in player 1 and 2 display, also takes in time of player that answered wrong 
function switchPlayer(curr1_display, curr2_display,time,c){ 
        curr1_display.classList.remove("glow");
        curr2_display.classList.add("glow");
        stop_time(time);
        let btn_key = document.querySelectorAll(".btn_key");
        for (let i = 0; i < btn_key.length; i ++){
            btn_key[i].style.color = c;
        }
}

function letterMatch(event) {
    temp = false;
    for (let i = 0; i < word_array.length; i ++){
        if (word_array[i] === event){
            temp = true;
            let p = document.createElement("p");
            p.classList.add("replace")
            p.innerHTML = event;
            correct_letters[i] = event;
            word_dashes.children[i].replaceWith(p);
        }
    }
    return temp;
}


function dashes (){
    for (let i = 0; i < 6; i++){
    let hr = document.createElement("hr");
    hr.classList.add("dashed_line");
    word_dashes.appendChild(hr);
    }
}

function keyboard_keys (){
    let alphabet = "ABCDEFGHIJKLMNOPQRTSUVWXYZ"
    let letter = alphabet.split("");

    letter.map (letter => {
        let btn = document.createElement("button");
        btn.classList.add("btn_key");
        btn.innerHTML = letter;
        btn.id = letter;
        for (let i = 0; i < 3; i ++){
            if (keyboard.children[0].children.length < 11){
                keyboard.children[0].appendChild(btn)
            }
            else if (keyboard.children[1].children.length < 9){
                keyboard.children[1].appendChild(btn)
            }
            else{
                keyboard.children[2].appendChild(btn);
            }
        }
    })
}


//function that updates time on screen and counter
function time (counter, selector){
    counter++;
    selector.innerHTML = `Time: ${counter}`;
}

//to clearInterval
function stop_time (t){
    clearInterval(t);
}

function stand (){
    ctx.beginPath();
    ctx.moveTo(300,30) // -------
    ctx.lineTo(180,30)

    ctx.moveTo(180,30)//  |   where head hangs
    ctx.lineTo(180,57)//  |

    ctx.moveTo(300,30)//   |  body line
    ctx.lineTo(300,230)//  |

    ctx.moveTo(300,230)// _____ right bottom line
    ctx.lineTo(430,230)//

    ctx.moveTo(300,230)// left bottom line ______
    ctx.lineTo(180,230)

    ctx.lineWidth = 2
    ctx.strokeStyle = "#FFEEB5"
	ctx.stroke(); 

}


function head(){
    ctx.beginPath();
    ctx.arc (180,73,15,0,2*Math.PI);
    ctx.lineWidth = 2
    ctx.strokeStyle = "#7C8BFF"
    ctx.stroke();
}


function body(){
    ctx.beginPath();
    ctx.moveTo(180,89)
    ctx.lineTo(180,170)
    ctx.stroke()
}

function leftArm(){
    ctx.beginPath();
    ctx.moveTo(180,120)
    ctx.lineTo(145,130)
    ctx.stroke()
}

function rightArm (){
    ctx.beginPath();
    ctx.moveTo(180,120)
    ctx.lineTo(220,130)
    ctx.stroke()
}

function leftLeg(){
    ctx.beginPath()
    ctx.moveTo(180,170)
    ctx.lineTo(150,180)
    ctx.stroke()

}
function rightLeg(){
    ctx.beginPath()
    ctx.moveTo(180,170)
    ctx.lineTo(210,181)
    ctx.stroke()
}

function hangMan (){
    switch(lives){
        case 5:
            head();
            break;
        case 4:
            body();
            break;
        case 3:
            rightArm();
            break;
        case 2:
            leftArm();
            break;
        case 1:
            rightLeg();
            break;
        case 0:
            leftLeg();
            console.log("this is word: ",word)
            correct_word.classList.remove("hidden");
            add_hidden();
            correct_word.innerHTML = `Your word was... ${word}`;
            setTimeout(game_end,650);
            break;
    }
}

function game_end (){
    game_screen.classList.add("hidden");
    game_over.classList.remove("hidden");
    lives = 6;
    guesses.innerHTML = `Guesses Left: ${lives}`
    stop_time(stop_time1);
    stop_time(stop_time2);
    time1 = 0;
    time2 = 0;
    best_time = []; 
    p1_time.innerHTML = `Time: 0`;
    p2_time.innerHTML = `Time: 0`;
    form.children[0].value ="";
    form.children[1].value ="";
    player_nameDisplay[0].classList.remove("glow");
    player_nameDisplay[1].classList.remove("glow");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

play_again.onclick = function(){
    game_over.classList.add("hidden");
    start_screen.classList.remove("hidden");
    game_over.children[2] ="";
    game_over.children[3] ="";
    game_over.children[4] ="";
    remove_hidden();
    correct_word.classList.add("hidden")
    word_dashes.innerHTML="";
    for (let i =0; i < rows.length; i++){
        rows[i].innerHTML = "";
    }
    randomWord();
}
function add_hidden(){
    game_over.children[1].classList.add("hidden")
    game_over.children[2].classList.add("hidden");
    game_over.children[3].classList.add("hidden");
    game_over.children[4].classList.add("hidden");
}
function remove_hidden(){
    game_over.children[1].classList.remove("hidden")
    game_over.children[2].classList.remove("hidden");
    game_over.children[3].classList.remove("hidden");
    game_over.children[4].classList.remove("hidden");
}