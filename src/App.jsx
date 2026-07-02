import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Games from './Games.jsx'
import './App.css'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

export default function App() {
  const [attendees, setAttendees] = useState([]);
  const [name, setName] = useState("")

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
    <>
      <Header />
      <section>
        <div className="attendees">
          <h2 className="main-header">Current Attendees:</h2>
          <ul>
            {attendees.map((attendee) => (
              <li key={attendee.name}>{attendee.name}</li>
            ))}

          </ul>
        </div>
        <div className="reservation-form">
        <p>Reserve your spot:</p>
          <form>
            <label>Name:</label>
            <input name="attendeeName" type="text" value={name} onChange={(e)=>setName(e.target.value)}></input>
            <button type="button" onClick={addAttendee}>Submit</button>
          </form>
        </div>
      </section>
      <Games />
      <Footer />
    </>
  )
}