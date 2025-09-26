import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUser, createUser, updateUser, clearError } from '../store/slices/userSlice';

const UserForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser, isLoading, error } = useSelector((state) => state.users);
  const { loggedInUserId, isAuthenticated } = useSelector((state) => state.auth);


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cpf: '',
    nacionalidade: '',
    naturalidade: '',
    sexo: '',
    dataNascimento: '',
  });

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchUser(id));
    }
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        password: '',
        cpf: currentUser.cpf || '',
        nacionalidade: currentUser.nacionalidade || '',
        naturalidade: currentUser.naturalidade || '',
        sexo: currentUser.sexo || '',
        dataNascimento: currentUser.dataNascimento ? 
          currentUser.dataNascimento.split('T')[0] : '',
      });
    }
  }, [currentUser, isEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    

    

    if (!formData.name.trim() || !formData.cpf.trim() || !formData.dataNascimento) {
      alert('Please fill in all required fields');
      return;
    }

    if (isEdit) {

      console.log(id)
      console.log(loggedInUserId)
      if (id !== localStorage.getItem('loggedInUserId')) {
        alert('You can only edit your own profile');
        return;
      }

      const updateData = {
        id: id,
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        cpf: formData.cpf.replace(/[\.-]/g, '').trim(),
        nacionalidade: formData.nacionalidade.trim() || null,
        naturalidade: formData.naturalidade.trim() || null,
        sexo: formData.sexo || null,
        dataNascimento: new Date(formData.dataNascimento).toISOString(),
      };
      
      // Only include password if it's provided
      if (formData.password.trim() !== '') {
        updateData.password = formData.password;
      }
      
      console.log('Sending PUT request with data:', updateData);
      
      dispatch(updateUser(updateData)) // Pass the entire object
        .unwrap()
        .then(() => {
          console.log('User updated successfully');
          
          navigate('/users');
        })
        .catch((error) => {
          console.error('Error updating user:', error);
        });
    } else {
      const createData = {
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        password: formData.password,
        cpf: formData.cpf.replace(/[\.-]/g, '').trim(),
        nacionalidade: formData.nacionalidade.trim() || null,
        naturalidade: formData.naturalidade.trim() || null,
        sexo: formData.sexo || null,
        dataNascimento: new Date(formData.dataNascimento).toISOString(),
      };
      
      console.log('Sending POST request with data:', createData);
      
      dispatch(createUser(createData))
        .unwrap()
        .then(() => {
          console.log('User created successfully');
          navigate('/users');
        })
        .catch((error) => {
          console.error('Error creating user:', error);
        });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) dispatch(clearError());
  };

  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      if (value.length > 9) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      } else if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
      } else if (value.length > 3) {
        value = value.replace(/(\d{3})(\d{3})/, '$1.$2');
      }
      setFormData(prev => ({ ...prev, cpf: value }));
    }
  };

  if (isEdit && isLoading) return <div>Loading user data...</div>;

  return (
    <div className="user-form">
      <h2>{isEdit ? 'Edit User' : 'Create New User'}</h2>
      
      {error && (
        <div className="error-message">
          Error: {typeof error === 'string' ? error : JSON.stringify(error)}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name: *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            maxLength="100"
          />
        </div>
        
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            maxLength="100"
          />
        </div>
        
        <div className="form-group">
          <label>Password: {!isEdit && '*'}</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={!isEdit}
            placeholder={isEdit ? "Leave blank to keep current password" : ""}
            minLength="6"
          />
          {isEdit && (
            <small className="help-text">Leave blank to keep current password</small>
          )}
        </div>
        
        <div className="form-group">
          <label>CPF: *</label>
          <input
            type="text"
            name="cpf"
            value={formData.cpf}
            onChange={handleCpfChange}
            required
            placeholder="000.000.000-00"
            maxLength="14"
          />
        </div>
        
        <div className="form-group">
          <label>Nationality:</label>
          <input
            type="text"
            name="nacionalidade"
            value={formData.nacionalidade}
            onChange={handleChange}
            placeholder="e.g., Brazilian"
            maxLength="50"
          />
        </div>
        
        <div className="form-group">
          <label>Birthplace:</label>
          <input
            type="text"
            name="naturalidade"
            value={formData.naturalidade}
            onChange={handleChange}
            placeholder="e.g., São Paulo"
            maxLength="50"
          />
        </div>
        
        <div className="form-group">
          <label>Gender:</label>
          <select
            name="sexo"
            value={formData.sexo}
            onChange={handleChange}
          >
            <option value="">Select gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Birth Date: *</label>
          <input
            type="date"
            name="dataNascimento"
            value={formData.dataNascimento}
            onChange={handleChange}
            required
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : (isEdit ? 'Update User' : 'Create User')}
          </button>
          <button type="button" onClick={() => navigate('/users')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;