/**
 * Created by Matthew Polsgrove on 10/17/17.
 */

// function display_score() {
//
//     var score = 0;
//
//     document.getElementById("score").innerHTML = "Score: " + score;
//
// }

/**
 * Displays table of resources
 *
 * This function implements the following requirements:
 *
 * 3.5.3
 * 3.5.3.1.1
 */
function display_resources() {

    //Fetch from backend
    var brick = 0;
    var wool = 0;
    var ore = 0;
    var grain = 0;
    var lumber = 0;

    //Generates table
    var body = document.getElementById("resources");
    var resourceTable = document.createElement("table");
    resourceTable.style.width = '100%';
    resourceTable.setAttribute('border', '1');
    var resourceTableBody = document.createElement("tbody");
    for (var i = 0; i < 2; i++){
        var row = document.createElement("tr");
        for (var j = 0; j < 5; j++){
            var cell = document.createElement("td");
            cell.setAttribute("align", "center");
            var cellText = document.createTextNode("ERR");

            if (i == 0) {
                switch (j) {
                    case 0:
                        cellText = document.createTextNode("Brick");
                        break;
                    case 1:
                        cellText = document.createTextNode("Wool");
                        break;
                    case 2:
                        cellText = document.createTextNode("Ore");
                        break;
                    case 3:
                        cellText = document.createTextNode("Grain");
                        break;
                    case 4:
                        cellText = document.createTextNode("Lumber");
                        break;
                }
            }
            else {
                switch (j) {
                    case 0:
                        cellText = document.createTextNode("" + brick);
                        cell.id = "brickresource";
                        break;
                    case 1:
                        cellText = document.createTextNode("" + wool);
                        cell.id = "woolresource";
                        break;
                    case 2:
                        cellText = document.createTextNode("" + ore);
                        cell.id = "oreresource";
                        break;
                    case 3:
                        cellText = document.createTextNode("" + grain);
                        cell.id = "grainresource";
                        break;
                    case 4:
                        cellText = document.createTextNode("" + lumber);
                        cell.id = "lumberresource";
                        break;
                }
            }
            cell.style.width = '40px';
            cell.appendChild(cellText);
            row.appendChild(cell);


        }
        resourceTableBody.appendChild(row);
    }

    resourceTable.appendChild(resourceTableBody);
    body.appendChild(resourceTable);

    resourceTable.setAttribute("border", "2");
}

/**
 * Displays table of players
 *
 * This function implements the following requirement:
 *
 * 3.5.2
 */

function display_players() {

    //Initial values
    var playerCount = 3;
    var playerName = ["","",""];
    var playerColor = ['black', 'black', 'black'];
    var playerArmy = ["",""," "];

    //Generates table
    var body = document.getElementById("players");
    var playerTable = document.createElement("table");
    playerTable.style.width = '100%';
    playerTable.setAttribute('border', '1');
    var playerTableBody = document.createElement("tbody");
    for (var i = 0; i < playerCount+1; i++){
        var row = document.createElement("tr");
        for (var j = 0; j < 2; j++){
            var cell = document.createElement("td");
            cell.setAttribute("align", "center");
            var cellText = document.createTextNode("ERR");

            if (i > 0) {
                switch (j) {
                    case 0:
                        cell.id ="player_name" + (i-1);
                        cell.style.color = playerColor[i-1];
                        cellText = document.createTextNode(playerName[i-1]);
                        break;
                    case 1:
                        cell.id = "settlement_count" + (i-1);
                        cellText = document.createTextNode(playerArmy[i-1]);
                        break;
                }
            }
            else {
                switch (j) {
                    case 0:
                        cellText = document.createTextNode("Player");
                        break;
                    case 1:
                        cellText = document.createTextNode("Settlement Count");
                        break;

                }
            }

            cell.appendChild(cellText);
            row.appendChild(cell);


        }
        playerTableBody.appendChild(row);
    }
    var stage;
    var layer;

    playerTable.appendChild(playerTableBody);
    body.appendChild(playerTable);

    playerTable.setAttribute("border", "2");
}

