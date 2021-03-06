/*Deklaracja globalnych zmiennych i tablicy*/
var currentWord = "";
var changedCurrentWord = "";
var wrongLetters = new Array();
var missed = 0;
/*Tu wpisac aktualny klucz ze strony: https://random-word-api.herokuapp.com/key? */
var key = "D67J95AU";
var ask = "http://random-word-api.herokuapp.com/word?key=" + key + "&number=1";

/*Zmiana liter w pobranym słowie na "•"*/
function hideWord(currentWord) {
  changedCurrentWord = currentWord.replace(
    /a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|r|s|t|u|v|w|x|y|z|q/g,
    "•"
  );
}

function restartGame() {
  location.reload();
}

/*Funkcje odpowiedzialne za przyciemnianie i rozjaśnianie obrazu"*/
function hide() {
  $("#picture").fadeOut(500);
}
function show(winOrNot) {
  if (winOrNot == 1) {
    document.getElementById("picture").innerHTML =
      '<img src="assets/1.14.jpg" alt="Smiley face" /> ';
    $("#picture").fadeIn(500);
  } else {
    document.getElementById("picture").innerHTML =
      '<img src="assets/1.13.jpg" alt="Smiley face" /> ';
    $("#picture").fadeIn(500);
  }
}

/*Aktualizacja instrukcji dla gracza"*/
function updateInstructions(type) {
  if (type == 1) {
    document.getElementById("instructions").innerHTML = "TYPE A LETTER";
  } else {
    document.getElementById("instructions").innerHTML = "Type another letter ";
  }
}

/*Funkcja, która pozwala na podmianę liter w słowie*/
String.prototype.replaceAt = function(index, replacement) {
  if (index > this.length - 1) return this.toString();
  else return this.substr(0, index) + replacement + this.substr(index + 1);
};

/*Pobranie hasła z api. Uruchamia się przy otwarciu strony*/
const http = new XMLHttpRequest();
http.open("GET", ask);
http.send();
http.onload = () => {
  /*Przypisanie pobranego słowa do zmiennej currentWord oraz jego obróbka*/
  currentWord = http.responseText;
  currentWord = currentWord.replace(/"|]|\[/g, "");
  hideWord(currentWord);
  document.getElementById("currentWord").innerHTML = changedCurrentWord;
  console.log("HINT:" + currentWord);
};

/*Finał gry, zmiana obrazka na wygraną, bądź przegraną*/
function finGame(tekst, color, button, winOrNot) {
  document.getElementById("instructions").innerHTML = tekst;
  document.getElementById("instructions").style.color = color;
  document.getElementById("button_div").innerHTML = button;
  setTimeout("hide()", 1000);
  setTimeout("show(" + winOrNot + ")", 1500);
}

/*Funkcja wywyływana przy nacisnieciu guzika SUBMIT*/
function submit() {
  /*Pobranie potwierdzonej litery*/
  var typedLetter = document.getElementById("typeInput").value;
  if (currentWord.indexOf(typedLetter) != -1) { /*Sprawdź czy litera jest w słowie*/
    for (i = 0; i < currentWord.length; i++) { /*1.Jest, sprawdź gdzie i ją zmień*/
      if (currentWord.charAt(i) == typedLetter) {
        changedCurrentWord = changedCurrentWord.replaceAt(i, typedLetter);
        document.getElementById("currentWord").innerHTML = changedCurrentWord;
        updateInstructions(1);
      }
    }
    /*1.Nie ma*/
  } else {
    if (wrongLetters.includes(typedLetter)) { /*Sprawdź czy była wcześniej wpisana */
      /*2.Tak, była*/
      updateInstructions();
      
     } /*2.Nie była, podmien obraz i dopisz litere do wpisanych wczesniej*/
    else {
      missed += 1;
      wrongLetters[wrongLetters.length] = typedLetter;
      document.getElementById("typedLetters").innerHTML = wrongLetters;
      document.getElementById("picture").innerHTML =
        '<img src="assets/1.' + missed + '.jpg" alt="Smiley face" /> ';
      updateInstructions(1);
    }
  }
  /*Koniec gry*/
  if (missed == 12) { /*Przegrana*/
    finGame(
      "GOOD LUCK NEXT TIME",
      "#af4451",
      '  <button type="button" class="btn btn-hot text-uppercase btn-sm" onclick="restartGame()" > NEW WORD </button>',
      2
    );
  }
  if (currentWord == changedCurrentWord) { /*wygrana*/
    finGame(
      "CONGRATULATIONS. TRY AGAIN?",
      "#59af44",
      '  <button type="button" class="btn btn-hot text-uppercase btn-sm" onclick="restartGame()" > NEW WORD </button>',
      1
    );
  }
}
