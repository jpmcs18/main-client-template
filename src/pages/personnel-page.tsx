import { createContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  useSetBusy,
  useSetMessage,
  useSetToasterMessage,
} from '../custom-hooks/authorize-provider';
import { Personnel } from '../entities/transaction/Personnel';
import { searchPersonnels } from '../processors/personnel-process';
import { personnelActions } from '../state/reducers/personnelReducer';
import Pagination from './components/pagination';
import PersonnelItems from './components/personnel-components/personnel-items';
import SeachBar from './components/seachbar';
import ManagePersonnel from './modals/manage-personnel';
type ACTIONS =
  | { action: 'Add' }
  | { action: 'Edit'; payload: Personnel }
  | { action: 'Delete'; payload: number };
export const PersonnelActions = createContext<(action: ACTIONS) => void>(
  () => {}
);

export default function PersonnelPage() {
  const dispatch = useDispatch();
  const [key, setKey] = useState<string | undefined>();
  const [pageCount, setPageCount] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const setBusy = useSetBusy();
  const setMessage = useSetMessage();
  const [showModal, setShowModal] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState<
    Personnel | undefined
  >();
  const setToasterMessage = useSetToasterMessage();

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
    }
  }

  function searchPersonnel({
    searchKey,
    page,
  }: {
    searchKey?: string | undefined;
    page?: number | undefined;
  }) {
    setBusy(true);
    searchPersonnels(searchKey ?? key, page ?? currentPage)
      .then((res) => {
        if (res !== undefined) {
          dispatch(personnelActions.fill(res.results));
          setPageCount(res.pageCount);
          if (page !== undefined) setCurrentPage(page);
        }
      })
      .catch((err) => {
        setToasterMessage({ content: err.message });
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
    <>
      <section>
        <SeachBar search={search} />
      </section>
      <section>
        <Pagination
          pages={pageCount}
          currentPageNumber={currentPage}
          goInPage={goToPage}></Pagination>
      </section>
      <section className='table-container'>
        <PersonnelActions.Provider value={personnelAction}>
          <PersonnelItems />
        </PersonnelActions.Provider>
      </section>
      <>
        {showModal && (
          <ManagePersonnel
            onClose={onClose}
            selectedPersonnel={selectedPersonnel}
          />
        )}
      </>
    </>
  );
}
