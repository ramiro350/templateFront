import React , { useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Login from './components/Login';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/users" element={
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            } />
            <Route path="/users/new" element={
                <UserForm />

            } />
            <Route path="/users/:id" element={
              <ProtectedRoute>
                <UserForm />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/users" replace />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;