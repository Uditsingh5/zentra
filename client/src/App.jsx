import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Layout from './components/Layout/Layout.jsx';
import Postcard from "./components/PostCard.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
};

export default App;