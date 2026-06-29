import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

export default function Games() {
    let [games, setGames] = useState([]);

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

    return(
        <article>
            {games.map(game => 
                <div>
                    <h2>{game.name}</h2>
                    <p><em>{game.min_players} to {game.max_players} players.</em></p>
                </div>
            )}
        </article>
    )
}