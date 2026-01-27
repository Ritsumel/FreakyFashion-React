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
      <div className="texts">
        <h1>{hero.title}</h1>
        <p>{hero.information}</p>
      </div>
    </div>
  );
};

export default Hero;
