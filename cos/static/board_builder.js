/**
 * Created by nickadcock on 10/13/17.
 */

var stage;
var layer;

/**
 * This function is responsible for creating the game board and rending it.
 * It is recommended this is passed in as a callback function.
 *
 * @param data (this is the JSON data returned from the server)
 */
function build_board(data) {

    // Create the stage for hosting the game board
    stage = new Konva.Stage({
      container: 'gameBoard',
      width: 1300,
      height: 1000
    });

    // Data returned from the backend includes:
    // - number and row of each element
    // - whether the element is a road, tile, or settlement
    // - the locations of each element
    // - tile type: water or terrain

    var hex_radius = 53;
    var hex_apothem = hex_radius * Math.sqrt(3) / 2;
    var hex_stroke_width = 1;
    var buffer = 11;
    var max_row_length = 7;
    var board_layout = [4, 5, 6, 7, 6, 5, 4];
    var settlementX = 1000;
    var settlementY = 400;
    // var road_width = hex_radius * .78;
    // var road_height = 7;


    //tileData = data.Tiles; // An array of tile data returned from the server

    layer = new Konva.Layer();

    // Create game hex board layout on a row-column basis
    // Board structure is a jagged array based on the board_layout
    for (var rowNum = 0; rowNum < board_layout.length; rowNum++) {

        var columnCount = board_layout[rowNum];

        for (var colNum = 0; colNum < columnCount; colNum++) {

            // The row and column names in the JSON is 1 based rather than 0 based. + 1 added to each
            var hexTile = get_hex_tile_data(data, 't', rowNum + 1, colNum + 1);

            // ******************* ADD HEXAGON *******************
            var hexagon = new Konva.RegularPolygon({
                x: ((max_row_length - columnCount) * (hex_apothem + (buffer / 2))) + (colNum * (hex_apothem * 2)) + (colNum * buffer) + hex_apothem + hex_stroke_width,
                y: (rowNum * 1.5 * hex_radius) + (rowNum * buffer) + hex_radius + hex_stroke_width,
                sides: 6,
                radius: hex_radius,
                fill: get_tile_fill_color(hexTile),
                stroke: 'black',
                strokeWidth: hex_stroke_width
                });

            layer.add(hexagon);

            // Check that the hex tile isn't water, then add the Token to it
            if (hexTile.tile_type == "terrain") {

                // ****************** ADD TOKEN TEXT *********************

                // Add a token to the tile
                // Define the token
                var token = new Konva.Circle({
                    x: hexagon.x(),
                    y: hexagon.y(),
                    radius: hexagon.radius() / 4,
                    fill: 'white',
                    stroke: 'black',
                    strokeWidth: 1
                });

                // Add text to the token to represent the tile number
                var tokenText = new Konva.Text({
                    x: token.x(),
                    y: token.y(),
                    text: hexTile.tile_token.token_digit,
                    fontSize: 15,
                    fontFamily: 'Calibri Bold',
                    fontStyle: 'bold',
                    fill: 'black',
                    align: "center"
                });

                tokenText.setOffset( {
                    x: tokenText.getWidth() / 2,
                    y: tokenText.getHeight() / 2
                });

                layer.add(token);
                layer.add(tokenText);
            }

            // ******************* ADD SETTLEMENT PLACEMENT LOCATION: HEX-->RIGHT *******************
            if ((rowNum == 0 && colNum < (columnCount - 1))
                || (rowNum > 0 && rowNum < board_layout.length - 1 && colNum < (columnCount / 2) - 1)
                || (rowNum > 0 && colNum < (columnCount) - 1) && rowNum < (board_layout.length - 1)) {

                var settlementTile;

                // Determine settlement ID. Note, the 's' param is for settlement
                if (rowNum < 3 ) {
                    settlementTile = get_hex_tile_data(data, 's', rowNum + 1, (colNum * 2 + 2));
                }
                else {
                    settlementTile = get_hex_tile_data(data, 's', rowNum + 1, (colNum * 2 + 1));
                }

                var settlement_area_right = new Konva.Circle({
                    x: hexagon.x() + hex_apothem + (buffer / 2),
                    y: hexagon.y() + (hex_radius / 2) + (buffer / 2) - (hex_stroke_width / 2),
                    radius: 5,
                    fill: settlementTile.settlement_color,
                    stroke: 'white',
                    strokeWidth: 0,
                    name: 'settlement_area'
                });

                settlement_area_right.ID = settlementTile.settlement_id;

                layer.add(settlement_area_right);

                // ******************* ADD ROAD PLACEMENT #1 *******************
                /*var road_right_up = new Konva.Rect({
                    // x: hexagon.x() + (hex_apothem / 2) + (buffer / 2) - (road_width / 2),
                    // y: hexagon.y() + (hex_radius / 2) + (buffer / 2) - (road_height / 2),
                    x: hexagon.x() - (hex_apothem / 2) - (buffer * .15) - (road_width / 2),
                    y: settlement_area_right.y() + (buffer * .15)- (road_height / 2),
                    width: road_width,
                    height: road_height,
                    rotation: 30,
                    fill: 'yellow',
                    stroke: 'black',
                    strokeWidth: 1

                });

                layer.add(road_right_up);*/
            }

            settlement_area_right.on('mouseup', function() {
                if (settlement_area_right.getFill() == 'red') {
                    initiate_place_settlement(this.x(),this.y(), settlementX, settlementY, stage, layer, this.ID);
                }
            });

            // ******************* ADD SETTLEMENT PLACEMENT LOCATION: HEX-->BOTTOM *******************
            if ((colNum == 0 && rowNum < ((board_layout.length / 2) - 1))
                || (colNum > 0 && rowNum < ((board_layout.length / 2) - 1))
                || (colNum > 0 && rowNum < (board_layout.length - 1) && colNum < (columnCount - 1))) {

                var settlementTile;

                // Determine settlement ID.
                if (rowNum < 3 ){
                    settlementTile = get_hex_tile_data(data, "s", (rowNum + 1), (2 * colNum + 1));
                }
                else {
                    settlementTile = get_hex_tile_data(data, "s",(rowNum + 1), (2 * colNum));
                }

                var settlement_area_bottom = new Konva.Circle({
                    x: hexagon.x(),
                    y: hexagon.y() + hex_radius + (buffer / 2) + (hex_stroke_width / 2),
                    radius: 5,
                    fill: settlementTile.settlement_color,
                    stroke: 'white',
                    strokeWidth: 0,
                    name: 'settlement_area'
                });

                settlement_area_bottom.ID = settlementTile.settlement_id;

                layer.add(settlement_area_bottom);

                settlement_area_bottom.on('mouseup', function(){
                    if(settlement_area_bottom.getFill() == 'red'){
                        initiate_place_settlement(this.x(),this.y(), settlementX, settlementY, stage, layer, this.ID);
                    }
                })

                // ******************* ADD ROAD PLACEMENT #2 *******************
                /*var road_right_up = new Konva.Rect({
                    // x: hexagon.x() + (hex_apothem / 2) + (buffer / 2) - (road_width / 2),
                    // y: hexagon.y() + (hex_radius / 2) + (buffer / 2) - (road_height / 2),
                    x: hexagon.x() + (hex_apothem / 2) + (buffer * .4) - (road_width / 2),
                    y: settlement_area_bottom.y() - (buffer * .4)- (road_height / 2),
                    width: road_width,
                    height: road_height,
                    rotation: -30,
                    fill: 'yellow',
                    stroke: 'black',
                    strokeWidth: 1

                });
                layer.add(road_right_up);*/
            }
        }
    }

    // Draws settlements on board
    // 5 Settlements are able to be placed
    // Last settlement drawn is a button to trigger placing settlements
    for (var i = 0; i < 6; i++) {
        var settlement = new Konva.Shape({
                x: settlementX,
                y: settlementY,
           sceneFunc: function (context) {
               context.beginPath();
               context.moveTo(-7, 4);
               context.lineTo(-7, -10);
               context.lineTo(0, -17);
               context.lineTo(7, -10);
               context.lineTo(7, 4);
               context.lineTo(-7, 4);
               context.closePath();

               context.fillStrokeShape(this);
               },
               fill: 'red',
               stroke: 'black',
               strokeWidth: 1,
               name : 'settlement'
        });
        if (i==5) {
            settlement.on('mousedown', function(){
                mark_settlement_placement(stage,layer,false, settlementX, settlementY);
            })
            settlement.id('settlement_button');
        }
        layer.add(settlement);
    }

    // Add the layer to the stage
    stage.add(layer);
}


