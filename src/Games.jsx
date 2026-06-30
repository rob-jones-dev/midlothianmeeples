import { useState, useEffect, use } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

export default function Games() {
    let [games, setGames] = useState([]);
    let [reservationName, setReservationName] = useState("");
    let [reservationError, setReservationError] = useState("");
    let [addGameName, setAddGameName] = useState("");
    let [addHostName, setAddHostName] = useState("");
    let [addGameMinPlayers, setAddGameMinPlayers] = useState(1);
    let [addGameMaxPlayers, setAddGameMaxPlayers] = useState(1);
    let [addGameError, setAddGameError] = useState("");
    let [addGameHostPlaying, setAddGameHostPlaying] = useState(true);

    function capitalizeFirstLetter(val) {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    useEffect(() => {
    getGames();
    }, []);

    async function getGames() {
    const { data, error } = await supabase.from("games").select("*");

        if (error) {
            console.error(error);
            return;
        }

        setGames(data);
        console.log(data);
    }

    async function reserveSpot(game) {
        if (!reservationName.trim()) {
            setReservationError("Please enter your name.");
            return;
        }

        const currentPlayers = Array.isArray(game.players) ? game.players : [];

        if (currentPlayers.length >= game.max_players) {
            setReservationError("This game is already full.");
            return;
        }

        const updatedPlayers = [...currentPlayers, reservationName.trim()];

        const { error } = await supabase
            .from("games")
            .update({ players: updatedPlayers })
            .eq("id", game.id);

        if (error) {
            console.error(error);
            setReservationError("There was a problem reserving your spot.");
            return;
        }

        setGames(prevGames =>
            prevGames.map(item =>
                item.id === game.id
                    ? { ...item, players: updatedPlayers }
                    : item
            )
        );

        setReservationName("");
        setReservationError("");
    }

    async function addGame() {
        if (!addGameName.trim()) {
            setAddGameError("Please enter the name of your game.");
            return
        }
        if (!addHostName.trim()) {
            setAddGameError("Please enter the name of your Host.");
            return
        }
        if (addGameMinPlayers == 0) {
            setAddGameError("Please enter a minimum player count higher than 0");
            return
        }
        if (addGameMaxPlayers == 0 || addGameMaxPlayers < addGameMinPlayers) {
            setAddGameError("Please set a maximum player count higher than 0 and not lower than the minimum player count");
            return
        }

        let playersArray = []

        if (addGameHostPlaying && addHostName) {
            playersArray.push(capitalizeFirstLetter(addHostName));
        }

        const { data, error } = await supabase.from("games").insert([
            {
                name: capitalizeFirstLetter(addGameName),
                host: capitalizeFirstLetter(addHostName),
                max_players: addGameMaxPlayers,
                min_players: addGameMinPlayers,
                players: playersArray,
            }
        ])
        if (error) {
            console.error(error)
        }

        setAddGameError("");
        getGames();
        setAddGameName("");
        setAddHostName("");
        setAddGameMinPlayers(0);
        setAddGameMaxPlayers(0);
        setAddGameHostPlaying(true);
    }

    return(
        <>
            <article>
                {games.map(game => 
                    <div>
                        <h2>{game.name}</h2>
                        <p><em>{game.min_players} to {game.max_players} players.</em></p>
                        <p>Current Players:</p>
                        <ul>
                            {game.players.map((player, index) => (
                                <li key={`${player}-${index}`}>{player}</li>
                            ))}
                        </ul>
                        <label htmlFor="gamereserve">Name:</label>
                        <input
                            id="gamereserve"
                            name="gamereserve"
                            type="text"
                            value={reservationName}
                            onChange={(e) => setReservationName(e.target.value)}
                        />
                        <button type="button" onClick={() => reserveSpot(game)}>
                            Reserve spot for this game
                        </button>
                        {reservationError && <p>{reservationError}</p>}
                    </div>
                )}
            </article>
            <button>Add New Game</button>
            <div>
                <form>
                    <label for="game">Game:</label>
                    <input name="game" type="text" onChange={(e) => setAddGameName(e.target.value)}></input>
                    <label for="host">Host:</label>
                    <input name="host" type="text" onChange={(e) => setAddHostName(e.target.value)}></input>
                    <label for="minplayers">Minimum number of players:</label>
                    <input name="minplayers" type="number" value={addGameMinPlayers} onChange={(e) => setAddGameMinPlayers(e.target.value)}></input>
                    <label for="maxplayers">Maximum number of players:</label>
                    <input name="maxplayers" type="number" value={addGameMaxPlayers} onChange={(e) => setAddGameMaxPlayers(e.target.value)}></input>
                    <label for="hostPlaying">Will the Host be playing the game?</label>
                    <input name="hostPlaying" defaultChecked type="checkbox" onChange={(e) => setAddGameHostPlaying(e.target.value)}></input>
                    <button onClick={addGame} type="button">Submit Game</button>
                    {addGameError && <p>{addGameError}</p>}
                </form>
            </div>
        </>
    )
}