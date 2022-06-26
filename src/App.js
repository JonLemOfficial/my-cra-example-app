import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotificationContainer, AuthVerifier, Redirecter } from './components'
import { useAuth } from './hooks';
import {
  HomePage,
  LoginPage,
  RegisterPage,
  Error404Page,
  ChatPage,
  SettingsPage
} from './screens';

const App = () => {

  
  

  return (
    <Router basename="/">
      <NotificationContainer/>
      <Routes>
        
        <Route element={<Redirecter/>}>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
        </Route>
        
        {/* Protected Routes (allowed only for authenticated users) */}
        <Route element={<AuthVerifier/>}>
          <Route path="/chat" element={<ChatPage/>}/>
          <Route path="/settings" element={<SettingsPage/>}/>
        </Route>
        
        {/* Error pages */}
        <Route path="*" element={<Error404Page/>}/>
      </Routes>

    </Router>
  );
};

export default App;
