import { useState } from 'react';

// TODO: implement drag & drop / file selection / upload progress logic
const useFileUpload = () => {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | pending | processing | complete | failed

  return { files, setFiles, progress, setProgress, status, setStatus };
};

export default useFileUpload;
