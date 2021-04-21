const File = require('./file')
const iniqueID = require('../utils/helpers')

class Task{
	
	/*
	
		ДОБАВИТЬ ВАЛИДАЦИЮ ПОЛЕЙ	
	
	*/
	constructor(id = '', data){
		this.file = new File('tasks')	
		this._data = {
			completed: false,
			...data,
			id: id || iniqueID(),
		}	
	}
	
	read(){
		return this.file.read()
	}
	
	getById(id){
		return this.file.readOne(id)
	}
	
	update(){
		const timestamp = new Date().getTime()	 		
		const data = {
			...this._data,
			updated_at: timestamp
		}
		return this.file.update(this._data.id,data)
	}
	
	add(){
		const timestamp = new Date().getTime()	 		
		const data = {
			...this._data,
			created_at: timestamp,
			updated_at: timestamp
		}
		return this.file.add(data)
	}
	
	remove(){ 		
		return this.file.remove(this._data.id)
	}

}

module.exports = Task