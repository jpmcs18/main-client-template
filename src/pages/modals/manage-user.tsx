import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faEye, faTrash, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import {
  useSetBusy,
  useSetMessage,
} from '../../custom-hooks/authorize-provider';
import { Personnel } from '../../entities/transaction/Personnel';
import { Role } from '../../entities/user/Role';
import { User, UserRole } from '../../entities/user/User';
import { getPersonnels } from '../../processors/personnel-process';
import { getRoles } from '../../processors/role-process';
import { createUser, updateUser } from '../../processors/user-process';
import CustomCheckBoxButton from '../components/custom-check-box-button';
import CustomDropdown, { DropdownItem } from '../components/custom-dropdown';
import CustomTextBox from '../components/custom-textbox';
import { CustomReturn } from '../components/CustomReturn';
import ManageRole from './manage-role';
import Modal from './modal';
export default function ManageUser({
  usersInfo,
  onClose,
}: {
  usersInfo: User | undefined;
  onClose: (needToReLoad: boolean) => void;
}) {
  const [personnelItem, setPersonnelItem] = useState<DropdownItem[]>([]);
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [user, setUser] = useState<User>(
    () =>
      usersInfo ?? {
        id: 0,
        username: '',
        name: '',
        active: false,
        admin: false,
        personnel: undefined,
        personnelId: undefined,
      }
  );
  const [roles, setRoles] = useState<Role[]>([]);
  const [roleItems, setRoleItems] = useState<DropdownItem[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>(
    () => usersInfo?.userRoles ?? []
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | undefined>();
  const setBusy = useSetBusy();
  const setMessage = useSetMessage();
  useEffect(
    () => {
      initializeComponents();
    },
    // eslint-disable-next-line
    []
  );
  async function initializeComponents() {
    await fetchPersonnels();
    await fetchRoles();
  }
  async function saveData() {
    setBusy(true);
    if (user.id === 0) {
      await createUser(
        user,
        userRoles.map((x) => x.roleId)
      )
        .then(() => {
          setMessage({
            message: 'New User Added',
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
      await updateUser(
        user,
        userRoles.filter((x) => x.id === 0).map((x) => x.roleId),
        userRoles.filter((x) => x.deleted).map((x) => x.id)
      )
        .then(() => {
          setMessage({
            message: 'User Updated',
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
  async function fetchPersonnels() {
    setBusy(true);
    await getPersonnels()
      .then((res) => {
        if (res !== undefined) {
          setPersonnels(res);
          setPersonnelItem([
            {
              key: '',
              value: '',
            },
            ...res.map((x) => {
              return {
                key: x.id.toString(),
                value: x.fullName ?? '',
              };
            }),
          ]);
        }
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => setBusy(false));
  }
  function onChange({ elementName, value }: CustomReturn) {
    if (elementName === 'role') {
      let role = roles.filter((x) => x.id === +value)?.[0];
      setUserRoles((r) => [
        ...r,
        { id: 0, roleId: role.id, role: role, userId: user.id },
      ]);
      setRoleItems((r) => r.filter((x) => x.key !== value));
    }
    if (elementName === 'personnel') {
      let personnel = personnels.filter((x) => x.id === +value)?.[0];
      setUser((prev) => {
        return { ...prev, personnel: personnel, personnelId: personnel.id };
      });
      return;
    }

    setUser((prevUser) => {
      if (prevUser === undefined) return { [elementName]: value } as User;
      return { ...prevUser, [elementName]: value };
    });
  }
  async function fetchRoles() {
    setBusy(true);
    await getRoles()
      .then((res) => {
        if (res !== undefined) {
          setRoles(res);
          setRoleItems([
            { key: '', value: '' },
            ...res
              .filter(
                (x) =>
                  !user.userRoles?.filter((u) => u.roleId === x.id)?.[0]?.id
              )
              .map((x) => {
                return { key: x.id.toString(), value: x.description };
              }),
          ]);
        }
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => {
        setBusy(false);
      });
  }
  function undoDeleteRole(role: UserRole) {
    setUserRoles((res) =>
      res.map((x) => {
        if (x.roleId === role.roleId) x.deleted = false;
        return x;
      })
    );
  }
  function deleteRole(role: UserRole) {
    setUserRoles((res) => {
      if (role.id === 0) {
        return res.filter((x) => x.roleId !== role.roleId);
      }
      return res.map((x) => {
        if (x.roleId === role.roleId) x.deleted = true;
        return x;
      });
    });
    if (role.id === 0) {
      setRoleItems([
        ...roleItems,
        {
          key: role.roleId?.toString() ?? '',
          value: role.role?.description ?? '',
        },
      ]);
    }
  }
  function viewRole(role: UserRole) {
    setSelectedRole(role.role);
    setShowModal(true);
  }
  return (
    <Modal
      onClose={() => onClose(false)}
      title={(user?.id ?? 0) > 0 ? 'Update Users Information' : 'Add New User'}>
      <div className='user-management-modal-body modal-content-body'>
        <div>
          <CustomDropdown
            title='Personnel'
            name='personnel'
            value={user?.personnel?.fullName}
            onChange={onChange}
            itemsList={personnelItem}
          />
          <CustomTextBox
            title='Username'
            name='username'
            value={user?.username}
            onChange={onChange}
          />
        </div>
        <div>
          <CustomCheckBoxButton
            CheckedTitle='Admin'
            UncheckedTitle='User'
            name='admin'
            isCheck={user?.admin ?? false}
            onChange={onChange}
          />
          <CustomCheckBoxButton
            CheckedTitle='Active'
            UncheckedTitle='Inactive'
            name='active'
            isCheck={user?.active ?? false}
            onChange={onChange}
          />
        </div>
        <div>
          <CustomDropdown
            title='Role'
            name='role'
            onChange={onChange}
            itemsList={roleItems}
          />
        </div>
        <div className='table-container'>
          <table className='item-table'>
            <thead>
              <tr>
                <th>User Roles</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userRoles?.map((role) => (
                <tr key={role.roleId} className={role.deleted ? 'deleted' : ''}>
                  <td>{role.role?.description}</td>
                  <td>
                    <div className='table-actions'>
                      {role.deleted && (
                        <button
                          className='table-btn'
                          onClick={() => {
                            undoDeleteRole(role);
                          }}
                          title='Undo'>
                          <FontAwesomeIcon icon={faUndo as IconProp} />
                        </button>
                      )}
                      {!role.deleted && (
                        <button
                          className='table-btn'
                          onClick={() => {
                            deleteRole(role);
                          }}
                          title='Delete'>
                          <FontAwesomeIcon icon={faTrash as IconProp} />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          viewRole(role);
                        }}
                        title='View'
                        className='table-btn'>
                        <FontAwesomeIcon icon={faEye as IconProp} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className='modal-footer'>
        <button onClick={saveData} className='btn-modal btn-primary'>
          SAVE
        </button>
      </div>
      <div>
        {showModal && (
          <ManageRole
            onClose={() => {
              setShowModal(false);
            }}
            selectedRole={selectedRole}
            viewOnly={true}
          />
        )}
      </div>
    </Modal>
  );
}
