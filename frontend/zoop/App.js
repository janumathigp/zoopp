
import React from 'react';
import { UserProvider } from './context/UserContext';
import AppNavigator from './components/Navigation';

const App = () => (
    <UserProvider>
        <AppNavigator />
    </UserProvider>
);

export default App;
