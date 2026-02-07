type HeroData = {
  image: string;
  alt: string;
  title: string;
  information: string;
};

type Props = {
  hero: HeroData;
};

const Hero = ({ hero }: Props) => {
  return (
    <div className="hero">
      <img
        className="hero-image"
        src={`/images/${hero.image}`}
        alt={hero.alt}
      />
      {/* <img className="flowy3" src="/images/flowy3.png" />
      <img className="flowy2" src="/images/flowy2.png" /> */}
      <div className="texts">
        <h6>MEET FASHION X FUTURE</h6>
        <h1>{hero.title.replace(/\\n/g, '\n')}</h1>
        <p>{hero.information}</p>
        <div className="shop-news">
          <button className="btn-theme">Shoppa nu</button>
          <a href="/"><i className="fa-solid fa-arrow-right"></i> Shoppa senaste nyheterna!</a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
