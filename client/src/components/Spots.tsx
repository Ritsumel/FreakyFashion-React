type Spot = {
  image: string;
  alt: string;
  title: string;
};

type Props = {
  spots: Spot[];
};

const Spots = ({ spots }: Props) => {
  return (
    <div className="spots">
      {spots.map((spot, i) => (
        <a href="/" className="spot" key={i}>
          <img src={`/images/${spot.image}`} alt={spot.alt} />
          <h1>{spot.title}</h1>
        </a>
      ))}
    </div>
  );
};

export default Spots;
