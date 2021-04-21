// /home/webexper/node.webexp.site/public
const express = require('express')
const cors = require('cors')
const chalk = require('chalk')
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const Task = require('./models/task')

const app = express()
app.use(express.static(__dirname));
const port = process.env.PORT || 3000


app.use(express.json())
app.use(cors())

app.get('/', async (req, res) => {
	res.status(403).send('mock server')	
})

/*

	TASKS

*/

app.get('/tasks', async (req, res) => {
	try{
		const task = new Task()
		const tasks = await task.read()
		return res.send(tasks)	
	}catch(e){
		return res.status(500).send({error: e})	
	}
})

app.get('/task/:id', async (req, res) => {
	try{
		const task = new Task()
		const _task = await task.getById(req.params.id)
		if(!_task){
			res.status(404).send()	
		}
		res.send(_task)
	}catch(e){
		res.status(500).send({error: e})	
	}
})


app.post('/tasks', async (req, res) => {
	try{
		const task = new Task('',req.body)
		const added = await task.add()
		res.status(201).send(added)		
	}catch(e){
		res.status(500).send({error: e})	
	}

})

app.patch('/tasks/:id', async (req, res) => {
	try{
		const task = new Task(req.params.id, req.body)		
		const updated = await task.update()
		if(!updated){
			res.status(404).send()	
		}
		res.send(updated)		
	}catch(e){
		res.status(500).send({error: e})	
	}

})

app.delete('/tasks/:id', async (req, res) => {
	try{
		const task = new Task(req.params.id)
		const deleted = await task.remove()
		if(!deleted){
			res.status(404).send()	
		}
		res.send(deleted)		
	}catch(e){
		res.status(500).send({error: e})	
	}

})


/*

	AUTHENTICATION

*/
app.post('/api/auth/login', async (req, res) => {
	try{
		const {login, password} = req.body
		if(
			login === 'test' 
			&& 
			password === 'test'
		){
			setTimeout(()=>{
				res.status(200).send({
					user: {
						id: 1,
						firstName: 'Test',
						lastName: 'Test'
					},
					token: 'jwt-token'
				})	
			},1000)
		}else{
			res.status(401).send({error: 'Unauthorized'})	
		}
	}catch(e){
		res.status(500).send({error: e.message})	
	}
})

app.post('/api/auth/logout', async (req, res) => {
	try{
		const authHeader = req.headers.authorization ? req.headers.authorization.toLowerCase() : ''
		const token = authHeader.substring(7, authHeader.length);
		if(token === 'jwt-token'){
			res.status(200).send({
				message: 'You are logged out'
			})		
		}else{
			res.status(401).send({error: 'Unauthorized'})	
		}		
	}catch(e){
		res.status(500).send({error: e})	
	}

})


/*

	AUTHENTICATION EXTERNAL 

*/
app.post('/api/auth/google', async (req, res) => {
	const ticket = await client.verifyIdToken({
		idToken: req.token,
		audience: process.env.GOOGLE_CLIENT_ID,
	})
	const payload = tocket.getPayload()

	const {sub, email, name} = payload
	const userId = sub
	res.send({userid, email, name})
})




/*

	FILES UPLOADS

*/
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "uploads");
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
});

// !!! cover_index поле name input=file 
app.post("/upload", multer({storage:storageConfig}).single("cover_index"), function (req, res, next) {
   
    let filedata = req.file;

    if(!filedata)
        res.send("Ошибка при загрузке файла");
    else
        res.send("Файл загружен");
});

app.listen(port, ()=>{
    console.log('Server is up on port 3000')
})
