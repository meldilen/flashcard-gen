import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./DocumentUpload.css";

export default function DocumentUpload({ onUpload, disabled }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large (max 10MB)');
      return;
    }
    if (!["application/pdf", "text/plain"].includes(file.type)) {
      setError("Only PDF/TXT files allowed");
      return;
    }
    setFile(file);
    setError("");
    onUpload(file);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
    },
    disabled,
  });

  return (
    <div className="document-upload">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""}`}
      >
        <input {...getInputProps()} />
        {file ? (
          <p>
            Selected: <strong>{file.name}</strong>
          </p>
        ) : (
          <p>Drag & drop PDF/TXT file, or click to browse</p>
        )}
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
