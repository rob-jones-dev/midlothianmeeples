import { useState } from 'react';

function formatDate(string) {
  let options = { year: 'numeric', month: 'long', day: 'numeric'};
  return new Date(string).toLocaleDateString([], options);
}

function genDate(start = new Date()) {
  let current = new Date(start);

  while(true) {
    current.setDate(current.getDate() + 1);

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
    const [nextDate] = useState(() => genDate());
    return (
        <header>
          <div className="header-text">
            <div>
              <h1>Midlothian Meeples</h1>
              <p><em>Board Game Night</em></p>
            </div>
            
            <a href="https://glencorsecentre.org.uk" target="_blank" rel="noopener noreferrer">
              <h2>The Glencourse Centre<br /> Auchendinny</h2>
            </a>
          </div>
          <div className="date-text">
            <div className="date-text-left">
              <h3><em>First and Third Wednesday of each month. Next session: {nextDate}, 7-11pm</em></h3>
            </div>
          </div>
        </header>
    )
}