/**
 * This function returns the fill color of the tile based on the tile and/or resource type
 *
 * @param hexTile
 * @returns {string}
 */
function get_tile_fill_color(hexTile) {

    var color;

    // Tile type is either water or terrain
    // If water, default to blue
    if (hexTile.tile_type == "water") {
        color = "#919cf7";
    }
    else {
        // Assign color based on terrain resource type
        switch (hexTile.tile_resource) {

            // Hills --> brick
            case "brick":
                color = "#a03d21";
                break;

            // Desert
            case "desert":
                color = "#ad8129";
                break;

            // Pasture --> wool
            case "wool":
                color = "#9ed153";
                break;

            // Forest --> lumber
            case "lumber":
                color = "#546d2f";
                break;

            // Mountains --> ore
            case "ore":
                color = "#929299";
                break;

            // Fields --> grain
            case "grain":
                color = "#d8d370";
                break;

            default:
                color = "white";
        };
    }

    return color;
}

/**
 * This function returns a specified Tile, Road, or Settlement with all property data.
 *
 * Of note: this search function is, from a performance perspective, OK but not great.
 * The JSON returned for the Game Board is in random order and must be iterated over to
 * locate the desired hex square. Big-O worst case scenario is 37x37 loops.
 *
 * @param data (pass full JSON data object)
 * @param type (pass 't' for tile, 's' for settlement, and 'r' for road)
 * @param row  (for row)
 * @param col  (for column)
 * @returns {*}
 */
