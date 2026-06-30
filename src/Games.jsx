import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

export default function Games() {
    let [games, setGames] = useState([]);
    let [reservationName, setReservationName] = useState("");
    let [reservationError, setReservationError] = useState("");

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
                    <input name="game" type="text"></input>
                    <label for="host">Host:</label>
                    <input name="host"></input>
                    <label for="minplayers">Minimum number of players:</label>
                    <input name="minplayers" type="number"></input>
                    <label for="maxplayers">Maximum number of players:</label>
                    <input name="maxplayers" type="number"></input>
                </form>
            </div>
        </>
    )
}