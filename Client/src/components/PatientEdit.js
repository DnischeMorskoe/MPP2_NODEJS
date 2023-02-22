import React from 'react';
import Axios from 'axios';
import Loading from './Loading'
import $ from "jquery";
import M from "materialize-css";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

class PatientEdit extends React.Component {
    state = {
            id: null,
            pet_type: '',
            name: '',
             doctor_name: '',
             diagnosis: '',
             notes: '',
             date: ''
        };
    

    componentDidMount() {
        const id = this.props.match.params.patient_id;
        console.log(id);
        if (id !== '-1') {
            Axios.get(`http://localhost:8000/api/patient?id=${ id }`)
                    .then(response => { 
                        this.setState({           
                            id: response.data.id,
                            pet_type : response.data.pet_type,
                            name : response.data.name,
                            doctor_name : response.data.doctor_name,
                            diagnosis : response.data.diagnosis,
                            notes : response.data.notes,
                            date: response.data.date
                        });
                        M.textareaAutoResize($('#body_text'));
                        M.updateTextFields();
                    })
        } else {
            this.setState({
                patient: { 
                    pet_type: '',
                    name: '',
                     doctor_name: '',
                     diagnosis: '',
                     notes: '',
                     date: null
                }
            })
        }          

    }

    handleSave = e => {
        let patient = {
            id: this.state.id,
            pet_type: this.state.pet_type,
            name: this.state.name,
             doctor_name: this.state.doctor_name,
             diagnosis: this.state.diagnosis,
             notes: this.state.notes,
            date: this.state.date
        };

        console.log(patient.id);

        if (patient.id === null) {
            Axios.post('http://localhost:8000/api/add/patient', { patient: patient })
                .then( response =>
                    this.props.history.push('/details/' + response.data.id)
                );
        } else {
            Axios.put(`http://localhost:8000/api/update/patient?id=${ patient.id }`, { patient: patient })
                .then( response =>
                    this.props.history.push('/details/' + patient.id)
                );
        }
    }

    handleTimlessClick = e => {
        let date = null;
        if (e.target.checked) {
            date = '';
        } else {
            date = new Date().toLocaleDateString('en-EN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
        }
        this.setState({date: date});
    }

    handleDateChange = e => {
        let date = new Date(e).toLocaleDateString('en-EN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });      
        this.setState({ date: date });
    };

    handleTitleChange = e => {
        let pet_type = e.target.value;    
        this.setState({ pet_type: pet_type });
    };

    handleContentChange = e => {
        let notes = e.target.value;       
        this.setState({ notes: notes });    
    };

    render() {
        const { pet_type,name,doctor_name,diagnosis,notes,date } = this.state;
        const displayedCard = this.state.patient !== null ? (
            <div className="patient card">
                <div className="card-content">
                    <form>
                        <div className="input-field">
                            <i className="material-icons prefix">text_format</i>
                            <input id="title" type="text" className="validate" value={ pet_type } onChange={ this.handleTitleChange }/>
                            <label htmlFor="title" className="active">Note's Title</label>
                        </div>

                        <div className="input-field">
                            <i className="material-icons prefix">mode_edit</i>
                            <textarea id="body_text" className="materialize-textarea" value={ notes } onChange={ this.handleContentChange }/>
                            <label htmlFor="body_text" className="active">Note's content</label>
                        </div>
                        
                        <div className={date === '' ? 'input-field hide' : 'input-field'}>
                            <i className="material-icons prefix">date_range</i>
                            <label htmlFor="date" className="active">Note's date</label>
                            <DatePicker 
                                selected={ date !== '' ? new Date(date) : new Date() } 
                                onChange={this.handleDateChange} 
                                dateFormat="MMMM dd, yyyy"
                                className="datePicker" 
                            />
                        </div>
                    </form>
                </div>

                <div className="card-action row valign-wrapper">
                    <div className="col s4 left-align">
                        <button className="btn red darken-3" onClick={ this.handleSave }>
                            <i className="material-icons left">save</i>
                            Save
                        </button>
                    </div>
                    <form className="right-align col s8">     
                        <label>
                            <input type="checkbox" checked={ this.state.date === '' } onChange={ this.handleTimlessClick } className="complete-checkbox"/>
                            <span>Timeless</span>
                        </label>
                    </form>
                </div>
            </div>
        ) : (
            <Loading />
        )
       
        return (
            <div className="container">
                { displayedCard }
            </div>
        )
    }
}

export default PatientEdit