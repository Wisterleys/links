class Controller{
    constructor(){
        this._model;
        this.initial()
        this.realTime()
    }
    initial(){
        this.model= new Model()
        this.onP()
        this.blurP()
    }
    blurP(){//Escuta todos os P que tem no DOM e ativado quando perde o foco
        $("p").forEach(el=> {
            el.on("blur",e=>{
                e.target.contentEditable=false
                console.log(e.target)
            })
        });
    }
    onP(){//Escuta todos os P que tem no DOM e ativado com o click
        $("p").forEach(el=> {
            el.on("dblclick",e=>{
                e.target.contentEditable=true
                e.target.focus()
                console.log(e.target)
            })
        });
    }
    realTime(){
        this.model.getFireBaseRef().on("value",snapshot=>{
            if(snapshot.val()){
                console.log(snapshot.val())
            }
        })
    }
    createTags(obj={}){ 
        /*
        exemplo
        obj={
            place:local,
            tag:nome da tag que deseja criar,
            insertTag: É para inserir uma tag dentro dessa nova tag criada ou só uma mensagem dentro da tag
            tudo que adicionar depois disso é considerado atributo
            a chave é considerada o nome do atributo e o valor é o valor mesmo rsrs
        }
        */
        let tag;
        if(obj.place && obj.tag){
            tag = document.createElement(obj.tag);
            for(let key in obj){
                if(key != "place" && key != "tag" && key != "insertTag"){
                    let att = document.createAttribute(key)
                    att.value=obj[key];
                    tag.setAttributeNode(att)
                }
            }
            obj.insertTag?tag.innerHTML=obj.insertTag:0
            obj.place.appendChild(tag);
        }
        return tag
    }
    get model(){return this._model}
    set model(value){this._model=value}
    
}