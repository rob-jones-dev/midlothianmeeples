import { useState } from 'react';

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

export default function Header() {
    const [nextDate, setNextDate] = useState(() => genDate());
    return (
        <header>
            <h1>Midlothian Meeples</h1>
            <h2>Board game night</h2>
            <p>Love board games? Join us for a community night of gaming, from card games to board games, fun for all!</p>
            <h3>{nextDate}</h3>
            <h4>7-11pm</h4>
            <h5>Free Entry, reserve your spot below!</h5>
         </header>
    )
}