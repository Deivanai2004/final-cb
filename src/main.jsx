import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Home from './Home.jsx'
import Template from './Template.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './index.css'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import InvoicePopup from './Invoices.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App/>} />
          <Route path='/home' element={<Home/>} />
          <Route path='/home/invoices' element={<InvoicePopup/>} />
          <Route path='/invoice1' element={<Template/>}/>
        </Routes>
      </BrowserRouter>
  </React.StrictMode>,
)
