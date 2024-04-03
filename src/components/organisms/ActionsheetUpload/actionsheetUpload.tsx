import { useDisclose, Actionsheet } from 'native-base';

// assets
import { UploadTypeManual } from '../UploadTypeManual/uploadTypeManual';
import { UploadType } from '../UploadType/uploadType';
import { useEffect, useState } from 'react';

export function ActionSheetUpload({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isManual, setManual] = useState(false);

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        {isManual ? (
          <UploadTypeManual setManual={setManual} />
        ) : (
          <UploadType setManual={setManual} />
        )}
      </Actionsheet.Content>
    </Actionsheet>
  );
}
