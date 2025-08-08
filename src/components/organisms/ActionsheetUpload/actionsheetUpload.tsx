import { useDisclose, Actionsheet } from 'native-base';

// assets
import { UploadTypeManual } from '../UploadTypeManual/uploadTypeManual';
import { UploadType } from '../UploadType/uploadType';
import { useEffect, useState } from 'react';

export function ActionSheetUpload({
  isOpen,
  onClose,
  navigation,
  handleUploadFile,
  setIsCameraOpen,
  handleCameraPermission,
}: {
  isOpen: boolean;
  onClose: () => void;
  navigation?: object;
  handleUploadFile?: (file: any) => void;
  setIsCameraOpen?: (state: boolean) => void;
  handleCameraPermission?: () => void;
}) {
  const [isManual, setManual] = useState(false);

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        {isManual ? (
          <UploadTypeManual setManual={setManual} />
        ) : (
          <UploadType 
            setIsCameraOpen={setIsCameraOpen}
            navigation={navigation || {}}
            handleUploadFileFromOnboarding={handleUploadFile || (() => {})}
            handleCameraPermission={handleCameraPermission}
          />
        )}
      </Actionsheet.Content>
    </Actionsheet>
  );
}