function get_hex_tile_data(data, type, row, col) {

    var result;
    var dataType;

    switch (type) {
        case "t":
            dataType = data.Tiles;
            break;

        case "s":
            dataType = data.Settlements;
            break;

        case "r":
            dataType = data.Roads;
            break;

        default:
            console.log("get_hex_tile_data::Invalid parameter!");
    };

    // Iterate through the array to find the match
    for (var i = 0; i < dataType.length; i++) {

        var lookup = type + row + "," + col;

        // Check for a match
        if (dataType[i][lookup]) {

            result = dataType[i][lookup];

            break;
        }
    }
    return result;
}


/**
 * This function initiates the game board render sequence.
 * Output will be a game board rendered onscreen.
 */
function render_board() {

    // Get game board from backend
    get_game_board(function(data) {

        // Render the game board
        build_board(data);
    });
}


//Redraw settlements with info from backend
function update_settlement_color(data) {
    var players = data.Players;
    var settlements = stage.find('.settlement');

    for (i = 0; i < 6; i++){
        settlements[i].fill(players[0].Player.player_color);
        layer.batchDraw();
    }
}

//Illuminates legal settlement locations for placement
//Legal locations are anywhere without a settlement placed
function mark_settlement_placement(stage,layer,placed, settlementX, settlementY) {
    //check if is player's turn
    if (document.getElementById("is_turn").innerHTML == "true") {
        //check for whether there are are remaining settlements
        var settlements = stage.find('.settlement');
        var remaining = false;
        for (i = 0; i < 5; i++) {
            if (settlements[i].x() == settlementX && settlements[i].y() == settlementY) {
                remaining = true;
                break;
            }

        }
        if (remaining || placed) {
            var settlement_areas = stage.find('.settlement_area');
            var color = 'red';
            if (placed) {
                color = 'orange';
            }
            for (i = 0; i < settlement_areas.length; i++) {
                settlement_areas.fill(color);
                layer.batchDraw();
            }
        }
    }
}

//Places settlement at appropriate location
function initiate_place_settlement(x, y, settlementX, settlementY, stage, layer, settlement_ID){
    buy_settlement(settlement_ID, x, y, settlementX, settlementY, stage, layer, place_settlement);
}

function place_settlement(x, y, settlementX, settlementY, stage, layer) {
    var settlements = stage.find('.settlement');
    for (i = 0; i < 5; i++){
        if (settlements[i].x() == settlementX && settlements[i].y() == settlementY){
            settlements[i].x(x);
            settlements[i].y(y);
            mark_settlement_placement(stage,layer,true);
            break;
        }
    }
    layer.batchDraw();
}

function update_ui_for_new_player (){
    //waits for turn
    document.getElementById("is_turn").innerHTML = "false";
    wait_for_turn(start_turn);

    //updates stats tables
    get_player_info(update_tables);
    get_player_info(update_settlement_color);
}