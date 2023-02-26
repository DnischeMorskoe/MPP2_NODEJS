import './App.css';
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import Navbar from './components/NavBar.js';
import Patients from './components/Patients.js';
import PatientEdit from './components/PatientEdit.js';
import PatientDetails from './components/PatientDetails.js'

class App extends React.Component {
  render() {
    return (
      <BrowserRouter >
        <div className="App">
          <Navbar />
          <Route exact path='/' component={ Patients }/>
          <Route path='/add/:patient_id' component={ PatientEdit }/>
          <Route path='/edit/:patient_id' component={ PatientEdit } />
          <Route path='/details/:patient_id' component={ PatientDetails }/>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;


// GET - получение от сервера
// POST - отправка на сервер 
// PUT - обновление
// DELETE - удаление