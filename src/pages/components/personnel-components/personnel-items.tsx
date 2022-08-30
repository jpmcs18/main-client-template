import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/store';
import { PersonnelActions } from '../../personnel-page';
import PersonnelItem from './personnel-item';

export default function PersonnelItems() {
  const action = useContext(PersonnelActions);
  const personnels = useSelector(
    (state: RootState) => state.personnel.personnels
  );
  return (
    <table className='item-table'>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Middle Name</th>
          <th>Last Name</th>
          <th>
            <span>Action</span>
            <button
              className='btn'
              onClick={() => {
                action({ action: 'Add' });
              }}>
              <FontAwesomeIcon icon={faPlus as IconProp} />
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {personnels?.map((personnel) => (
          <PersonnelItem key={personnel.id} personnel={personnel} />
        ))}
      </tbody>
    </table>
  );
}
