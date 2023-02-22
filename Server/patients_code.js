const fs = require("fs-extra");
const date_helper = require('./date_helper.js');
const patientsData = "patients.json";


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


module.exports.main = function(req, res) {
	let patients = AllPatients();
	
	res.render("Main_page.hbs", 
	{
		tableVisible: patients.length > 0,
		patients: patients
	});
}


module.exports.new = function(req, res) {
	let patient = {
		id:"",
   		pet_type:"", 
   	 	name:"",
    	doctor_name:"",
    	diagnosis:"",
    	notes: "",
    	date:""
	};

	res.render("new_patient.hbs", 
	{
		patient: patient
	});
}


function RewritePatients(patients) {
	let data = JSON.stringify(patients);
	fs.writeFileSync("patients.json", data);
}

module.exports.add = function(req, res) {
	

	if(!req.body) return res.sendStatus(400);

	let patients = AllPatients();
	let patient = {
		id: 0,//req.body.id,
		pet_type: req.body.pet_typee,
		name: req.body.name,
		 doctor_name: req.body.doctor_name,
		 diagnosis: req.body.diagnosis,
		 notes: req.body.notes,
		 date: req.body.date
	};
	if (patient.pet_type == "Другое") {
		patient.pet_type = req.body.diff;
	}

	if (patient.id == '0') {
		 
	    let maxId = Math.max.apply(Math, patients.map(function(o) {
	    	return o.id;
	    }));

	    if (maxId == Infinity) {
	    	maxId = 0;
	    }

	    patient.id = maxId + 1;
		
	    patients.push(patient);

	    if (!fs.existsSync('./files/' + patient.id)) {
	    	fs.mkdir('./files/' + patient.id, {recursive: true}, (err) => {
	    		if (err) throw err;
	    	});
	    }	    

	} else {
		for (var i = patients.length - 1; i >= 0; i--) {
			if (patients[i].id == patient.id) {
				patients[i].pet_type = patient.pet_type;
				patients[i].name = patient.name;
				patients[i].doctor_name = patient.doctor_name;
				patients[i].diagnosis = patient.diagnosis;
				patients[i].notes = patient.notes;
				patients[i].date = patient.date;
				break;
			}
		}	
	}
	
	RewritePatients(patients);
	res.redirect("/details?id=" + patient.id);
	
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

module.exports.edit = function(req, res) {
	let patient = GetPatient(req.query.id);

	if (patient != null) {
		res.render("new_patient.hbs", {
			patient: patient
		});
	} else {
		res.status(404).send();
	}
}


module.exports.details = function(req, res) {
	let patient = GetPatient(req.query.id);
	let files = [];

	if (fs.existsSync('./files/' + req.query.id)) {
		files = fs.readdirSync('./files/' + req.query.id);
	}
	 
	//console.log(files);

	if (patient != null) {
		res.render("patient.hbs", 
		{
			patient: patient,
			files: files,
			showTable: files.length > 0,
			showDate: patient.date != ''
		});
	} else {
		res.status(404).send();
	}
	//res.redirect("/");
	//res.render("patient.hbs");
}

module.exports.delete = function(req, res) {
    let id = req.query.id;
    let patients = AllPatients();
    let index = -1;

    for(var i = 0; i < patients.length; i++) {
        if(patients[i].id == id){
            index = i;
            break;
        }
    }

    if(index > -1){
        patients.splice(index, 1)[0];
        RewritePatients(patients);

        fs.remove('./files/' + id, err => {
        	if (err) return console.error(err);
        });

        res.redirect("/");
    } else {
        res.status(404).send();
    }
}



module.exports.filter = function(req, res) {
	if(!req.body) return res.sendStatus(400);
   let patients = AllPatients();
   let status = req.body.pet_type;
   let filtredPatients = [];

   if (status == 'Все') {
	filtredPatients = patients;
   } else {
	   if (status != 'Другое') {
		filtredPatients = patients.filter(patient => patient.pet_type == status );
	   } else {
		filtredPatients = DiffAnim(patients);
	   }
   }

 //  console.log(status);
  // console.log(filtredPatients);

   res.render("Main_page.hbs", 
   {
	   tableVisible: filtredPatients.length > 0,
	   patients: filtredPatients
   });
}

function DiffAnim (patients) {
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