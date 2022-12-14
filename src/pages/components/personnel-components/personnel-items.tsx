import { useSelector } from 'react-redux';
import { RootState } from '../../../state/store';
import PersonnelItem from './personnel-item';

export default function PersonnelItems() {
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
