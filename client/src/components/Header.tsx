const Header = () => {
  return (
    <header>
      <div className="parent">
        <a href="/" id="logo">
          <img
            src="/images/freaky-fashion-logo.png"
            alt="Freaky Fashion logotyp"
          />
        </a>

        <div className="box1">
          <form action="/search" method="GET" className="search-field">
            <i id="search-icon" className="fa-solid fa-magnifying-glass"></i>
            <input
              id="search-bar"
              name="q"
              type="text"
              placeholder="Sök produkt"
              required
            />
          </form>

          <div className="icons">
            <a href="/"><i className="fa-solid fa-heart"></i></a>
            <a href="/basket"><i className="fa-solid fa-basket-shopping"></i></a>
          </div>
        </div>
      </div>

      <div className="menu">
        <nav>
          <a href="/">Nyheter</a>
          <a href="/">Bästsäljare</a>
          <a href="/">Kvinnor</a>
          <a href="/">Män</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
