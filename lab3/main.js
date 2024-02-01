class PuzzlePiece {
  constructor(posX, posY, pieceNumber, canvasEl) {
    this.posX = posX;
    this.posY = posY;
    this.pieceNumber = pieceNumber;
    this.canvasEl = canvasEl;
  }
}

function allowDrop(e) {
  e.preventDefault();
}

function drag(e) {
  e.dataTransfer.setData("text", e.target.id);
}

function drop(e) {
  e.preventDefault();
  var data = e.dataTransfer.getData("text");
  if (!e.target.firstChild) {
    e.target.appendChild(document.getElementById(data));
    numChildren = document.getElementById("solvingPiecesContainer").getElementsByTagName("*").length;
    if (numChildren >= 32) {
      sendNotification();
    }
  }
}

function notifyUser(message) {
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification(message);
      displayNotification(message); // Wywołanie funkcji do wyświetlania powiadomienia na stronie
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          new Notification(message);
          displayNotification(message); // Wywołanie funkcji do wyświetlania powiadomienia na stronie
        }
      });
    }
  }
}

function displayNotification(message) {
  var notificationDiv = document.getElementById("notification");
  notificationDiv.innerText = message;
  setTimeout(function() {
    notificationDiv.innerText = ''; // Usunięcie powiadomienia po kilku sekundach
  }, 5000); // Czas wyświetlania powiadomienia w milisekundach (5 sekund)
}

function sendNotification() {
  var container = document.getElementById("solvingPiecesContainer").children;
  for (var i = 0; i < container.length; i++) {
    if (container[i].id.slice(-1) != container[i].children[0].id.slice(-1)) {
      notifyUser("Incorrectly arranged puzzle!");
      console.log("Incorrectly arranged puzzle!");
      return;
    }
  }
  notifyUser("Correctly arranged puzzle");
  console.log("Correctly arranged puzzle!");
}


var mapObj;

window.onload = function () {
  mapObj = L.map('map').setView([51.505, -0.09], 13);
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoib3NrYXJ6dXQiLCJhIjoiY2t5bmU0azBwMmd1ODJ3cDB4c2s4bnI1NyJ9.smj5Jioo-qtBqMPB2OphJQ'
  }).addTo(mapObj);
};

function getGeolocation() {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      mapObj.setView([pos.coords.latitude, pos.coords.longitude], 16);
    },
    () => {
      alert("Failed to retrieve geolocation");
    }
  );
}

function takeImage() {
  var image = new Image();
  image.src = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${mapObj.getCenter().lng},${mapObj.getCenter().lat},${mapObj.getZoom() - 1},0,0/900x400?logo=false&attribution=false&access_token=pk.eyJ1Ijoib3NrYXJ6dXQiLCJhIjoiY2t5bmU0azBwMmd1ODJ3cDB4c2s4bnI1NyJ9.smj5Jioo-qtBqMPB2OphJQ`;
  image.setAttribute('crossOrigin', 'anonymous');
  image.onload = cutImageUp;

  function cutImageUp() {
    pieceWidth = image.width / 4;
    pieceHeight = image.height / 4;
    var imagePieces = [];
    counter = 0;

    for (var y = 0; y < 4; ++y) {
      for (var x = 0; x < 4; ++x) {
        var canvas = document.createElement('canvas');
        canvas.width = pieceWidth;
        canvas.height = pieceHeight;
        var context = canvas.getContext('2d');
        context.drawImage(image, x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight, 0, 0, canvas.width, canvas.height);
        var puzzlePiece = new PuzzlePiece(x, y, counter, canvas);
        imagePieces.push(puzzlePiece);
        counter = counter + 1;
      }
    }

    imagePieces = imagePieces.sort(function () { return 0.5 - Math.random(); });
    var container = document.getElementById("piecesContainer");
    document.getElementById("piecesContainer").innerHTML = '';
    document.getElementById("solvingPiecesContainer").innerHTML = '';

    for (var i = 0; i < imagePieces.length; i++) {
      var temp_img = new Image();
      temp_img.draggable = true;
      temp_img.ondragstart = drag;
      temp_img.src = imagePieces[i].canvasEl.toDataURL();
      temp_img.id = imagePieces[i].pieceNumber;
      container.appendChild(temp_img);
    }

    var solvingPiecesContainer = document.getElementById("solvingPiecesContainer");

    for (var i = 0; i < 16; i++) {
      newDiv = document.createElement("div");
      newDiv.classList.add("pieceContainer");
      newDiv.classList.add("col-3");
      newDiv.id = `piece-container-${i}`;
      newDiv.ondrop = drop;
      newDiv.ondragover = allowDrop;
      solvingPiecesContainer.appendChild(newDiv);
    }
  }
}
