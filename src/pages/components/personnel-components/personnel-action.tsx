import { faAdd, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useDispatch } from 'react-redux';
import { personnelActions } from '../../../state/reducers/personnelReducer';
export default function PersonnelAction() {
  const dispatch = useDispatch();
  function deletePersonnel() {}
  return (
    <div className='btn-actions-group'>
      <button
        className='btn-action'
        title='Add'
        onClick={() => dispatch(personnelActions.add())}>
        <FontAwesomeIcon icon={faAdd} />
      </button>
      <button className='btn-action' title='Edit'>
        <FontAwesomeIcon
          icon={faEdit}
          onClick={() => dispatch(personnelActions.edit())}
        />
      </button>
      <button className='btn-action' title='Delete'>
        <FontAwesomeIcon icon={faTrash} onClick={deletePersonnel} />
      </button>
    </div>
  );
}
