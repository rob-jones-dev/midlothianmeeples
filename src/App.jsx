import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

function formatDate(string) {
  let options = { year: 'numeric', month: 'long', day: 'numeric'};
  return new Date(string).toLocaleDateString([], options);
}

function genDate(start = new Date()) {
  let current = new Date(start);

  while(true) {
    current.setDate(current.getDate() + 1)

    if (current.getDay() === 3) {
      const dayOfMonth = current.getDate();
      const isFirst = dayOfMonth <= 7;
      const isThird = dayOfMonth >= 15 && dayOfMonth <= 21;

      if (isFirst || isThird) {
        return formatDate(current);
      }
    }
  }

}

export default function App() {
  const [nextDate, setNextDate] = useState(() => genDate());
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
    console.log(data);
  }

  async function addAttendee() {
    console.log("Adding name: " + name)
    const { data, error } = await supabase.from("attendees").insert([
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

  function clearDate() {
    setNextDate('Cleared!');
  }

  function generateNext() {
    setNextDate(genDate());
  }

  return (
    <>
      <header>
        <h1>Midlothian Meeples</h1>
        <h2>Board game night</h2>
        <p>Love board games? Join us for a community night of gaming, from card games to board games, fun for all!</p>
        <div>
          <h3>{nextDate}</h3>
          <h4>7-11pm</h4>
          <h5>Free Entry, reserve your spot below!</h5>
        </div>
      </header>
      <section>
        <h2>Test button section</h2>
        <button onClick={generateNext}>Generate next date</button>
        <button onClick={clearDate}>Reset date</button>
        <ul>
          {attendees.map((attendee) => (
            <li key={attendee.name}>{attendee.name}</li>
          ))}
        </ul>
        <p>Reserve your spot:</p>
        <form>
          <label>Name:</label>
          <input name="attendeeName" type="text" value={name} onChange={(e)=>setName(e.target.value)}></input>
          <button type="button" onClick={addAttendee}>Submit</button>
        </form>
      </section>
      <footer>
        <p>Snacks and drinks available for purchase</p>
        <p><b>Located at</b> /// Glencourse community centre, Auchendinny</p>
      </footer>
    </>
  )
}