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
        this.onImp()
    }
    onImp(){
        $(".btnAdd")[0].on("click",e=>{
            this.imp()
        })
    }
    imp(value=false){
        $('.ulsImp')[0].innerHTML+=`
        <li class="lisImp">
            <ul class="menu">
                <li class="menuEdit"><input type="image" src="img/edit-small.png" alt="edite" class="btnEdit"></li>
                <li class="menuEdit"><input type="image" src="img/delete.png" alt="edite" class="btnDel"></li>
            </ul>
            <p>${value?value:"Digite o nome do projeto..."}</p> 
        </li>
    `
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
        $(".btnEdit").forEach(el=> {
            el.on("click",e=>{
                let btn = e.target.parentNode.parentNode.parentNode.$("p")[0]
                btn.contentEditable=true
                btn.focus()
                console.log(btn.innerHTML)
              
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