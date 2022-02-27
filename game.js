let gameBoardElement = document.querySelector("#gameBoard");
let todaysWord = "squat";
let activeTileRow = 0;
let activeTileCol = -1;
let guess = "";
let activeTile = null;
let endMessages = [
  "Cheater",
  "Lucky bastard",
  "NOICE",
  "Alright I guess",
  "Oof",
  "Yikes",
];
let dictionaryString = "";

$(function () {
  $("#div1").hide();
});

function createBoard() {
  for (let i = 0; i < 6; i++) {
    let tr = document.createElement("div");
    tr.classList.add("row");
    //tr.classList.add("no-gutters"); // remove this later and see what happens

    for (let j = 0; j < 5; j++) {
      let td = document.createElement("div");
      td.classList.add("col");
      td.classList.add("gameTile");

      let idString = i + "_" + j; // use this if you need IDs for tiles
      td.setAttribute("id", idString);
      tr.appendChild(td);
    }
    tr.style.height = "auto";
    gameBoardElement.appendChild(tr);
  }

  activeTile = document.getElementById(`${activeTileRow}_${activeTileCol}`);
  activateKeys();
}
// Making keyboard active
function activateKeys() {
  let keys = document.getElementsByClassName("keyboardKey");
  for (let i = 0; i < keys.length; i++) {
    // Key will print itself when clicked on
    keys[i].addEventListener("click", (e) => {
      console.log(e.target);
      keySelected = e.target.getAttribute("data-key").toUpperCase();

      if (keySelected == "BACKSPACE") {
        if (activeTileCol > -1) {
          activeTileCol--;
          activeTile.innerHTML = "";
          guess = guess.slice(0, -1);
          console.log(guess);
        }
      } else if (keySelected == "ENTER") {
        // Check if word is valid (5 letters and real word)
        let index = dictionaryString.indexOf(guess.toLowerCase());
        if (guess.length != 5) {
          ShowDiv("Not enough letters", 1000);
        } else if (index == -1) {
          ShowDiv("Not in word list", 1000);
        }
        // If word is valid, submit word
        else {
          checkGuess(guess);
        }
      } else if (activeTileCol < 4) {
        let newTile = document.getElementById(
          `${activeTileRow}_${activeTileCol + 1}`
        );
        console.log(guess);
        newTile.innerHTML = keySelected;
        guess = guess + keySelected;
        activeTileCol++;
      }
      activeTile = document.getElementById(`${activeTileRow}_${activeTileCol}`);
      console.log(activeTileCol);
    });
  }
}

function checkGuess(guessedWord) {
  guessedWord = guessedWord.toLowerCase();
  answerArray = ["grey", "grey", "grey", "grey", "grey"];
  greenList = "";
  yellowList = "";

  for (let i = 0; i < 5; i++) {
    if (guessedWord[i] == todaysWord[i]) {
      answerArray[i] = "green";
      greenList = greenList + guessedWord[i];
    }
  }
  for (let i = 0; i < 5; i++) {
    let currentLetter = todaysWord[i];
    let letterIndex = guessedWord.indexOf(currentLetter); // This represents what position in the guess a correct letter might be in
    let greenIndex = greenList.indexOf(currentLetter); // This will check if the letter was already marked green
    if (letterIndex != -1 && greenIndex == -1) {
      answerArray[letterIndex] = "yellow";
      yellowList = yellowList + currentLetter;
    }
  }

  // coloring the tiles
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      currentTile = document.getElementById(`${activeTileRow}_${i}`);
      currentTile.classList.add(answerArray[i]);
      if (i == 4) {
        activeTileRow++;
        activeTileCol = -1;
        guess = "";
        if (
          areEqual(answerArray, ["green", "green", "green", "green", "green"])
        ) {
          setTimeout(() => {
            let endMessage = endMessages[activeTileRow - 1];
            ShowDiv(endMessage, 3000);
          }, 200);
        }
      }
    }, 500 * i);
  }

  // coloring the keyboard
  setTimeout(() => {
    // Greys first
    for (let i = 0; i < 5; i++) {
      let keyboardKey = document.getElementById(guessedWord[i]);
      keyboardKey.classList.add("grey");
    }

    // Then Yellows
    for (let i = 0; i < yellowList.length; i++) {
      let keyboardKey = document.getElementById(yellowList[i]);
      keyboardKey.classList.add("yellow");
    }

    // Then Greens
    for (let i = 0; i < greenList.length; i++) {
      let keyboardKey = document.getElementById(greenList[i]);
      keyboardKey.classList.add("green");
    }
  }, 2600);

  console.log(greenList);
  console.log(yellowList);
}

function areEqual(array1, array2) {
  if (array1.length === array2.length) {
    return array1.every((element, index) => {
      if (element === array2[index]) {
        return true;
      }

      return false;
    });
  }

  return false;
}

function ShowDiv(endMessage, time) {
  //let endMessage = endMessages[activeTileRow - 1];
  $("#div1").html(endMessage);
  $("#div1").css("backgroundColor", "black");
  $("#div1").show();
  setTimeout(function () {
    $("#div1").hide();
  }, time);
}

function dosomething() {
  if (typeof gbl_text == "undefined") {
    setTimeout("dosomething()", 500); //call back until defined
  } else {
    dictionaryString = gbl_text;
    console.log(dictionaryString);
  }
}

createBoard();
dosomething();
