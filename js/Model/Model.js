class Model{
    constructor(){
        this.connect();
    }
    updateFirebase(msg,key){//Método que sabe realizar atualação no DB
        let json={}
        if(msg){
         json.msg=msg
         this.getFireBaseRef().child(key).set(json)
        }
     }
    deleteFirebase(key){//Método que sabe excluir
        this.getFireBaseRef().child(key).remove()
    }
    getFireBaseRef(reff="list"){
        return firebase.database().ref(reff)
    }
    createFirebase(json){//Método que cria
        this.getFireBaseRef().push().set(json)
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