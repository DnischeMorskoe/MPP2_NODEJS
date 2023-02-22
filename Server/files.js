const fs = require("fs-extra");

module.exports.upload= function(req, res){
    if (!fs.existsSync('./files/' + req.body.id)) {
		fs.mkdirSync('./files/' + req.body.id, {recursive: true});
    }

	fs.rename(req.file.path,'./files/' + req.body.id + '/' + req.file.originalname, function(err) {
		if (err) throw err;

		if (fs.existsSync(req.file.path)) {
			fs.remove(req.file.path, err => {
				if (err) return console.error(err);
		});
		}
	});

	res.redirect('back');
}


module.exports.deleteFile = function(req, res) {
	if(!req.body) return res.sendStatus(400);
	let file = './files/' + req.body.fileName;
	console.log(file);
	if (fs.existsSync(file)) {
		fs.remove(file, err => {
			if (err) return console.error(err);
			console.log("deleted" + file);
		});
	}
	res.redirect('back');
}


module.exports.downloadFile = function(req, res) {
	if(!req.body) return res.sendStatus(400);
	let file ='./files/' + req.body.fileName;

	if (fs.existsSync(file)) {
		console.log("download" + file);
		res.download(file);
	}
}


