const express = require('express');
const fs = require('fs');
const https = require('https');

const bodyParser = require('body-parser');
const multer = require('multer')

const app = express();
const upload = multer({dest: './tmp'});

app.use(express.static('www'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json({type: "application/json"}));

function respond(res, data) {
    console.log(data);
    res.end(JSON.stringify(data));
}

fs.mkdir('./www/user_files', {recursive:true}, (err) => {
    if (err) console.log( err );
});

app.post('/log', (req,res) => {
    respond(res, {message: req.body.entry});   
});

app.get('/process', (req, res) => {
    respond(res, {
        first_name: req.query.first_name,
        last_name: req.query.last_name
    });
});

app.post('/process', (req, res) => {
    respond(res, {
        first_name: req.body.first_name,
        last_name: req.body.last_name
    });
});

app.post('/upload', upload.single('file'), (req, res) => {
    if (req.file) {
        const fn = `/www/user_files/${req.file.filename}.${req.file.originalname.split('\.')[1]}`;
        fs.readFile( req.file.path, (err, data) => {
            fs.writeFile(`.${fn}`, data, (err) => {
                if (err) {
                    respond(res, {
                        error: true, 
                        message: "upload failed"
                    });
                }
                else {
                    respond(res, {
                        error: false,
                        message: "file uploaded successfully", 
                        filename: fn.replace("/www", "")
                    });
                }
                fs.rm(req.file.path, (err) => {
                    console.log(err || `uploaded ${fn}`);
                })
            });
        });
    }
    else {
        respond(res, {message: "no file detected"});
    }
});

const server = app.listen(8080, () => {
    const addr = server.address();
    console.log("App running on %s:%s", addr.address, addr.port);
});