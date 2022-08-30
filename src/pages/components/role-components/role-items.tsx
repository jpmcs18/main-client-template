import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { RoleActions, RoleList } from '../../role-page';
import RoleItem from './role-item';

export default function RoleItems() {
  const action = useContext(RoleActions);
  const concerns = useContext(RoleList);
  return (
    <table className='item-table'>
      <thead>
        <tr>
          <th>Description</th>
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
        {concerns.map((concern) => (
          <RoleItem key={concern.id} role={concern} />
        ))}
      </tbody>
    </table>
  );
}
