import React from 'react'
import Axios from 'axios'
import { Link } from 'react-router-dom'
import Loading from './Loading'
// import { Select } from 'materialize-css'
 import Select from 'react-select'

 const options = [
    { value: 'Все', label: 'Все' },
    { value: 'Грызун', label: 'Грызуны' },
    { value: 'Пернатое', label: 'Пернатые'},
    { value: 'Кот', label: 'Кошки/коты'},
    { value: 'Собака', label: 'Собаки'},
    { value: 'Другое', label: 'Другое'},
        ]  

    function DiffAnim(patients){
            let diffAnim = [];
        for(var i = 0; i < patients.length; i++) {
            if((patients[i].pet_type != "Кот") && (patients[i].pet_type != "Собака") 
            && (patients[i].pet_type != "Грызун") && (patients[i].pet_type != "Пернатое")
             && (patients[i].pet_type != "Кошка")) {
                diffAnim.push(patients[i]);
            }
        }
        return diffAnim;
        }

class Patients extends React.Component {



    state = {
        patients: null,
        displayedPatients: null
    }

   

    handleCompleteCheckbox = (e) => {
        Axios.patch(`http://localhost:8000/api/healthy/patient?id=${ e.target.id }`, { status: e.target.checked })
            .then(res => 
                    this.setState({
                        patients: res.data })
                )
    }

    

    handleSelectChange =  (e) => {
       
        switch (e.value) {
            case 'Все':
                this.setState({
                    displayedPatients: this.state.patients
                })
                break;
            case 'Грызун':
            case 'Пернатое':
            case 'Кот':
            case 'Собака':
                this.setState({
                    displayedPatients: this.state.patients.filter(patient => patient.pet_type == e.value)
                })    
                
                break;
             case 'Другое':
                    this.setState({
                        displayedPatients: DiffAnim(this.state.patients)
                    })
                    
                    break;
            default:
                this.setState({
                    displayedPatients: [...this.state.patients]
                })
                
                break;
        }
        
    }

    createPatients() {
        return (
            this.state.displayedPatients.map(patient => { return (
                <div className="card hoverable" key={ patient.id }>                        
                    <div className="changeCursor card-content" onClick={ () => this.props.history.push('details/' + patient.id) }>
                        <span className="card-title center">{ patient.pet_type} {patient.name}</span>
                       
                    </div>
                    <div className="card-action row ">
                    <div className='col s6 '>
                    <p> <b>Лечащий врач:</b>  { patient.doctor_name }</p>
                    </div>
                    <div className='col  a1 '>
                    <p> <b> Диагноз: </b> { patient.diagnosis }</p>
                    </div>
                    </div>
                    <div className="card-action row valign-wrapper">
                        <div className="col s3 left-align">
                            <form>     
                                <label>
                                    <input id={patient.id} type="checkbox" defaultChecked={patient.healthy} className="complete-checkbox" onClick={ this.handleCompleteCheckbox }/>
                                    <span>Здоров</span>
                                </label>
                            </form>
                        </div>

                        <div className="col s6 center-align">
                            <p> <b>Дата приема:</b> { patient.date }</p>
                        </div>

                        <div className="col s3 right-align">
                            <Link to={ '/edit/' + patient.id } className="btn amber darken-1">
                                <i className="material-icons">edit</i>
                            </Link>
                        </div>
                    </div>
                </div>
            )})
        )
    }


    createAdditionalElements() {
        return (
            <div className="additionals">
                
                <div className="input-field col ">
                <Select className="aaaa1" defaultValue={ options[0]} onChange={ this.handleSelectChange } options={options} />
                </div>
                
                    <hr></hr>
                    <div className="action-btn ">
                        <Link to= {"/add/-1"} className="btn amber darken-1 "> 
                        Добавить пациента 
                        </Link>
                                         
                    </div>
                <hr></hr>
            </div>
        )
    }

   

    render() {
        let content = null;

        if (this.state.patients === null) { 
            content = <Loading />;
           
        } else if (this.state.patients === []) {
            content = <h2>Пока нет ни одного пациента!</h2>;
       
        } else {
           
            content = (

                <div>
                 
                 { this.createAdditionalElements() }
                    { this.createPatients() }
             </div>
            )
        }

        return (
            <div className="patients container">
                { content }
            </div>
        )
    }
    
    componentDidMount() {
        Axios.get('http://localhost:8000/api/patient/all')
            .then(res => {
                 
                    this.setState({
                        patients: res.data,
                        displayedPatients: res.data }) 
                    })
    }
}

export default Patients