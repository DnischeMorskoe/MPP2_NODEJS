import React from 'react';
import Axios from 'axios';
import Loading from './Loading';


class PatientDetails extends React.Component {
    state = {
        patient: null
    }

    handleHealthyCheckbox = (e) => {
        Axios.patch(`http://localhost:3001/api/healthy/patient?id=${ e.target.id }`, { status: e.target.checked })
            .then(response => 
                    this.setState({
                        patients: response.data 
                    })
                )
    }

    handleDelete = (e) => {
        Axios.delete(`http://localhost:3001/api/delete/patient?id=${ this.state.patient.id }`)
            .then(response => 
                    this.props.history.push('/')
                )
    }

    componentDidMount() {
        const id = this.props.match.params.patient_id;
        Axios.get(`http://localhost:3001/api/patient?id=${ id }`)
            .then(response => this.setState({
                patient: response.data
            }))
    }

    render() {
        const content = this.state.patient ? (
           
           <div className="patient card">
                   <div className="card-content">
                   <h2>Карточка пациента</h2> <hr/>
                   
                       <span className="card-title center"> <h1>{this.state.patient.patient.pet_type} {this.state.patient.patient.name}</h1></span>
                       
                   </div>
                   <div className="card-action row valign-wrapper">
                    <div className='col' >

                        
                    </div>
                    <div className='col' >
                    <pre>{this.state.patient.notes}</pre>
                    </div>
                       <div className="col s4 left-align">
                           <form>
                               <label>
                                   <input type="checkbox" id={this.state.patient.id} onClick={this.handleCompleteCheckbox} defaultChecked={this.state.patient.complete} className="complete-checkbox" />
                                   <span>Complete</span>
                               </label>
                           </form>
                       </div>

                       <div className="col s4 center-align">
                           <p>{this.state.patient.date}</p>
                       </div>
                       <div className="col s4 right-align">
                           <button className="btn red darken-3 " onClick={this.handleDelete}>
                               <i className="material-icons right">delete</i>
                               Delete
                           </button>
                       </div>
                   </div>
               </div>) : (<Loading />);

        return (
            <div className="container">
                { content }
            </div>
        )
    }
}

export default PatientDetails