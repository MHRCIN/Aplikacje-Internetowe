//Kopia bez zmian z leaflet.html - linie 1-27
let map = L.map('map_browser').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
document.getElementById("saveButton").addEventListener("click", function() {
    leafletImage(map, function (err, canvas) {
        let rasterMap = document.getElementById("puzzles");
        let rasterContext = rasterMap.getContext("2d");

        rasterContext.drawImage(canvas, 0, 0, 300, 150);
    });
});
document.getElementById("getLocation").addEventListener("click", function (event) {
    if (!navigator.geolocation) {
        console.log("No geolocation.");
    }

    navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        map.setView([lat, lon]);
    }, positionError => {
        console.error(positionError);
    });
});
//Kopia bez zmian z leaflet.html - koniec

function createTargets(numberOfTargets) {
    const solvingBox = document.getElementById("solving_box");
    solvingBox.innerHTML = '';
    for (let i = 0; i < numberOfTargets; i++) {
        let targetDiv = document.createElement("div");
        targetDiv.className = "target";
        solvingBox.appendChild(targetDiv);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function dragdrop() {
    const items = document.querySelectorAll(".part");

    for (const item of items) {
        item.addEventListener("dragstart", function (event) {
            event.dataTransfer.setData("text", this.id);
        });
    }


    const targets = document.querySelectorAll(".target");

    for (const target of targets) {
        target.addEventListener("dragover", function (event) {
            event.preventDefault();
        });
        target.addEventListener("drop", function (event) {
            this.appendChild(document.querySelector("#" + event.dataTransfer.getData('text')))
            this.style.border = "none";
            checkSolution();
        });
    }
}

document.getElementById("puzzle").addEventListener("click", function(event ){

    createTargets(16);

    const canvas = document.getElementById("puzzles")
    const partSize = { width: canvas.width / 4, height: canvas.height / 4 };
    let pieceIndex = 0;

    for ( let row = 0; row < 4; row++){
        for( let column = 0; column < 4; column++){
            let part = document.createElement("canvas");
            let ctxPart = part.getContext("2d");
            part.draggable = true;
            part.className = "part";
            part.id = "puzzle" + pieceIndex;
            part.width = partSize.width;
            part.height = partSize.height;

            ctxPart.drawImage(canvas, column * partSize.width, row * partSize.height, partSize.width, partSize.height, 0, 0, part.width, part.height);

            document.getElementById("puzzle_box").appendChild(part);
            pieceIndex++;
        }
    }
    let parts = Array.from(document.getElementsByClassName("part"));
    shuffleArray(parts);
    parts.forEach(part => document.getElementById("puzzle_box").appendChild(part));
    dragdrop();
});

function checkSolution() {
    const puzzles = document.querySelectorAll(".target .part");

    if (puzzles.length !== 16) return;
    const isSolutionCorrect = Array.from(puzzles).every((puzzle, index) => {
        return puzzle.id === "puzzle" + index;
    });

    if (isSolutionCorrect) {
        notifications("Gratulacje");
        console.log("Puzzle poprawnie ułożone");
    } else {
        notifications("Spróbuj ponownie!");
    }
}

function notifications(message){
    console.log(Notification.permission);

    if(Notification.permission === "granted"){
        new Notification(message);
    }
    else if (Notification.permission !== "denied") {
        alert("Zablokowane powiadomienia");
        Notification.requestPermission().then(permission =>{
            if(permission === "granted"){
                new Notification(message);
            }
            else{
                alert("Uprawnienia do powiadomień odrzucone");
            }
        });
    }

}
