class Model{
    constructor(){
        this.connect();
    }
    updateFirebase(nameFolder,msg,key){//Método que sabe realizar atualação no DB
        let json={}
        if(msg){
         typeof msg == "object"?json=Object.assign(json,msg):json.msg=msg
         this.getFireBaseRef(nameFolder).child(key).set(json)
        }
     }
    deleteFirebase(nameFolder,key){//Método que sabe excluir
        return this.getFireBaseRef(nameFolder).child(key).remove()
    }
    getFireBaseRef(reff="list"){
        return firebase.database().ref(reff)
    }
    createFirebase(ref,json){//Método que cria
        this.getFireBaseRef(ref).push().set(json)
    }
    connect(){//Método que realiza a conexão no DB
        var firebaseConfig = {
            apiKey: "AIzaSyBO5lyXGawbr2sLZuhWiXnhhztq8fsWwxg",
            authDomain: "list-of-projects-cbf72.firebaseapp.com",
            databaseURL: "https://list-of-projects-cbf72-default-rtdb.firebaseio.com",
            projectId: "list-of-projects-cbf72",
            storageBucket: "list-of-projects-cbf72.appspot.com",
            messagingSenderId: "557716302386",
            appId: "1:557716302386:web:a46f9ab2d5fdafafe62a2b",
            measurementId: "G-WQPBTF584F"
        };
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();
    }
}