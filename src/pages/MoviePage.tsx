import { useParams } from 'react-router-dom';

const MoviePage = () => {
  const { id } = useParams();

  return <div>Movie Details for ID: {id}</div>;
};

export default MoviePage;
