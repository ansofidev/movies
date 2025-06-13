import AddMovieForm from '../../features/movies/AddMovieForm/AddMovieForm';
import './AddMovieModal.scss';

interface AddMovieModalProps {
  onClose: () => void;
}

export default function AddMovieModal({ onClose }: AddMovieModalProps) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>✖</button>
        <AddMovieForm />
      </div>
    </div>
  );
}
