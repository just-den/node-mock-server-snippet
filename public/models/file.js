const fs = require('fs')
const fsPromises = require("fs").promises;
const chalk = require('chalk')

class File{
	
	constructor(fileName){
		this.file = './db/' + fileName + '.json'
	}
	
	read(){
		try{			
			const dataBuffer = fs.readFileSync(this.file)
			const dataJSON = dataBuffer.toString()
			return JSON.parse(dataJSON)
		}catch(e){
			return []
		}
	}
	
	readOne(id){
		return this.read().find(task => task.id === id)
	}
	
	update(id,data){
		try{
			let _item
			console.log( 'id : ',id)
			const _data = this.read().map(item => {
				
				if(item.id === id){
					item = {...item,...data}
					_item = {...item}
				}				
				return item
			})
			fs.writeFileSync(this.file,JSON.stringify(_data,null,4))			
			return _item
		}catch(e){
			console.log('e: ',e)
			throw new Error(e)
		}
	}
	
	add(data){	
		try{		
			const _data = this.read()
			_data.push(data)		
			fs.writeFileSync(this.file,JSON.stringify(_data,null,4))
			return data
		}catch(e){
			return e
		}		
	}
	
	remove(id){
		try{
			let _data = this.read()
			let item = _data.find(item => item.id === id)
			if(!item){			
				return
			}				
			_data = _data.filter(item => item.id !== id)
			fs.writeFileSync(this.file,JSON.stringify(_data.filter(item => _data.id !== id),null,4))		
			return item
		}catch(e){
			console.log('e: ',e)
			throw new Error(e)
		}			
	}
	
	// https://medium.com/javascript-in-plain-english/node-js-fs-module-truncating-and-removing-files-2435415015bc
	async reset(){
		return await fsPromises.truncate(this.file, 0)
	}
	
}

module.exports = File