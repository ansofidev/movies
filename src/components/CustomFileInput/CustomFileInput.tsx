import './CustomFileInput.scss';
import { useRef, useState } from 'react';

type Props = {
  accept?: string;
  onFileSelect: (file: File) => void;
};

export default function CustomFileInput({ accept = '.txt', onFileSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  return (
    <div className="custom-file-input">
      <button type="button" onClick={handleClick} className="upload-btn">
        Choose File
      </button>
      <span className="file-name">{fileName || 'No file selected'}</span>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </div>
  );
}
