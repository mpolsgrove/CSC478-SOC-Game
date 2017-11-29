/**
 * Created by Matthew Polsgrove 11/13/2017
 */

var settlement_animation;

//Called when backend confirms it is player's turn
function start_turn() {
    document.getElementById("is_turn").innerHTML = "true";
    render_board();
    get_player_info(function(data) {});
    get_turn_options(function (data) {
        if(data.success == "True"){
            console.log("getTurnOptions returned successfully");
            enableTurnControls(data.turn_options);
            showTurnControlsButtons();
            showTurnControls();
        }

    });
}

function displaySnackbar(message) {
        // Get the snackbar DIV
    var snackbar = document.getElementById("snackbar");
    snackbar.innerText = message;

    // Add the "show" class to DIV
    snackbar.className = "showsnack";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){
        snackbar.className = snackbar.className.replace("showsnack", "");
        snackbar.innerText = "";
    }, 5000);

}

//Called when player chooses to end turn
function end_turn() {
    document.getElementById("is_turn").innerHTML = "false";
    hideTurnControls();
    wait_for_turn(start_turn);
}

function showTurnControls() {
    console.log("showTurnControls triggered");
    document.getElementById("turnControls").style.display = "block";
}

function hideTurnControls() {
    document.getElementById("turnControls").style.display = "none";
}

function showTurnControlsButtons() {
    console.log("showTurnControls triggered");
    document.getElementById("turn_option_buttons").style.display = "block";
}

function hideTurnControlsButtons() {
    document.getElementById("turn_option_buttons").style.display = "none";
}

function enableTurnControls(turn_options) {
    var roll_dice_button = document.getElementById("roll_dice");
    var settlement_button = document.getElementById("buy_settlement");
    var end_turn_button = document.getElementById("end_turn");

    roll_dice_button.disabled = true;
    settlement_button.disabled = true;
    end_turn_button.disabled = true;

    for (var i = 0; i < turn_options.length; i++) {
        switch(turn_options[i]) {
            case "roll_dice":
                roll_dice_button.disabled = false;
                break;
            case "buy_settlement":
                settlement_button.disabled = false;
                break;
            case "end_turn":
                end_turn_button.disabled = false;
                break;
        }
    }
}

function addTurnOptionButtons() {
    var turn_option_buttons = document.createElement("DIV");
    turn_option_buttons.id = "turn_option_buttons";
    var brk1 = document.createElement("BR");
    var brk2 = document.createElement("BR");

    var roll_dice_button = document.createElement("BUTTON");
    roll_dice_button.id = "roll_dice";
    roll_dice_button.setAttribute("align", "center");
    roll_dice_button.classList.add(".btn");

    var roll_dice_text = document.createTextNode("Roll Dice");
    roll_dice_button.appendChild(roll_dice_text);

    var settlement_button = document.createElement("BUTTON");
    settlement_button.id = "buy_settlement";
    settlement_button.setAttribute("align", "center");
    settlement_button.classList.add(".btn");

    var settlement_text = document.createTextNode("Buy Settlement");
    settlement_button.appendChild(settlement_text);

    var end_turn_button = document.createElement("BUTTON");
    end_turn_button.id = "end_turn";
    end_turn_button.setAttribute("align", "center");
    end_turn_button.classList.add(".btn");

    var end_turn_text = document.createTextNode("End Turn");
    end_turn_button.appendChild(end_turn_text);

    turn_option_buttons.appendChild(roll_dice_button);
    turn_option_buttons.appendChild(brk1);
    turn_option_buttons.appendChild(settlement_button);
    turn_option_buttons.appendChild(brk2);
    turn_option_buttons.appendChild(end_turn_button);

    var turn_controls = document.getElementById("turnControls");
    turn_controls.appendChild(turn_option_buttons);
}


//End turn button functionality
$(document).on("click", "#end_turn", function(e){
    if (document.getElementById("is_turn").innerHTML == "true") {
        complete_turn(end_turn);
    }
});

//End turn button functionality
$(document).on("click", "#roll_dice", function(e){
    if (document.getElementById("is_turn").innerHTML == "true") {
        hideTurnControlsButtons();
        showDice();
    }
});

//End turn button functionality
$(document).on("click", "#buy_settlement", function(e){
    console.log("buy_settlement button clicked");
    hideTurnControlsButtons();
    if (document.getElementById("is_turn").innerHTML == "true") {
        var settlements = stage.find('.settlement_area');
        settlement_animation = new Konva.Animation(function (frame) {
            settlements.each(function (settlement) {
                var scale = (1/5) * (Math.sin(frame.time * 2 * Math.PI / 5000) + 6);
                settlement.scale({x: scale, y: scale});
                settlement.fill('red');
                settlement.on('mouseup', function() {
                    console.log("settlement id: " + settlement.ID);
                    if (settlement.getFill() == 'red') {
                        initiate_place_settlement(this.x(),this.y(), this.ID);
                    }
                    end_settlement_animation();
                    start_turn();
                });
            });

        }, settlement_layer);
        settlement_animation.start();
    }
});


function end_settlement_animation() {
    settlement_animation.stop();
    var settlements = stage.find('.settlement_area');
    settlements.each(function(settlement) {
        settlement.scale({x: 1, y: 1});
        settlement.fill('grey');
        settlement.off('mouseup');
    });
    settlement_layer.batchDraw()
}
