import React from 'react';
import Axios from 'axios';
import Loading from './Loading'
import $ from "jquery";
import M from "materialize-css";
import DatePicker from "react-datepicker";
import Select from 'react-select'

import "react-datepicker/dist/react-datepicker.css";


const options = [
    { value: 'Грызун', label: 'Грызун' },
    { value: 'Пернатое', label: 'Пернатое'},
    { value: 'Кот', label: 'Кот'},
    { value: 'Собака', label: 'Собака'},
    { value: 'Другое', label: 'Другое'},
        ] 

  let changed = false;      

class PatientEdit extends React.Component {
    
    constructor(props) {
        super(props);
        this.selectRef = React.createRef();
    }

    state = {
            id: null,
            pet_type: '',
            name: '',
             doctor_name: '',
             diagnosis: '',
             notes: '',
             date: '',
             healthy: false
        };


        handleSelectChange =  (e) => {
            changed = true;
            var o=$('#i1');
            switch (e.value) {
                case 'Грызун':
                case 'Пернатое':
                case 'Кот':
                case 'Собака':
                    o.hide(); 
                    this.setState(
                        {pet_type : e.value}                       
                    )                    
                    break;
                 case 'Другое':
                    this.setState(
                        {pet_type : ""}                       
                    ) 
                    o.show();      
                        break;
                default:
                    this.setState({
                        pet_type : e.value
                    })
                    
                    break;
            } 
        }

        isHidden(){ 
            var o=$('#i1');
            if ((this.selectRef.value ==='Другое') ) {
            o.show();
            } else {
            o.hide();
             }; 
        }
    

    componentDidMount() {
        this.isHidden(); 
        const id = this.props.match.params.patient_id;
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
                            date: response.data.date,
                            healthy: response.data.healthy
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
                     date: null,
                     healthy: false
                }
            })
        }          

    }

    handleSave = e => {
        
        if (changed === false ) {
            this.state.pet_type = 'Грызун'
        }
        let patient = {
             id: this.state.id,
             pet_type: this.state.pet_type,
             name: this.state.name,
             doctor_name: this.state.doctor_name,
             diagnosis: this.state.diagnosis,
             notes: this.state.notes,
             date: this.state.date,
             healthy: this.state.healthy
        };

       
            console.log(patient);
        if (patient.id === null) {
            
            Axios.post('http://localhost:8000/api/add/patient', {patient: patient})
                .then( response =>
                    this.props.history.push('/details/' + response.data.id)
                );
        } else {
            //Axios.put(`http://localhost:8000/api/update/patient?id=${ patient.id }`, { patient: patient })
            Axios.put(`http://localhost:8000/api/update/patient?id=${patient.id}`, { patient: patient })
                .then( response =>
                    this.props.history.push('/details/' + patient.id)
                );
        }
    }


    handleDateChange = e => {
        let date = new Date(e).toLocaleDateString('en-EN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });      
        this.setState({ date: date });
    };

    handlePetTypeChange = e => {
        let pet_type = e.target.value;    
        this.setState({ pet_type: pet_type }); 
    };

    handleNameChange = e => {
        let name = e.target.value;    
        this.setState({ name: name });
    }

    handleDocNameChange = e => {
        let doctor_name = e.target.value;    
        this.setState({ doctor_name: doctor_name });
    }

    handleDiagnosisChange = e => {
        let diagnosis = e.target.value;    
        this.setState({ diagnosis: diagnosis });
    }

    handleContentChange = e => {
        let notes = e.target.value;       
        this.setState({ notes: notes });    
    };

    handleHealthyClick = e => {
        let healthy = null;
        if (e.target.checked) {
            healthy = true;
        } else {
            healthy = false;
        }
        this.setState({healthy: healthy});
    }

    render() {
        const { pet_type,notes,date,name,doctor_name,diagnosis} = this.state;
       
        const displayedCard = this.state.patient !== null ? (
        <div  className="myDiv1">         
             <div>
               <br></br>
                <div  className="myDiv2">
                <div>
                 <label htmlFor="i1" className="active">Вид животного:</label>   
                    <Select ref={this.selectRef} className="aaaa1" defaultValue={ options[0]} onChange={ this.handleSelectChange } options={options} /> 
                     <input className="validate"  type="text" id="i1" name="diff" value={pet_type} onChange={ this.handlePetTypeChange } /> 
                     
                </div>
                     <br></br>
                <div>
                <label htmlFor="name" className="active">Кличка:</label>
                    <input className="validate" type="text" id="name" value={name} onChange={ this.handleNameChange } />
                    
                </div>
    
                <div>
                <label htmlFor="doctor_name" className="active">Лечащий врач:</label>
                    <input className="validate" type="text" id="doctor_name" value={doctor_name} onChange={ this.handleDocNameChange } />
                    
                </div>
                  
                <div>
                <label htmlFor="diagnosis" className="active">Диагноз:</label>
                    <input className="validate"  id="diagnosis" type="text" value={diagnosis} onChange={ this.handleDiagnosisChange } />
                    
                </div>
    
                <br></br>
                <div>
                <label for="notes">Рекомендации врача:</label>
                    <textarea className="form-control"  id="notes" onChange={ this.handleContentChange } value = {notes} />
                    
                </div>
                <br></br>
    
                <label htmlFor="date" className="active validate">Дата приема:</label>
                <DatePicker 
                            selected={ date !== '' ? new Date(date) : new Date() } 
                                onChange={this.handleDateChange} 
                                dateFormat="MMMM dd, yyyy"
                                className="datePicker" 
                            />
                
    
                     <br></br>
                     <div className="card-action row valign-wrapper">
                    <div className="col s4 left-align">
                        <button className="btn amber darken-1" onClick={ this.handleSave }>
                            ОК
                        </button>
                    </div>
                    <form className="right-align col s8">     
                        <label>
                            <input type="checkbox" checked={this.state.healthy === true } onChange={ this.handleHealthyClick } className="complete-checkbox"/>
                            <span>Здоров</span>
                        </label>
                    </form>
                </div>
                </div>
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