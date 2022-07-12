import { createContext, useEffect, useState } from 'react';
import { useSetBusy, useSetMessage } from '../custom-hooks/authorize-provider';
import { Personnel } from '../entities/transaction/Personnel';
import {
  deletePersonnel,
  searchPersonnels,
} from '../processors/personnel-process';
import Pagination from './components/pagination';
import PersonnelItems from './components/personnel-components/personnel-items';
import SeachBar from './components/seachbar';
import ManagePersonnel from './modals/manage-personnel';

type ACTIONS =
  | { action: 'Add' }
  | { action: 'Edit'; payload: Personnel }
  | { action: 'Delete'; payload: number };
export const PersonnelList = createContext<Personnel[]>([]);
export const PersonnelActions = createContext<(action: ACTIONS) => void>(
  () => {}
);

export default function OfficePage() {
  const [key, setKey] = useState<string | undefined>();
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const setBusy = useSetBusy();
  const setMessage = useSetMessage();
  const [showModal, setShowModal] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState<
    Personnel | undefined
  >();

  useEffect(
    () => {
      searchPersonnel({});
    },
    // eslint-disable-next-line
    []
  );

  function personnelAction(action: ACTIONS) {
    switch (action.action) {
      case 'Add':
        setShowModal(true);
        setSelectedPersonnel(undefined);
        break;
      case 'Edit':
        setShowModal(true);
        setSelectedPersonnel(action.payload);
        break;
      case 'Delete':
        setMessage({
          message: 'Do you want to delete this personnel?',
          action: 'YESNO',
          onOk: () => {
            removePersonnel(action.payload);
          },
        });
        break;
    }
  }
  async function removePersonnel(id: number) {
    setBusy(true);
    await deletePersonnel(id)
      .then(() => {
        setMessage({ message: 'Deleted.' });
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => setBusy(false));
  }
  async function searchPersonnel({
    searchKey,
    page,
  }: {
    searchKey?: string | undefined;
    page?: number | undefined;
  }) {
    setBusy(true);
    await searchPersonnels(searchKey ?? key, page ?? currentPage)
      .then((res) => {
        if (res !== undefined) {
          setPersonnels(res.results);
          setPageCount(res.pageCount);
          if (page !== undefined) setCurrentPage(page);
        }
      })
      .catch((err) => {
        setMessage({ message: err.message });
      })
      .finally(() => setBusy(false));
  }

  function goToPage(page: number) {
    searchPersonnel({ page: page });
  }

  function search(key: string) {
    setKey(key);
    searchPersonnel({ searchKey: key, page: 1 });
  }

  function onClose(needToReload: boolean) {
    setShowModal(false);
    if (needToReload) {
      searchPersonnel({});
    }
  }

  return (
    <div className='main-container'>
      <div className='item-container'>
        <SeachBar search={search} />
        <div>
          <Pagination
            pages={pageCount}
            currentPageNumber={currentPage}
            goInPage={goToPage}></Pagination>
        </div>
        <PersonnelList.Provider value={personnels}>
          <PersonnelActions.Provider value={personnelAction}>
            <PersonnelItems />
          </PersonnelActions.Provider>
        </PersonnelList.Provider>
      </div>
      <div>
        {showModal && (
          <ManagePersonnel
            onClose={onClose}
            selectedPersonnel={selectedPersonnel}
          />
        )}
      </div>
    </div>
  );
}
