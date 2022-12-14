import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
  useSetBusy,
  useSetMessage,
  useSetToasterMessage,
} from '../custom-hooks/authorize-provider';
import User from '../entities/user/User';
import {
  activateUsers,
  deleteUser,
  resetUserPassword,
  searchUsers,
} from '../processors/user-process';
import { RootState } from '../state/store';
import Pagination from './components/pagination';
import SeachBar from './components/seachbar';
import UserItem from './components/users-components/user-item';
import ManageUser from './modals/manage-user';
import { userActions } from '../state/reducers/userReducer';

export type USERACTIONS =
  | { type: 'Activate'; id: number; active: boolean }
  | { type: 'ResetPassword'; id: number }
  | { type: 'Edit'; user: User }
  | { type: 'Delete'; id: number };

export default function UserPage() {
  const dispatch = useDispatch();
  const [name, setName] = useState<string | undefined>();
  const users = useSelector((state: RootState) => state.user.users);
  const [pageCount, setPageCount] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const setBusy = useSetBusy();
  const setMessage = useSetMessage();
  const setToasterMessage = useSetToasterMessage();
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  useEffect(
    () => {
      searchUser(name, currentPage);
    },
    // eslint-disable-next-line
    []
  );

  function userAction(action: USERACTIONS) {
    switch (action.type) {
      case 'Activate':
        activateUser(action.id, action.active);
        break;
      case 'ResetPassword':
        resetPassword(action.id);
        break;
      case 'Edit':
        setShowModal(true);
        setSelectedUser(action.user);
        break;
      case 'Delete':
        setMessage({
          message: 'Are you sure you want to delete this?',
          action: 'YESNO',
          onOk: () => {
            deleteSelectedUser(action.id);
          },
        });
        break;
      default:
        setToasterMessage({ content: 'Invalid Action' });
        break;
    }
  }

  async function deleteSelectedUser(userid: number) {
    setBusy(true);
    await deleteUser(userid)
      .then(() => {
        setToasterMessage({
          content: 'User Deleted',
        });
        searchUser(name, currentPage);
      })
      .catch((err) => {
        setToasterMessage({
          content: err.message,
        });
      })
      .finally(() => setBusy(false));
  }

  function activateUser(id: number, active: boolean) {
    setMessage({
      message: `${active ? 'Activate' : 'Deactivate'} this user?`,
      action: 'YESNO',
      onOk: async () => {
        setBusy(true);
        await activateUsers(id)
          .then((res) => {
            dispatch(userActions.activate({ id, active }));
            setToasterMessage({
              content: active ? 'Activated' : 'Deactivated',
            });
          })
          .catch((err) => {
            setToasterMessage({
              content: err.message,
            });
          })
          .finally(() => setBusy(false));
      },
    });
  }

  function resetPassword(id: number) {
    setMessage({
      message: 'Reset Password?',
      action: 'YESNO',
      onOk: async () => {
        setBusy(true);
        await resetUserPassword(id)
          .then(() => {
            setToasterMessage({
              content: 'Password reset to default password',
            });
          })
          .catch((err) => {
            setToasterMessage({
              content: err.message,
            });
          })
          .finally(() => setBusy(false));
      },
    });
  }

  function searchUser(name: undefined | string, page: number) {
    setBusy(true);
    searchUsers(name, page)
      .then((res) => {
        if (res !== undefined) {
          dispatch(userActions.fill(res.results));
          setPageCount(res.pageCount);
          setCurrentPage(page);
        }
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => setBusy(false));
  }

  function goToPage(page: number) {
    searchUser(name, page);
  }

  function search(key: string) {
    setName(key);
    searchUser(key, 1);
  }

  function onClose(needToReload: boolean) {
    setShowModal(false);
    if (needToReload) {
      searchUser(name, currentPage);
    }
  }
  function addUser() {
    setSelectedUser(undefined);
    setShowModal(true);
  }

  return (
    <>
      <section>
        <SeachBar search={search} />
      </section>
      <section>
        <Pagination
          pages={pageCount}
          currentPageNumber={currentPage}
          goInPage={goToPage}
        />
      </section>
      <section className='table-container'>
        <table className='users-content item-table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Role</th>
              <th>Status</th>
              <th>
                <span>Action</span>
                <button className='btn' onClick={addUser}>
                  <FontAwesomeIcon icon={faPlus as IconProp} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserItem key={user.id} user={user} action={userAction} />
            ))}
          </tbody>
        </table>
      </section>
      <>
        {showModal && <ManageUser onClose={onClose} usersInfo={selectedUser} />}
      </>
    </>
  );
}
