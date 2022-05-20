
const express = require('express');
const app = express();

app.disable('x-powered-by');

app.use(express.urlencoded({
	extended: true
}));

app.use('/api/fontmin', require('./api/fontmin.js'));

app.listen(8003,_=>{
	console.log(`http://192.168.31.7:8003`,_)
})