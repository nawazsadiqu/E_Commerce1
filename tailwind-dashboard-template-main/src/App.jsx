import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import Waterbased from './components/Waterbased';
import Createwater from './components/Createwater';
import Customers from './components/Customers';
import Allorders from './components/orderrs/Allorders';
import Pendingorders from './components/orderrs/Pendingorders';
import Progressorders from './Progressorders';
import Outorders from './components/orderrs/Outorders';
import Deliveredorder from './components/orderrs/Deliveredorder';
import Cancelledorders from './components/orderrs/Cancelledorders';
import Alldeliveries from './components/dellivverry/Alldeliveries';
import Assigneddeliveries from './components/dellivverry/Assigneddeliveries';
import Scheduleddeliveries from './components/dellivverry/Scheduleddeliveries';
import Completeddeliveries from './components/dellivverry/Completeddeliveries';
import Faileddeliveries from './components/dellivverry/Faileddeliveries';
import Perfomance from './components/dellivverry/Perfomance';
import EditProduct from './components/EditProduct';
import Category from './components/Category';
import Createcategory from './components/Createcategory';

function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route path="/water" element={<Waterbased />} />
          <Route path="/waterform" element={<Createwater/>} />
          <Route path="/editProduct/:id" element={<EditProduct />} />
          <Route path="/category" element={<Category />} />
          <Route path="/categoryform" element={<Createcategory />} />
          <Route path="customers" element={<Customers/>} />
          <Route path="allorders" element={<Allorders/>} />
          <Route path="pendingorders" element={<Pendingorders/>} />
          <Route path="progressorders" element={<Progressorders/>} />
          <Route path="outorders" element={<Outorders/>} />
          <Route path="deliveredorders" element={<Deliveredorder/>} />
          <Route path="cancelledorders" element={<Cancelledorders/>} />
          <Route path="alldeliveries" element={<Alldeliveries/>} />
          <Route path="assigneddeliveries" element={<Assigneddeliveries/>} />
          <Route path="scheduleddeliveries" element={<Scheduleddeliveries/>} />
          <Route path="completeddeliveries" element={<Completeddeliveries/>} />
          <Route path="faileddeliveries" element={<Faileddeliveries/>} />
          <Route path="perfomance" element={<Perfomance/>} />

          


        </Route>
        <Route exact path="/water" element={<Waterbased/>} />
      </Routes>
    </>
  );
}

export default App;