//Displays table of development cards
function display_devcards(){

    //Fetch from backend
    var knight_cards = 0;
    var victory_point_cards = 0;
    var monopoly_cards = 0;
    var road_building_cards = 0;
    var year_of_plenty_cards = 0;

    //Generates table
    var body = document.getElementById("devcards");
    var playerTable = document.createElement("table");
    playerTable.style.width = '100%';
    playerTable.setAttribute('border', '1');
    var playerTableBody = document.createElement("tbody");
    for (var i = 0; i < 5; i++){
        var row = document.createElement("tr");
        for (var j = 0; j < 2; j++){
            var cell = document.createElement("td");
            var cellText = document.createTextNode("ERR");

            if (j == 0) {
                switch (i) {
                    case 0:
                        cellText = document.createTextNode("Knight Cards");
                        break;
                    case 1:
                        cellText = document.createTextNode("Victory Cards");
                        break;
                    case 2:
                        cellText = document.createTextNode("Monopoly Cards");
                        break;
                    case 3:
                        cellText = document.createTextNode("Road Building Cards");
                        break;
                    case 4:
                        cellText = document.createTextNode("Year of Plenty Cards");
                        break;
                    }
                }
            else
                {
                    switch (i) {
                        case 0:
                            cellText = document.createTextNode("" + knight_cards);
                            break;
                        case 1:
                            cellText = document.createTextNode("" + victory_point_cards);
                            break;
                        case 2:
                            cellText = document.createTextNode("" + monopoly_cards);
                            break;
                        case 3:
                            cellText = document.createTextNode("" + road_building_cards);
                            break;
                        case 4:
                            cellText = document.createTextNode("" + year_of_plenty_cards);
                            break;
                    }
                }

            cell.appendChild(cellText);
            row.appendChild(cell);


        }
        playerTableBody.appendChild(row);
    }

    playerTable.appendChild(playerTableBody);
    body.appendChild(playerTable);

    playerTable.setAttribute("border", "2");
}

//Displays table of current road and army sizes
function display_road_and_army(){

    //Fetch from backend
    var army = 0;
    var road =0;

    //Generates table
    var body = document.getElementById("road_and_army");
    var playerTable = document.createElement("table");
    playerTable.style.width = '100%';
    playerTable.setAttribute('border', '1');
    var playerTableBody = document.createElement("tbody");
    for (var i = 0; i < 2; i++){
        var row = document.createElement("tr");
        for (var j = 0; j < 2; j++){
            var cell = document.createElement("td");
            cell.setAttribute("align", "center");
            var cellText = document.createTextNode("ERR");

            if (j == 0) {
                switch (i) {
                    case 0:
                        cellText = document.createTextNode("Current Army Size: ");
                        break;
                    case 1:
                        cellText = document.createTextNode("Current Road Length: ");
                        break;

                    }
                }
            else
                {
                    switch (i) {
                        case 0:
                            cellText = document.createTextNode("" + army);
                            break;
                        case 1:
                            cellText = document.createTextNode("" + road);
                            break;
                    }
                }

            cell.appendChild(cellText);
            row.appendChild(cell);
        }
        playerTableBody.appendChild(row);
    }

    playerTable.appendChild(playerTableBody);
    body.appendChild(playerTable);

    playerTable.setAttribute("border", "2");
}

/** Updates the player resource table based on data provided from the
 *
 * @param data
 *
 * This function implements the following requirements:
 *
 * 3.6.5.1.1
 * 3.7.4
 * 3.7.4.1.1
 * 3.10.6
 */
function update_player_resources_table(data) {
    var resource_dict = data.player.resources;
    $.each(resource_dict, function (resource, num) {
        $("#" + resource + 'resource').html(num);
    })
}

/**Call to redraw tables with information from the backend
 *
 * @param data
 *
 * This function implements the following requirements:
 *
 * 3.9.1
 */
function update_player_table(data){
    var players = data.Players;
    for (i = 0; i < players.length; i++) {
        var elm = document.getElementById("player_name" + i);
        elm.innerHTML = players[i].Player.player_name;
        var color = players[i].Player.player_color;
        if (color == 'white') {
            elm.style.color = 'black';
        }
        else {
            elm.style.color = color;
        }
        var settlement = document.getElementById("settlement_count" + i);
        var owned_settlements = players[i].Player.owned_settlements;
        settlement.innerHTML = owned_settlements.length;
    }
}


