import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Main from './Main';
import Chat from './Chat';
import NotFound from './NotFound';


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/"  element={ <Main/> }/>
            <Route path="/chat"  element={ <Chat/> }/>
            <Route path="/*" element={<NotFound/>}/>
        </Routes>
    );
};

export default AppRoutes;