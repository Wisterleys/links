class Storage{
    constructor(){

    }
    deleteStorage(json){
        return new Promise((resolve,reject)=>{
            firebase.storage().ref("/files").child(json.nameFile).delete()
            .then(res=>{
                resolve({res,key:json.key})
            })
            .catch(erro=>{reject([erro,json])})
            })
    }
    uploadTask(files){
        let promises=[];
        [...files].forEach(file => {
            promises.push(new Promise((resolve,reject)=>{
                let filename_part = file.name.split(".");
                let filename = filename_part[0]+"-"+Date.now()+"."+filename_part[1]
                let fileRef = firebase.storage().ref("/files").child(filename)
                let task = fileRef.put(file)
                task.on("state_changed",snapshot=>{
                    /* document.querySelector("#progress").hidden=false
                    document.querySelector("#progress div").style.width=`${this.returnsPercent(snapshot._delegate.bytesTransferred,snapshot._delegate.totalBytes)}%` */
                },erro=>{
                    reject(erro)
                },()=>{
                    task.snapshot.ref.getDownloadURL().then(downloadURL=>{
                        task.snapshot.ref.updateMetadata({ customMetadata: { downloadURL }}).then(metadata=>{
                         resolve(metadata)
                       }).catch( error => {
                         console.error( 'Error update metadata:', error)
                         reject( error ) 
                       })
                    })
                })
            }))
        });
        return Promise.all(promises)
    }
}