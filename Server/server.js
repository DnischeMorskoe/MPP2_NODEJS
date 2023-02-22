const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');

const fs = require("fs-extra")
const multer  = require("multer");




const patients_code = require('./patients_code.js');
const date_helper = require("./date_helper.js")
const files = require("./files.js")

const server = express();
patients_code.initializePatientsFile();

server.use(cors());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.patch('/api/healthy/patient', patients_code.healthy);
server.delete('/api/delete/patient', patients_code.deletePatient);
server.put('/api/update/patient', patients_code.updatePatient);
server.post('/api/add/patient', patients_code.addPatient);

server.get('/api/patient/all', patients_code.getAllPatients);
server.get('/api/patient', patients_code.getPatient);

server.listen(8000);