from pyramid.httpexceptions import HTTPBadRequest
from pyramid.view import view_config
from pyramid.response import Response
from cos.models.Game import Game
import time
import json


@view_config(route_name='createGame', renderer='json')
def create_game_view(request):
    """ Creates game object

        Parameters
        ----------
        request: Request
            - required JSON parameters: "game_name": String

        Returns
        -------
        Json object containing "game": {
                                    "game_id: String"
                                }
    """
    json_body = request.json_body
    if 'game_name' in json_body:
        game_name = json_body['game_name']
    else:
        raise HTTPBadRequest(json_body={'error': "'game_name' is a required parameter for this request"})
    new_game = Game(game_name)
    request.registry.games.add_game(new_game)
    request.registry.games.print_games()

    return_data = {'game': new_game.get_dictionary()}
    json_return = json.dumps(return_data)
    return Response(content_type='application/json', body=json_return)


@view_config(route_name='getPlayerFullStatus', renderer='json')
def get_player_full_status_view(request):
    """ Determines how many players are in specified game and if the game is full

        Parameters
        ----------
        request: Request
            - "game_id" is required


        Returns
        -------
        Json object containing "player_full_status": {
                                    "player_count": Int
                                    "game_is_full": Bool
                                    }
    """
    if 'game_id' in request.session:
        game = request.registry.games.games[request.session['game_id']]
    else:
        raise HTTPBadRequest(json_body={'error': 'Requested game not found. Session may have expired'})

    return_data = {'player_full_status': game.get_dictionary(player_count=True, is_full=True)}
    json_return = json.dumps(return_data)
    return Response(content_type='application/json', body=json_return)


@view_config(route_name='addPlayerToGame', renderer='json')
def add_player_to_game(request):
    """ Creates a player and then adds it to the game's list of players

        Parameters
        ----------
        request: Request 
            - required JSON parameters: "player_name":  String
                                        "player_age":   Int

        Returns
        -------
        Json object containing: "game": 
                                {
                                    "player_count":     Int
                                    "game_is_full":     Bool
                                }
                                "Player": 
                                {
                                    "player_id":        String
                                    "player_name":      String
                                    "player_color":     String
                                    "player_age:        Int
                                }

    """
    json_body = request.json_body
    if 'game_id' in request.session:
        game = request.registry.games.games[request.session['game_id']]
    else:
        raise HTTPBadRequest(json_body={'error': 'Requested game not found. Session may have expired'})

    if 'game_id' in json_body:
        game = request.registry.games.games[json_body['game_id']]

    if game.game_started:
        raise HTTPBadRequest(json_body={'error': 'Game has already started'})

    if 'player_name' in json_body:
        player_name = json_body['player_name']
    else:
        raise HTTPBadRequest(json_body={'error': "'player_name' is a required parameter for this request"})

    if 'player_age' in json_body:
        player_age = json_body['player_age']
    else:
        raise HTTPBadRequest(json_body={'error': "'player_age' is a required parameter for this request"})

    player = game.add_player(player_name, player_age)
    if player is not None:
        request.session['player_id'] = player.id
        return_data = {'game': game.get_dictionary(player_count=True, is_full=True),
                       'player': player.get_dictionary(player_age=True, player_color=True)}
    else:
        raise HTTPBadRequest(json_body={'error': "Player not created, game is full"})
    json_return = json.dumps(return_data)
    return Response(content_type='application/json', body=json_return)


@view_config(route_name='getPlayersInGame', renderer='json')
def get_players_in_game(request):
    """ Returns a list of all players currently in specified game

        Parameters
        ----------
        request: Request

        Returns
        -------
        Json object containing: "Players": [
                                    "Player": 
                                    {
                                        "player_id": String
                                        "player_name": String
                                        "player_color": String
                                        "player_age": Int
                                    } ...
                                ]

    """
    if 'game_id' in request.session:
        game_id = request.session['game_id']
        game = request.registry.games.games[game_id]
    else:
        raise HTTPBadRequest(json_body={'error': "Requested game not found. Session may have expired"})

    players = []
    if game.players:
        for _, player in game.players.iteritems():
            players.append(
                {'Player': player.get_dictionary(player_age=True, player_color=True, owned_settlements=True)})
    else:
        players.append("None")
    return_data = {'Players': players,
                   'Game': game.get_dictionary(has_started=True, player_count=True)}
    json_return = json.dumps(return_data)
    return Response(content_type='application/json', body=json_return)


