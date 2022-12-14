import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import Personnel from '../../../entities/transaction/Personnel';
import { personnelActions } from '../../../state/reducers/personnelReducer';
import { RootState } from '../../../state/store';

export default function PersonnelItem({ personnel }: { personnel: Personnel }) {
  const dispatch = useDispatch();
  const selectedPersonnel = useSelector(
    (state: RootState) => state.personnel.selectedPersonnel
  );
  return (
    <tr
      className={selectedPersonnel?.id === personnel.id ? 'selected' : ''}
      onClick={() => dispatch(personnelActions.select(personnel))}>
      <td>{personnel.firstName}</td>
      <td>{personnel.middleName}</td>
      <td>{personnel.lastName}</td>
    </tr>
  );
}
