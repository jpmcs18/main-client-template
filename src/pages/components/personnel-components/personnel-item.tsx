import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import { Personnel } from '../../../entities/transaction/Personnel';
import { PersonnelActions } from '../../personnel-page';

export default function PersonnelItem({ personnel }: { personnel: Personnel }) {
  const action = useContext(PersonnelActions);
  return (
    <tr>
      <td>{personnel.firstName}</td>
      <td>{personnel.middleName}</td>
      <td>{personnel.lastName}</td>
      <td>
        <div className='table-actions'>
          <button
            className='table-btn'
            onClick={() => action({ action: 'Edit', payload: personnel })}>
            <FontAwesomeIcon icon={faEdit as IconProp} />
          </button>
          <button
            className='table-btn'
            onClick={() => action({ action: 'Delete', payload: personnel.id })}>
            <FontAwesomeIcon icon={faTrash as IconProp} />
          </button>
        </div>
      </td>
    </tr>
  );
}
