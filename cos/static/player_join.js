/**
 *Created by David Meyer 10/22/17
 */


/**
 * This function displays a modal notifying the player that the game is full
 * and they are unable to join.
  */
function get_player_count(doc) {
    window.alert("Hi from full game!");
    var modal = document.createElement("modal");
}

/**
 * This function displays a modal. The modal will show a player submission form with the following details:
 * 1) player name
 * 2) player age
 * 3) submission button
  */
function display_player_join_modal() {

}

/**
 * This function will add players to a game. It will:
 * 1) check if the game is full. If so, the player will be notified. If not, the player will ask to join.
 * 2) submit player info to backend so player can be added to game.
 */
function player_join() {

    var gameId = "5Q16IU";

    // Get count of players is game
    var count = "";
    get_players_in_game(gameId, function(count){alert(count);});


    var playerJoin = document.getElementById("player_join_prompt");

    var playername = "";

    //var count = get_players_in_game("5Q16IU");


}