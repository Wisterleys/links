class Controller{
    constructor(){
        this._model;
        this.initial()
        this.realTime()
        this.onImp()
    }
    initial(){
        this.model= new Model()
        this.listener()
    }
    listener(){
        this.onP()
        this.blurP()
        this.onDelete()
    }
    onImp(){
        $(".btnAdd")[0].on("click",e=>{
            this.imp("add...")
        })
    }
    imp(value=false){
        let li = this.createTags({place:$('.ulsImp')[0],tag:"li",class:"lisImp"})
        let ul = this.createTags({place:li,tag:"ul",class:"menu"})
        let lii = this.createTags({place:ul,tag:"li",class:"menuEdit"})
        this.createTags({
            place:lii,tag:"input",class:"btnEdit",alt:"edite",type:"image",src:"img/edit-small.png"
        })
        lii=this.createTags({place:ul,tag:"li",class:"menuEdit"})
        this.createTags({
            place:lii,tag:"input",class:"btnDel",alt:"delete",type:"image",src:"img/delete.png"
        })
        this.createTags({place:li,tag:"p",insertTag:value?value:"Digite o nome do projeto..."})
        
        this.listener()
    }
    blurP(){//Escuta todos os P que tem no DOM e ativado quando perde o foco
        $("p").forEach(el=> {
            el.on("blur",e=>{
                e.target.contentEditable=false
                console.log(e.target)
            })
        });
    }
    onDelete(){
        $(".btnDel").forEach(el=> {
            el.on("click",e=>{
                e.target.parentNode.parentNode.parentNode.remove()
            })
        });
    }
    onP(){//Escuta todos os P que tem no DOM e ativado com o click
        $(".btnEdit").forEach(el=> {
            el.on("click",e=>{
                let btn = e.target.parentNode.parentNode.parentNode.$("p")[0]
                btn.contentEditable=true
                btn.focus()
                console.log(e.target.parentNode.parentNode.parentNode.$("p")[0])
              
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