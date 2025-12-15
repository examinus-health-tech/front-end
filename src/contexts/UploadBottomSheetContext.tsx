import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UploadBottomSheetContextData {
  isBottomSheetOpen: boolean;
  openBottomSheet: () => void;
  closeBottomSheet: () => void;
}

const UploadBottomSheetContext = createContext<UploadBottomSheetContextData>({} as UploadBottomSheetContextData);

interface UploadBottomSheetProviderProps {
  children: ReactNode;
}

export function UploadBottomSheetProvider({ children }: UploadBottomSheetProviderProps) {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const openBottomSheet = () => {
    console.log('📤 [UPLOAD_SHEET] Abrindo bottomSheet');
    setIsBottomSheetOpen(true);
  };

  const closeBottomSheet = () => {
    console.log('📥 [UPLOAD_SHEET] Fechando bottomSheet');
    setIsBottomSheetOpen(false);
  };

  return (
    <UploadBottomSheetContext.Provider
      value={{
        isBottomSheetOpen,
        openBottomSheet,
        closeBottomSheet,
      }}
    >
      {children}
    </UploadBottomSheetContext.Provider>
  );
}

export function useUploadBottomSheet() {
  const context = useContext(UploadBottomSheetContext);

  if (!context) {
    throw new Error('useUploadBottomSheet must be used within an UploadBottomSheetProvider');
  }

  return context;
}
