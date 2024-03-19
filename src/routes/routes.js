import React from 'react';
import {HashRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {TreePage} from '../screens/tree/treePage';

const RouteManager = () => {
  return (
    <Router basename='/'>
      <Routes>
        {/* Redirect index.html to home path*/}
        <Route path="index.html" element={<Navigate to={"/"}/>} />
        <Route path="" element={<TreePage/>}/>
      </Routes>
    </Router>
  );
};

export default RouteManager;