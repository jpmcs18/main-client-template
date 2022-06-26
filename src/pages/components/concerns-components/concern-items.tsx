import React, { useContext } from 'react';
import { ConcernActions, ConcernList } from '../../concern-page';
import ConcernItem from './concern-item';

export default function ConcernItems() {
  const action = useContext(ConcernActions);
  const concerns = useContext(ConcernList);
  return (
    <table className='item-table'>
      <thead>
        <tr>
          <th>Time Entry</th>
          <th>Description</th>
          <th>Classification</th>
          <th>Concern Office</th>
          <th>Caller</th>
          <th>Status</th>
        </tr>
        <tr>
          <th colSpan={10}>
            <button
              className='btn'
              onClick={() => {
                action({ action: 'Add' });
              }}>
              Add New Concern
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {concerns.map((concern) => (
          <ConcernItem key={concern.id} concern={concern} />
        ))}
      </tbody>
    </table>
  );
}
