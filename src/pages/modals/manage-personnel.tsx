import { useState } from 'react';
import {
  useSetBusy,
  useSetMessage,
} from '../../custom-hooks/authorize-provider';
import { Personnel } from '../../entities/transaction/Personnel';
import {
  createPersonnel,
  updatePersonnel,
} from '../../processors/personnel-process';
import CustomTextBox from '../components/custom-textbox';
import { CustomReturn } from '../components/CustomReturn';
import Modal from './modal';

export default function ManagePersonnel({
  selectedPersonnel,
  onClose,
}: {
  selectedPersonnel: Personnel | undefined;
  onClose: (hasChanges: boolean) => void;
}) {
  const [personnel, setPersonnel] = useState<Personnel>(
    () =>
      selectedPersonnel ?? {
        id: 0,
        classification: undefined,
        classificationId: undefined,
        name: '',
      }
  );
  const setBusy = useSetBusy();
  const setMessage = useSetMessage();
  async function saveData() {
    setBusy(true);
    if (personnel.id === 0) {
      await createPersonnel(personnel)
        .then(() => {
          setMessage({
            message: 'Personnel Added',
            onOk: () => {
              onClose(true);
            },
          });
        })
        .catch((err) => {
          setMessage({ message: err.message });
        })
        .finally(() => setBusy(false));
    } else {
      await updatePersonnel(personnel)
        .then(() => {
          setMessage({
            message: 'Personnel Updated',
            onOk: () => {
              onClose(true);
            },
          });
        })
        .catch((err) => {
          setMessage({ message: err.message });
        })
        .finally(() => setBusy(false));
    }
  }
  function onChange({ value, elementName }: CustomReturn) {
    setPersonnel((r) => {
      return { ...r, [elementName]: value };
    });
  }
  return (
    <Modal
      onClose={() => {
        onClose(false);
      }}
      title={
        !!selectedPersonnel?.id ? 'Update Personnel' : 'Add New Personnel'
      }>
      <div className='concern-management-modal-body modal-content-body concern-management'>
        <CustomTextBox
          title='Name'
          name='name'
          value={personnel.name}
          onChange={onChange}
        />
      </div>
      <div className='modal-footer'>
        <button onClick={saveData} className='btn-modal btn-primary'>
          SAVE
        </button>
      </div>
    </Modal>
  );
}
