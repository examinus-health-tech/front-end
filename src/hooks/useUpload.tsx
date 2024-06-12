import { useContext } from 'react';
import { UploadContext } from '../contexts/UploadContext';

export function useUpload() {
  const context = useContext(UploadContext);

  return context;
}
