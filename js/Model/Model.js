class Model{
    constructor(){
        this.connect();
    }
    updateFirebase(json,name){
        if(name){
         json.name=name
         this.getFireBaseRef().child(json.key).set(json)
        }
     }
    deleteFirebase(key){
        this.getFireBaseRef().child(key).remove()
    }
    getFireBaseRef(reff="list"){
        return firebase.database().ref(reff)
    }
    createFirebase(json){
        this.getFireBaseRef().push().set(json)
    }
    connect(){
        // Your web app's Firebase configuration
        // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();
    }
}