import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

import Header from './Header.jsx'



export default function Admin() {
    const [attendees, setAttendees] = useState([]);
    const [games, setGames] = useState([]);
    const [editingName, setEditingName] = useState("");
    const [editingGameName, setEditingGameName] = useState("");
    const [editingHost, setEditingHost] = useState("");
    const [editingMinPlayers, setEditingMinPlayers] = useState(1);
    const [editingMaxPlayers, setEditingMaxPlayers] = useState(1);
    const [editingPlayers, setEditingPlayers] = useState([]);
    const [editingAttendeeId, setEditingAttendeeId] = useState(null);
    const [editingGameId, setEditingGameId] = useState(null);

    useEffect(() => {
        getAttendees();
        getGames();
    }, []);

    async function getAttendees() {
    

    const { data, error } = await supabase.from("attendees").select("*");

    if (error) {
        console.error(error);
        return;
    }

    setAttendees(data);
    }

    async function getGames() {
        const { data, error } = await supabase.from("games").select("*");

        if (error) {
            console.error(error);
            return;
        }

        setGames(data);
    }

    function editToggle (attendeeId) {
        setEditingAttendeeId(attendeeId === editingAttendeeId ? null : attendeeId);
        const attendee = attendees.find(a => a.id === attendeeId);
        if (attendee) {
            setEditingName(attendee.name);
        }        setEditingGameId(null);    }

    async function confirmEdit(attendeeId) {
        const { error } = await supabase
            .from("attendees")
            .update({ name: editingName })
            .eq("id", attendeeId);
        
        if (!error) {
            setAttendees(attendees.map(a => a.id === attendeeId ? {...a, name: editingName} : a));
            setEditingAttendeeId(null);
        }
    }

    async function deleteAttendee(attendeeId) {
        const { error } = await supabase
            .from("attendees")
            .delete()
            .eq("id", attendeeId);

        if (!error) {
            setAttendees(attendees.filter(a => a.id !== attendeeId));
        }
    }

    function editGame(gameId) {
        const game = games.find(g => g.id === gameId);
        if (game) {
            setEditingGameId(gameId);
            setEditingAttendeeId(null);
            setEditingGameName(game.name);
            setEditingHost(game.host);
            setEditingMinPlayers(game.min_players);
            setEditingMaxPlayers(game.max_players);
            setEditingPlayers(game.players || []);
        }
    }

    async function confirmGameEdit(gameId) {
        const { error } = await supabase
            .from("games")
            .update({ 
                name: editingGameName, 
                host: editingHost,
                min_players: editingMinPlayers,
                max_players: editingMaxPlayers,
                players: editingPlayers
            })
            .eq("id", gameId);
        
        if (!error) {
            setGames(games.map(g => g.id === gameId ? 
                {...g, name: editingGameName, host: editingHost, min_players: editingMinPlayers, max_players: editingMaxPlayers, players: editingPlayers} 
                : g
            ));
            setEditingGameId(null);
        }
    }

    async function deleteGame(gameId) {
        const { error } = await supabase
            .from("games")
            .delete()
            .eq("id", gameId);
        
        if (!error) {
            setGames(games.filter(g => g.id !== gameId));
        }
    }

    async function clearAll() {
        const { error: attendeesError } = await supabase
            .from("attendees")
            .delete()
            .neq("id", 0);
        
        const { error: gamesError } = await supabase
            .from("games")
            .delete()
            .neq("id", 0);
        
        if (!attendeesError && !gamesError) {
            setAttendees([]);
            setGames([]);
        }
    }

    function revealConfirm() {
        let button = document.querySelector('.confirm-button');
        button.classList.toggle("hidden");
        button.disabled = true;
        setTimeout(function() {
            button.disabled = false;
        }, 5000)
    }

    return (
        <>
            <Header />
            <div className="admin-panel">
                <h1>Admin Panel</h1>
                <button onClick={revealConfirm}>Clear Games and Attendees for Next Week</button>
                <button onClick={clearAll} className="hidden confirm-button">Confirm (This cannot be undone!)</button>
                <h3>Attendees</h3>
                <ul className="people-panel">
                    {attendees.map((attendee) => (
                        <li className={attendee.id === editingAttendeeId ? "editing" : ""} key={attendee.id}>
                            <span className={attendee.id === editingAttendeeId ? "hidden" : ""}>
                                {attendee.name}
                            </span>
                            <input 
                                className={attendee.id === editingAttendeeId ? "edit-input" : "edit-input hidden"} 
                                type="text" 
                                value={editingName}
                            />
                            <button 
                                className={attendee.id === editingAttendeeId ? "confirm-button" : "confirm-button hidden"}
                                onClick={() => confirmEdit(attendee.id)}
                            >
                                Confirm
                            </button>
                            <button onClick={() => editToggle(attendee.id)}>Edit</button>
                            <button onClick={() => deleteAttendee(attendee.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
                <h3>Games</h3>
                <ul className="games-panel">
                    {games.map((game) => (
                        <li className={game.id === editingGameId ? "editing" : ""} key={game.id}>
                            {game.name}<button onClick={() => editGame(game.id)}>Edit</button>
                            <div className={game.id === editingGameId ? "edit-panel" : "edit-panel hidden"}>
                                <label>Name:</label>
                                <input 
                                    id={`editName-${game.id}`}
                                    type="text"
                                    value={editingGameName}
                                    onChange={(e) => setEditingGameName(e.target.value)}
                                />
                                <label>Host:</label>
                                <input 
                                    id={`editHost-${game.id}`}
                                    type="text"
                                    value={editingHost}
                                    onChange={(e) => setEditingHost(e.target.value)}
                                />
                                <label>Minimum Players:</label>
                                <input 
                                    id={`editMinPlayers-${game.id}`}
                                    type="number"
                                    value={editingMinPlayers}
                                    onChange={(e) => setEditingMinPlayers(e.target.value)}
                                />
                                <label>Maximum Players:</label>
                                <input 
                                    id={`editMaxPlayers-${game.id}`}
                                    type="number"
                                    value={editingMaxPlayers}
                                    onChange={(e) => setEditingMaxPlayers(e.target.value)}
                                />
                                <label>Players</label>
                                <div className="player-panel">
                                    {game.players.map((player) => (
                                        <input
                                            id={`editPlayer-${player}`}
                                            type="text"
                                            value={player}
                                            onChange={(e) => setEditingPlayers(e.target.value)}
                                        />
                                    ))}
                                </div>
                                <button onClick={() => confirmGameEdit(game.id)}>Confirm Changes</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}