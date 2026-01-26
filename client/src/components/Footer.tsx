const Footer = () => {
  return (
    <footer>
      <div className="parent">
        <div className="icons">
          <div className="icon">
            <i className="fa-solid fa-earth-americas"></i>
            <p className="icon-text">Gratis frakt och returer</p>
          </div>
          <div className="icon">
            <i className="fa-solid fa-jet-fighter"></i>
            <p className="icon-text">Expressfrakt</p>
          </div>
          <div className="icon">
            <i className="fa-solid fa-shield-halved"></i>
            <p className="icon-text">Säkra betalningar</p>
          </div>
          <div className="icon">
            <i className="fa-regular fa-face-smile"></i>
            <p className="icon-text">Nyheter varje dag</p>
          </div>
        </div>

        <div className="menu">
          <div className="mobile-view-footer-links">
            <div className="accordion accordion-flush" id="accordionFlushExample">
              <div className="accordion-item">
                <h2 className="accordion-header" id="flush-headingOne">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseOne"
                  >
                    <p>Shopping</p>
                  </button>
                </h2>
                <div id="flush-collapseOne" className="accordion-collapse collapse">
                  <div className="accordion-body">
                    <a href="#">Vinterjackor</a>
                    <a href="#">Pufferjackor</a>
                    <a href="#">Kappor</a>
                    <a href="#">Trenchcoats</a>
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header" id="flush-headingTwo">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseTwo"
                  >
                    <p>Mina Sidor</p>
                  </button>
                </h2>
                <div id="flush-collapseTwo" className="accordion-collapse collapse">
                  <div className="accordion-body">
                    <a href="#">Mina Ordrar</a>
                    <a href="#">Mitt Konto</a>
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header" id="flush-headingThree">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseThree"
                  >
                    <p>Kundtjänst</p>
                  </button>
                </h2>
                <div id="flush-collapseThree" className="accordion-collapse collapse">
                  <div className="accordion-body">
                    <a href="#">Returnpolicy</a>
                    <a href="#">Integritetspolicy</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-links">
            <div className="shopping-links">
              <p>Shopping</p>
              <a href="#">Vinterjackor</a>
              <a href="#">Pufferjackor</a>
              <a href="#">Kappor</a>
              <a href="#">Trenchcoats</a>
            </div>
            <div className="my-pages-links">
              <p>Mina Sidor</p>
              <a href="#">Mina Ordrar</a>
              <a href="#">Mitt Konto</a>
            </div>
            <div className="customer-service-links">
              <p>Kundtjänst</p>
              <a href="#">Returnpolicy</a>
              <a href="#">Integritetspolicy</a>
            </div>
          </div>

          <p className="cr-text">
            <i className="fa-regular fa-copyright"></i>
            Freaky Fashion
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
