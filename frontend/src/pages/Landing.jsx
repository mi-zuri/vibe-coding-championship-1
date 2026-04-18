import { Link } from 'react-router-dom';
import { Shell } from '../components/Layout.jsx';
import LonelinessMap from '../components/LonelinessMap.jsx';

export default function Landing() {
  return (
    <Shell>
      {/* HERO */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="eyebrow"><span className="dot" /> Program Obecność</div>
            <h1>Bądź obok. <em>Każdy dzień</em> ma znaczenie.</h1>
            <p className="hero-lede">
              Godzina tygodniowo u&nbsp;starszej osoby w&nbsp;twojej okolicy.
            </p>

            <div className="stat" role="group" aria-label="Statystyka kluczowa">
              <div className="stat-num">26<sup>%</sup></div>
              <div>
                <div className="stat-copy">
                  <strong>osiemdziesięciolatków w Polsce</strong> doświadcza poczucia
                  samotności <strong>każdego dnia.</strong>
                </div>
                <div className="stat-source">Źródło: Badanie PolSenior2, 2021 · ok. 10 mln osób 60+ w Polsce</div>
              </div>
            </div>

            <div className="hero-actions">
              <Link to="/zapisz-sie" className="btn btn-cta btn-lg">Zostań wolontariuszem</Link>
              <a href="#jak" className="secondary">Jak to działa →</a>
            </div>
          </div>

          <aside className="hotline" aria-label="Linia wsparcia">
            <div className="hotline-kicker">Dla seniorów i rodzin</div>
            <h3>Jesteś seniorem lub dzwonisz w&nbsp;imieniu bliskiej osoby?</h3>

            <a className="phone" href="tel:+48800123456">800 123 456</a>
            <div className="hotline-hours"><strong>Codziennie 9:00–19:00</strong> · połączenie bezpłatne</div>

            <div className="hotline-rule" />

            <div className="hotline-note">
              <p>Operator spokojnie porozmawia, zapyta o codzienność i zainteresowania.</p>
              <p>W ciągu kilku dni koordynator mbU dobierze wolontariusza i umówi pierwsze spotkanie.</p>
            </div>
          </aside>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section section-alt" id="jak">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="kicker">Jak to działa</div>
              <h2>Trzy spokojne kroki — żadnego pośpiechu.</h2>
            </div>
            <p className="lede">
              Nie rekrutujemy na ilość. Każde dopasowanie przechodzi przez
              koordynatora, który zna preferencje seniora.
            </p>
          </div>

          <div className="steps">
            <div className="step">
              <div className="step-num">01</div>
              <svg className="step-icon" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M8 36 V18 L22 8 L36 18 V36" strokeLinejoin="round"/>
                <path d="M8 36 H36" strokeLinecap="round"/>
                <path d="M18 36 V24 H26 V36" strokeLinejoin="round"/>
              </svg>
              <h3>Zapisujesz się</h3>
              <p>Krótki formularz: miasto, dostępność, zainteresowania.
                Nie pytamy o doświadczenie — pytamy o czas i gotowość.</p>
            </div>
            <div className="step">
              <div className="step-num">02</div>
              <svg className="step-icon" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <circle cx="14" cy="16" r="6"/>
                <circle cx="30" cy="16" r="6"/>
                <path d="M4 36 c2-6 6-9 10-9 s8 3 10 9" strokeLinecap="round"/>
                <path d="M20 36 c2-6 6-9 10-9 s8 3 10 9" strokeLinecap="round"/>
              </svg>
              <h3>Dobieramy parę</h3>
              <p>Typujesz kilka osób, z którymi czułbyś się dobrze.
                Koordynator mbU proponuje ostateczne dopasowanie —
                z uwzględnieniem preferencji seniora.</p>
            </div>
            <div className="step">
              <div className="step-num">03</div>
              <svg className="step-icon" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M22 36 s-12-7-12-17 a7 7 0 0 1 12-5 a7 7 0 0 1 12 5 c0 10-12 17-12 17z" strokeLinejoin="round"/>
              </svg>
              <h3>Budujecie relację</h3>
              <p>Regularne spotkania w okolicy. Twój pulpit podpowiada
                tematy i pomysły na wizyty, dziennik pomaga
                pamiętać, co ważne.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PULL QUOTE */}
      <section className="pullquote">
        <div className="wrap">
          <blockquote>
            Godzina rozmowy nie wydaje się wiele. Dla pani&nbsp;Krystyny to&nbsp;jedyny dzień
            w tygodniu, który ma swój rytm.
          </blockquote>
          <cite>— Anna, wolontariuszka, Poznań</cite>
        </div>
      </section>

      {/* MAP */}
      <LonelinessMap />

      {/* KNOWLEDGE */}
      <section className="section" id="wiedza">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="kicker">Baza wiedzy</div>
              <h2>Chcesz lepiej zrozumieć starsze osoby?</h2>
            </div>
            <p className="lede">
              Krótkie, rzetelne materiały pisane z psychologami i geriatrami.
              Dla wolontariuszy, rodzin i każdego, kto się troszczy.
            </p>
          </div>

          <div className="know-grid">
            <a href="#" className="know">
              <div className="know-tag">Komunikacja</div>
              <h3>Jak rozmawiać, gdy brakuje tematów</h3>
              <p>Nie wywiad, nie small talk. Proste techniki: wspólna cisza,
                stare fotografie, dzień w dzień.</p>
              <div className="know-more">Czytaj →</div>
            </a>
            <a href="#" className="know">
              <div className="know-tag">Zdrowie</div>
              <h3>Pierwsze oznaki otępienia — co zauważyć</h3>
              <p>Różnica między zapominaniem a chorobą. Kiedy delikatnie
                powiedzieć rodzinie, a kiedy koordynatorowi.</p>
              <div className="know-more">Czytaj →</div>
            </a>
            <a href="#" className="know">
              <div className="know-tag">Emocje</div>
              <h3>Żałoba, która nie mija</h3>
              <p>Owdowienie w późnym wieku zmienia strukturę dnia. Jak być
                obok, nie naprawiając.</p>
              <div className="know-more">Czytaj →</div>
            </a>
            <a href="#" className="know">
              <div className="know-tag">Praktyka</div>
              <h3>Pomysły na pierwszą wizytę</h3>
              <p>Przyniesienie herbaty nie jest banałem. Lista drobnych gestów,
                które rozluźniają pierwsze spotkanie.</p>
              <div className="know-more">Czytaj →</div>
            </a>
            <a href="#" className="know">
              <div className="know-tag">Granice</div>
              <h3>Kiedy powiedzieć „nie mogę dziś"</h3>
              <p>Dbanie o siebie nie jest porzucaniem. Jak utrzymać
                relację na lata.</p>
              <div className="know-more">Czytaj →</div>
            </a>
            <a href="#" className="know">
              <div className="know-tag">Rodziny</div>
              <h3>Gdy mama mieszka 300 km dalej</h3>
              <p>Praktyczne kroki dla rodzin, które chcą, by rodzic
                nie był sam — a nie mogą być codziennie.</p>
              <div className="know-more">Czytaj →</div>
            </a>
          </div>
        </div>
      </section>
    </Shell>
  );
}
