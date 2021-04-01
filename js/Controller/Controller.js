class Controller{
    constructor(){
        this._model;

    }
    initial(){
        this.model= new Model()
    }
    get model(){return this._model}
    set model(value){this._model=value}
    
}