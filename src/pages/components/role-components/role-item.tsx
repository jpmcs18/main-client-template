import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { Role } from '../../../entities/user/Role';
import { RoleActions } from '../../role-page';

export default function RoleItem({ role }: { role: Role }) {
  const action = useContext(RoleActions);
  return (
    <tr>
      <td>{role.description}</td>
      <td>
        <div className='table-actions'>
          <button
            className='table-btn'
            title='View'
            onClick={() => action({ action: 'View', payload: role })}>
            <FontAwesomeIcon icon={faEye as IconProp} />
          </button>
          <button
            title='Edit'
            className='table-btn'
            onClick={() => action({ action: 'Edit', payload: role })}>
            <FontAwesomeIcon icon={faEdit as IconProp} />
          </button>
          <button
            title='Delete'
            className='table-btn'
            onClick={() => action({ action: 'Delete', payload: role.id })}>
            <FontAwesomeIcon icon={faTrash as IconProp} />
          </button>
        </div>
      </td>
    </tr>
  );
}
