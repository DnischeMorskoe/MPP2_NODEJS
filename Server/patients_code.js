const fs = require("fs-extra");
const date_helper = require('./date_helper.js');
const patientsData = "patients.json";




module.exports.initializePatientsFile = function() {
	fs.createFile(patientsData, function(err) {
		if (err !== undefined && err !== null) {
			console.log('Initalize file error: ' + err); 
		} else {
			let data = fs.readFileSync(patientsData, "utf8");
			if (data.length == 0) {
				fs.writeJson(patientsData, [], function(err) { });
			}
		}
	})
}


function AllPatients() {
	let data = "";
	let patients = [];

	try {
		data = fs.readFileSync(patientsData, "utf8");
	} catch(error) {
		console.error(error);	
	}

	try {
		patients = JSON.parse(data);
	} catch(error) {
		console.error(error);
		fs.writeFileSync(patientsData, '[]');
		patients = [];
	}

	return patients;
}

module.exports.getAllPatients = function(req, res) {
	let patients = AllPatients();
	res.send(patients);
}


module.exports.healthy = function(req, res) {
	if(!req.body || !req.query) return res.sendStatus(400);
	let patients = AllPatients();
	let id = req.query.id;
	let status = req.body.status;

	for (var i = patients.length - 1; i >= 0; i--) {
		if (patients[i].id == id) {
			patients[i].complete = status;
			console.log('HEALTH STATUS CHANGED', patients[i]);
			break;
		}
	}
	
	RewritePatients(patients);
	res.send(patients);
}

function RewritePatients(patients) {
	let data = JSON.stringify(patients);
	fs.writeFileSync("patients.json", data);
}


function GetPatient(patientId) {
	let content = fs.readFileSync(patientsData, "utf8");
	let patients = JSON.parse(content);
	let patient = null;

	for (var i = patients.length - 1; i >= 0; i--) {
		if (patients[i].id == patientId) {
			patient = patients[i];
			break;
		}
	}

	return patient;
}


module.exports.getPatient = function(req, res) {
	if(!req.query) return res.sendStatus(400);
	let patient = GetPatient(req.query.id);

	if (patient != null) {
		res.send(patient);
	} else {
		res.sendStatus(404);
	}
}



module.exports.addPatient = function(req, res) {
	console.log(req.body);
	if(!req.body) return res.sendStatus(400);

	let patients = AllPatients();
	let patient = {
		id: null,
		pet_type: req.body.patient.pet_type,
		name: req.body.patient.name,
		content: req.body.patient.content,
		doctor_name: req.body.patient.doctor_name,
		diagnosis: req.body.patient.diagnosis,
		notes: req.body.patient.notes,
		date: req.body.patient.date,
		healthy: false
	};

	let maxId = Math.max.apply(Math, patients.map(parsePatient => parsePatient.id));

	if (maxId == Infinity || maxId == -Infinity) {
		maxId = 0;
	}

	patient.id = maxId + 1;
	patients.push(patient);
	console.log('ADDED', patient);
	RewritePatients(patients);
	res.send(patient);
}



module.exports.updatePatient = function(req, res) {
	if(!req.body) return res.sendStatus(400);
	let patients = AllPatients();
	
	for (var i = patients.length - 1; i >= 0; i--) {
		
		if (patients[i].id == req.body.patient.id) {		
			patients[i].pet_type = req.body.patient.pet_type;
			patients[i].name = req.body.patient.name;
			patients[i].content = req.body.patient.content;
			patients[i].doctor_name = req.body.patient.doctor_name;
			patients[i].diagnosis = req.body.patient.diagnosis;
			patients[i].notes = req.body.patient.notes;
			patients[i].date = req.body.patient.date;
			console.log('UPDATED', patients[i]);
			break;
		}
	}	
	
	
	RewritePatients(patients);
	res.sendStatus(200);
}



module.exports.deletePatient = function(req, res) {
	if(!req.query) return res.sendStatus(400);
    let id = req.query.id;
    let patients = AllPatients();
    let index = -1;

    for(var i = 0; i < patients.length; i++) {
        if(patients[i].id == id){
			console.log('DELETED', patients[i]);
            index = i;
            break;
        }
    }

    if(index > -1){
        patients.splice(index, 1)[0];
        RewritePatients(patients);

		res.sendStatus(200);
    } else {
        res.status(404).send();
    }
}



