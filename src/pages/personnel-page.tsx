import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useSetBusy,
  useSetMessage,
  useSetToasterMessage,
} from '../custom-hooks/authorize-provider';
import { searchPersonnels } from '../processors/personnel-process';
import { personnelActions } from '../state/reducers/personnelReducer';
import { RootState } from '../state/store';
import Pagination from './components/pagination';
import PersonnelAction from './components/personnel-components/personnel-action';
import PersonnelItems from './components/personnel-components/personnel-items';
import SeachBar from './components/seachbar';
import ManagePersonnel from './modals/manage-personnel';
export default function PersonnelPage() {
  const dispatch = useDispatch();

  const personnelState = useSelector((state: RootState) => state.personnel);
  const [key, setKey] = useState<string | undefined>();
  const [pageCount, setPageCount] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const setBusy = useSetBusy();
  const setMessage = useSetMessage();
  const setToasterMessage = useSetToasterMessage();

  useEffect(
    () => {
      searchPersonnel({});
    },
    // eslint-disable-next-line
    []
  );

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
    dispatch(personnelActions.closeManagementModal());
    if (needToReload) {
      searchPersonnel({});
    }
  }

  return (
    <>
      <section>
        <SeachBar search={search} />
      </section>
      <section className='table-header-control'>
        <PersonnelAction />
        <Pagination
          pages={pageCount}
          currentPageNumber={currentPage}
          goInPage={goToPage}></Pagination>
      </section>
      <section className='table-container'>
        <PersonnelItems />
      </section>
      <>
        {personnelState.showManagementModal && (
          <ManagePersonnel
            onClose={onClose}
            selectedPersonnel={personnelState.selectedPersonnel}
          />
        )}
      </>
    </>
  );
}