@view_config(route_name='startGame', renderer='json')
def start_game(request):
    """ Starts game by setting a turn iterator in game object

        Parameters
        ----------
        request: Request 
            - required JSON parameters: "game_id": String

        Returns
        -------

        Json object containing: {"Success": Bool}
    """
    if 'game_id' in request.session:
        game_id = request.session['game_id']
        game = request.registry.games.games[game_id]
    else:
        raise HTTPBadRequest(json_body={'error': "Requested game not found. Session may have expired"})

    if len(game.turn_order) < 3:
        raise HTTPBadRequest(json_body={'error': "You cannot start a game with less than 3 players"})

    if not game.game_started:
        game.start_game()

    return_data = {"success": "True"}
    json_return = json.dumps(return_data)
    return Response(content_type='application/json', body=json_return)


@view_config(route_name='waitForNewPlayers', renderer='json')
def wait_for_new_players(request):
    """ This returns a list of players when the player count increases.

        Parameters
        ----------
        request: Request 
            - required JSON parameters: "game_id": String

        Returns
        -------

        Same object as in get_players_in_game()
    """
    json_body = request.json_body
    if 'game_id' in request.session:
        game_id = request.session['game_id']
        game = request.registry.games.games[game_id]
    else:
        raise HTTPBadRequest(json_body={'error': "Requested game not found. Session may have expired"})

    if 'current_player_count' in json_body:
        player_count = json_body['current_player_count']
    else:
        raise HTTPBadRequest(json_body={'error': "Required parameter 'current_player_count' not found in request"})

    timeout = 0
    players_added = "True"
    while (player_count < 4) and (player_count == len(game.turn_order)) and not game.game_started:
        time.sleep(1)
        timeout += 1
        if timeout > 10:
            players_added = "False"
            break

    players = []
    if game.players:
        for _, player in game.players.iteritems():
            players.append(
                {'Player': player.get_dictionary(player_age=True, player_color=True, owned_settlements=True)})
    else:
        players.append("None")

    return_data = {'players_added': players_added,
                   'Players': players,
                   'Game': game.get_dictionary(has_started=True, player_count=True)}
    json_return = json.dumps(return_data)
    return Response(content_type='application/json', body=json_return)


@view_config(route_name='getGameBoard', renderer='json')
def get_game_board(request):
    """ Returns a game board object.

        Parameters
        ----------
        request: Request 
            - required JSON parameters: "game_id": String

        Returns
        -------
        Board object (see object for structure)
    """
    if 'game_id' in request.session:
        game_id = request.session['game_id']
        game = request.registry.games.games[game_id]
    else:
        raise HTTPBadRequest(json_body={'error': "Requested game not found. Session may have expired"})

    json_return = json.dumps(game.game_board.get_dictionary())
    return Response(content_type='application/json', body=json_return)


@view_config(route_name='setSessionWithGame', renderer='json')
def set_session_with_game(request):
    """ ONLY FOR USE WITH POSTMAN: Sets the session for game, and optionally player

        Parameters
        ----------
        request: Request 
            - required JSON parameters: "game_id": String
            - optional JSON parameters: "player_id": String

        Returns
        -------
        Game object, optional Player object
    """
    json_body = request.json_body
    response = {}
    if 'game_id' in request.session:
        raise HTTPBadRequest(json_body={'error': "The session has already been set. Please remove the session in this "
                                                 "request in order to set a new session."})

    if 'game_id' in json_body:
        game_id = json_body['game_id']
        if game_id in request.registry.games.games:
            request.session['game_id'] = game_id
            game = request.registry.games.games[game_id]
            response["Game"] = game.get_dictionary()
        else:
            raise HTTPBadRequest(json_body={'error': "specified game id '%s' not found in games list" % game_id})
    else:
        raise HTTPBadRequest(json_body={'error': "'game_id' is a required parameter for this call"})

    if "player_id" in json_body:
        player_id = json_body['player_id']
        if player_id in game.players:
            request.session['player_id'] = player_id
            response["Player"] = game.players[player_id].get_dictionary()
        else:
            raise HTTPBadRequest(json_body={'error': "specified player id "
                                                     "'%s' not found in game '%s'" % (game_id, player_id)})

    json_return = json.dumps(response)
    return Response(content_type='application/json', body=json_return)

