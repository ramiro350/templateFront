import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser } from '../store/slices/userSlice';
import { Link } from 'react-router-dom';

const UserList = ({refreshTrigger}) => {
  const dispatch = useDispatch();
  const { items: users, isLoading, error } = useSelector((state) => state.users);

  useEffect(() => {
    console.log('UserList mounted or refreshTrigger changed, fetching users...');
    dispatch(fetchUsers());
  }, [dispatch, refreshTrigger]);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US');
  };

  const formatCPF = (cpf) => {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-list">
      <div className="user-list-header">
        <h2>Users</h2>
        <Link to="/users/new" className="btn-primary">Add New User</Link>
      </div>
      
      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>CPF</th>
            <th>Nationality</th>
            <th>Gender</th>
            <th>Birth Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{formatCPF(user.cpf)}</td>
              <td>{user.nacionalidade || '-'}</td>
              <td>
                {user.sexo === 'M' ? 'Male' : 
                 user.sexo === 'F' ? 'Female' : 
                 user.sexo === 'O' ? 'Other' : '-'}
              </td>
              <td>{user.dataNascimento ? formatDate(user.dataNascimento) : '-'}</td>
              <td className="actions">
                <Link to={`/users/${user.id}`} className="btn-secondary">Edit</Link>
                <button 
                  onClick={() => handleDelete(user.id)}
                  className="btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;