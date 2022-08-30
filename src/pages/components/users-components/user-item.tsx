import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faAsterisk,
  faEdit,
  faKey,
  faPowerOff,
  faRecycle,
  faRedo,
  faRedoAlt,
  faTrash,
  faUndo,
  faUndoAlt,
  faUserAltSlash,
  faUserCheck,
  faUserLock,
  faUserSecret,
  faUserShield,
  faUserSlash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { User } from '../../../entities/user/User';
import { USERACTIONS } from '../../user-page';

export default function UserItem({
  user,
  action,
}: {
  user: User;
  action: (action: USERACTIONS) => void;
}) {
  return (
    <tr>
      <td>{user.personnel?.fullName}</td>
      <td>{user.username}</td>
      <td className='elipsis'>
        {user.admin ? 'Admin' : 'User'}
        {(user.userRoles?.length ?? 0) > 0 && ' | '}
        {user.userRoles?.map((x) => x.role.description).join(' | ')}
      </td>
      <td>{user.active ? 'Active' : 'Inactive'}</td>
      <td>
        <div className='table-actions'>
          {user.active && (
            <button
              className='table-btn'
              title='Deactivate'
              onClick={() =>
                action({ type: 'Activate', id: user.id, active: !user.active })
              }>
              <FontAwesomeIcon icon={faUserSlash as IconProp} />
            </button>
          )}
          {!user.active && (
            <button
              className='table-btn'
              title='Activate'
              onClick={() =>
                action({ type: 'Activate', id: user.id, active: !user.active })
              }>
              <FontAwesomeIcon icon={faUserCheck as IconProp} />
            </button>
          )}
          <button
            className='table-btn reset-password'
            title='Reset Password'
            onClick={() => action({ type: 'ResetPassword', id: user.id })}>
            <FontAwesomeIcon icon={faKey as IconProp} className='outer' />
            <FontAwesomeIcon icon={faUndoAlt as IconProp} className='inner' />
          </button>
          <button
            className='table-btn'
            title='Edit'
            onClick={() => action({ type: 'Edit', user: user })}>
            <FontAwesomeIcon icon={faEdit as IconProp} />
          </button>
          <button
            className='table-btn'
            title='Delete'
            onClick={() => action({ type: 'Delete', id: user.id })}>
            <FontAwesomeIcon icon={faTrash as IconProp} />
          </button>
        </div>
      </td>
    </tr>
  );
}
