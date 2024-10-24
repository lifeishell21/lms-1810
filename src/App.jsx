// src/App.jsx
import React from 'react';
import AppRoutes from './routes/AppRoutes'; // Import AppRoutes

const App = () => {
    return (
        <div className="app">
            <AppRoutes /> {/* Use the routes here */}
        </div>
    );
};

export default App;
