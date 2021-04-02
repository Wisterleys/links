class Controller{
    constructor(){
        this._model;
        this.initial()
        this.realTime()
        this.onImp()
    }
    initial(){//Método que inicia os eventos e intacia a classe Model
        this.model= new Model()
        this.listener()
    }
    listener(){//Método que chama as escutas
        this.onP()
        this.blurP()
        this.onDelete()
    }
    onImp(){//Escuta para criar novo campo na lista
        $(".btnAdd")[0].on("click",e=>{
            this.create()
        })
    }
    create(){//Método que usa o objeto Model para salvar dados no DB
        this.model.createFirebase({msg:"Digite o nome do projeto..."})
    }
    imp(value=false,dataset=false){//Método responsavel para realizar impressão de LI corretamente na tela com as informações
        let li = this.createTags({place:$('.ulsImp')[0],tag:"li",class:"lisImp"})
        dataset?li.dataset.key=dataset:0
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
    }
    blurP(){//Escuta todos os P que tem no DOM e ativado quando perde o foco
        $("p").forEach(el=> {
            el.on("blur",e=>{
                e.target.contentEditable=false
                console.log(e.target)
            })
        });
    }
    onDelete(){//Escuta para o botão deletar
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
    realTime(){//Impressão das informações do DB para tela em tempo real
        this.model.getFireBaseRef().on("value",snapshot=>{
            if(snapshot.val()){
                $('.ulsImp')[0].innerHTML=""
                snapshot.forEach(snapshotItem=>{
                    this.imp(snapshotItem.val().msg,snapshotItem.key)
                })
            }
            this.listener()
        })
    }
    createTags(obj={}){ //Método modelo para criar TAGs na tela
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
    //GETs e SETs
    get model(){return this._model}
    set model(value){this._model=value}
    
}