import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

export default function Reserve() {
    const [attendees, setAttendees] = useState([]);
    const [name, setName] = useState("")
    const [reserveError, setReserveError] = useState("")

    useEffect(() => {
    getAttendees();
    }, []);

    async function getAttendees() {
    const { data, error } = await supabase.from("attendees").select("*");

    if (error) {
        console.error(error);
        return;
    }

    setAttendees(data);
    }

    async function addAttendee() {
    if (!name.trim()) {
        setReserveError("Please enter your name.");
        return;
    }

    if (attendees.length >= 25) {
        setReserveError("Sorry, we're full!");
        return;
    }

    const { error } = await supabase.from("attendees").insert([
        {
        name: name,
        }
    ])
    if (error) {
        console.error(error)
    }

    getAttendees();
    setName("")
    }
    return (
        <section>
            <div className="reservation-form">
            <h2>Reserve your spot:</h2>
            <form>
                <label>Name:</label>
                <input name="attendeeName" type="text" value={name} onChange={(e)=>setName(e.target.value)}></input>
                <button type="button" onClick={addAttendee}>Submit</button>
            </form>
            {reserveError && <p className="error">{reserveError}</p>}
            </div>
            <div className="attendees">
            <h2 className="main-header">Current Attendees:</h2>
            <ul>
                {attendees.map((attendee) => (
                <li key={attendee.name}>{attendee.name}</li>
                ))}
            </ul>
            </div>
        </section>
    )
}