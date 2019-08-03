function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;} /**
                                                                                                                                                                                                           Data
                                                                                                                                                                                                           */
let labels = [];
let descrips = [];

let numOfTerms = labels.length;


/**
                                Classes
                                */
class Player {
  constructor() {
    this.score = 0;
    this.rounds = 0;
  }

  winRound() {
    this.score++;
    this.rounds++;
  }
  loseRound() {
    this.rounds++;
  }
  updateStats() {
    $("gp").textContent = this.rounds;
    $("gw").textContent = this.score;
  }}


class Round {

  constructor(player) {_defineProperty(this, "numOfTerms", labels.length);
    this.enabled = true;
    this.result = "";
    this.id = Math.floor(Math.random() * numOfTerms);
    this.genRandos = function () {
      let randos = new Array();
      for (var i = 0; i < 3; i++) {
        randos.push(Math.floor(Math.random() * numOfTerms));
      }
      return randos;
    };
    $("def").classList.remove("has-background-success");
    $("def").classList.remove("has-background-danger");
    for (let i = 1; i < 5; i++) {
      $(`a${i}`).classList.remove("has-background-success");
      $(`a${i}`).classList.remove("has-background-danger");
      $("schema").textContent = "Definition:";
    }
    this.randos = this.genRandos();
    this.generateNew();
  }
  generateNew() {
    $("description").innerHTML = descrips[this.id];
    this.randos.push(this.id);
    let shuffy = shuffle(this.randos);
    for (let i = 1; i < 5; i++) {
      $(`a${i}`).textContent = labels[shuffy[i - 1]];
      $(`a${i}`).setAttribute("data-id", shuffy[i - 1]);
    }
    this.listenForAnswer();
  }

  checkAnswer(e) {
    if (this.enabled) {
      let gameResult =
      e.getAttribute("data-id") == this.id ? "Correct" : "Incorrect";
      e.classList.add(
      gameResult == "Correct" ?
      "has-background-success" :
      "has-background-danger");

      $("def").classList.add(
      gameResult == "Correct" ?
      "has-background-success" :
      "has-background-danger");


      $("schema").textContent = `${e.text}:`;
      this.result = gameResult;
      $("result").textContent = this.result;
      this.enabled = false;
      $("playAgain").style.visibility = "visible";
      this.result == "Correct" ? player.winRound() : player.loseRound();
      player.updateStats();
    }
  }

  listenForAnswer() {
    $("answers").addEventListener("click", e => {
      this.checkAnswer(e.target);
    });
  }}


const player = new Player();
let round = new Round(player);

/**
                               Global Watcher
                               */
$("playAgain").addEventListener("click", () => {
  if (round.result != "") {
    round = new Round();
  }
});

/** 
    Helper Functions
    */

function $(e) {
  return document.getElementById(e);
}

function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function createNewTerm(label, descrip) {
  if (label != '' & descrip != '') {
    labels.push(label);
    descrips.push(descrip);
    return true;
  } else
  {
    return false;
  }
}
function downloadTerms() {
  let terms = {
    labels: labels,
    descrips: descrips };

  download(JSON.stringify(terms, null, 4), 'terms.json');
}


function parseJSONLocally() {
  let localFile;
  var x = $("docpicker");
  reader = new FileReader();
  reader.onload = event => {
    localFile = parseLocalFile(event.target.result);
    sendTerms(localFile);
  };
  reader.onerror = error => reject(error);
  reader.readAsText(x.files[0]);
}


function sendTerms(file) {
 $('a1').click();
  for (lbl in file.labels) {
    labels.push(file.labels[lbl]);
  }
  for (desc in file.descrips) {
    descrips.push(file.descrips[desc]);
  }
  numOfTerms = labels.length;
  round = new Round(player);

}


function parseLocalFile(file) {
  return JSON.parse(file);
}


function download(content, filename) {
  var a = document.createElement("a");
  var blob = new Blob([content], { type: "application/json" });
  a.href = window.URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

$('importExportTrigger').addEventListener('click', () => {
  $('importExportContainer').classList.toggle('is-hidden');
});

$('addTermTrigger').addEventListener('click', () => {
  $('addTermContainer').classList.toggle('is-hidden');
});

$('addTerm').addEventListener('click', () => {
  createNewTerm($('term').value,
  $('definition').value);
  $('term').value = '';
  $('definition').value = '';
  numOfTerms = labels.length;
  round = new Round(player);
});
$('export').addEventListener('click', () => {
  downloadTerms();
});
$('import').addEventListener('click', () => {
  parseJSONLocally();


});
