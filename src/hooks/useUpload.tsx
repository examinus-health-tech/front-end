import { useContext } from 'react';
import { UploadContext } from '../contexts/UploadContext';

export function useUpload() {
  const context = useContext(UploadContext);

  console.log('🔍 useUpload context:', {
    hasContext: !!context,
    hasHandleUploadFile: !!context?.handleUploadFile,
    contextKeys: context ? Object.keys(context) : [],
  });

  if (!context) {
    throw new Error('useUpload must be used within an UploadContextProvider');
  }

  return context;
}
