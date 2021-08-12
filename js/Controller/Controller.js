class Controller{
    constructor(){
        this._model;
        this._folder=["img/folder.png","img/open-folder.png",false]
        this._currentFolder;
        this._dataset={key:"",el:""}
        this._height;
        this._currentNameFolder;
        this.initial()
        this.onImp()
        this.onBtnDelete()
        this.onBtnX()
        this.listenBtnBack()
        this.listenBtnCreateFolder()
        this.menuFolders($("#menu-folders"))
        this.height=window.innerHeight
        this.folder[2]=true
        this.realTime("folders","#ul-folder")
        this.folder[2]=false
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
    AllShow(tag){
        $(tag).forEach(t=>{
             t.classList.remove("hidden")
         })
     }
    AllHidde(tag,index=-1){
       $(tag).forEach(t=>{
            t.classList.add("hidden")
        })
        index>-1?$(tag)[index].classList.remove("hidden"):0
    }
    reloadPage(){
        document.location.reload({forcedReload:true});
    }
    listenBtnCreateFolder(){
        $("#createFolder").on("click",e=>{
            this.createFolder()
        })
    }
    listenBtnBack(){
        $("#back").on("click",e=>{
            $('.ulsImp')[0].innerHTML=""
            $("#back").hidden=true
            $(".btnAdd")[0].hidden=true
            $("#createFolder").hidden=false
            this.folder[2]=true
            this.currentFolder.src=this.folder[0]
            this.currentFolder.disabled=false
            $("#ul-folder").innerHTML=""
            this.realTime("folders","#ul-folder")
            this.folder[2]=false
        })
    }
    listenToAllFolders(){
        $(".folders").forEach((folder,i)=>{
            folder.$("input")[1].on("click",f=>{
                $("#menu-folders").classList.remove("show")
                this.currentFolder=f.target
                f.target.disabled=true
                f.target.src=this.folder[1]
                let li = f.target.parentNode.cloneNode(true)
                $("#ul-folder").innerHTML=""
                $("#ul-folder").appendChild(li)
                this.folder[2]=true
                let data = JSON.parse(f.target.parentNode.dataset.key)
                this.currentNameFolder=data.nameFolder
                this.realTime(data.nameFolder,".ulsImp")//Aqui passa o nome da pasta que será lida lá no firebase
                $(".btnAdd")[0].hidden=false
                $("#createFolder").hidden=true
                $("#back").hidden=false
                $(".checkbox").forEach(e=>e.hidden=true)
            })
        })
    }
    onImp(){//Escuta para criar novo campo na lista
        $(".btnAdd")[0].on("click",e=>{
            this.create(this.currentNameFolder)
        })
    }
    menuFolders(place){
        let ul = this.createTags({place:place,tag:"ul",class:"menu"})
        let lii = this.createTags({place:ul,tag:"li",class:"menuEdit"})
        this.createTags({
            place:lii,tag:"input",class:"btnEditFolder",alt:"edite",type:"image",src:"img/edit-small.png"
        }).on("click",e=>{this.editFolder()})
        lii=this.createTags({place:ul,tag:"li",class:"menuEdit"})
        this.createTags({
            place:lii,tag:"input",class:"btnDelFolder",alt:"delete",type:"image",src:"img/delete.png"
        }).on("click",e=>{
            let resul = confirm("Deseja mesmo Excluir tudo que está selecionado?")
            if(resul){
                this.deleteFolders()
                .then(res=>this.reloadPage())
                .catch(err=>console.log(err))
            }
            
        })
    }
    impFolder(dataset=false){
        let li = this.createTags({
            place:$("#ul-folder"),
            tag:"li",
            class:"folders",
            insertTag:`<input type="checkbox" class="checkbox">`
        })
        dataset?li.dataset.key=dataset:0
        dataset = JSON.parse(dataset)
        
        this.createTags({
         place:li,
         tag:"input",
         type:"image",
         src:this.folder[0]
         })
         this.createTags({
             place:li,
             tag:"br"
             })
         this.createTags({
             place:li,
             tag:"span",
             insertTag:dataset.alias
             })
        
    }
    createFolder(){//Método que usa o objeto Model para salvar pastas no DB
        let name = prompt("Digite o nome da nova pasta")
        if(name){
            this.model.createFirebase("folders",{nameFolder:name.replace(/[\ ]/ig,"-"),alias:name})
        }
    }
    create(nameFolder){//Método que usa o objeto Model para salvar dados no DB
        this.model.createFirebase(nameFolder,{msg:"Digite o nome do projeto..."})
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
        this.createTags({place:li,tag:"p",insertTag:value?this.tag(value):"Digite o nome do projeto..."})
    }
    tag(msg){
        // grupo de captura ([<][a][>])
        // teste para pegar o intervalo [<][a-z][>]([\w+\d+\:\//\.\?\=\∓\n])*?[<][/][a-z][>]
        
        //msg = msg.search("<a>")>-1&&msg.search("</a>")>-1?msg.replace(/[\<][a][\>]/ig,"$a->"):msg
        console.dir(msg)
        return `<a href="${String(msg).replace('<','')}">link</a>`;
    }
    update(nameFolder,msg,id){
        this.model.updateFirebase(nameFolder,msg,id)
    }
    save(key){//Criando mensagem de aviso informando que atualização foi feita com sucesso
        let e=false;
        [...$("li[data-key]")].forEach(el=>{
            if(el.dataset.key==key){
                e = this.createTags({
                    place:el,tag:"div",
                    class:"save",
                    insertTag:"Salvo!"})
            }
        })
        
        e?setTimeout(()=>e.remove(),2000):0
    }
    onBtnX(){
        $("#x").on("click",e=>{
            $("#warning").classList.toggle("fall")
            
        })
    }
    onBtnDelete(){
        $("#exc").on("click",e=>{
            this.model.deleteFirebase(this.currentNameFolder,this.dataset.key)
            this.dataset.el.remove()
            $("#x").click()
        })
    }
    onDelete(){//Escuta para o modal deletar
        $(".btnDel").forEach(el=> {
            el.on("click",e=>{
                this.dataset.key=e.target.parentNode.parentNode.parentNode.dataset.key
                this.dataset.el=e.target.parentNode.parentNode.parentNode
                let el = e.target.parentNode.parentNode.parentNode.$("p")[0].cloneNode(true)
                $("#sw").innerHTML=""
                $("#sw").appendChild(el)
                if($("#warning").offsetHeight>this.height){
                    console.log($("#warning").offsetHeight>this.height)
                    $("#warning").style.position="absolute"
                    $("#warning").style.height="50%"
                    $("#warning").style.width="95%"
                    $("#sw").style.overflowY="scroll"
                    $("#warning").style.transform="translate(-50%,-100%)"
                }else{
                    $("#warning").style.position="fixed"
                    $("#warning").style.height="auto"
                    $("#warning").style.width="auto"
                    $("#sw").style.overflowY="auto"
                    $("#warning").style.transform="translate(-50%,-50%)"
                }
                $("#warning").classList.toggle("fall")
            })
        });
    }
    blurP(){//Escuta todos os P que tem no DOM e ativado quando perde o foco
        $("p").forEach(el=> {
            el.on("blur",e=>{
                e.target.contentEditable=false
                this.update(this.currentNameFolder,e.target.innerHTML,e.target.parentNode.dataset.key)
                this.save(e.target.parentNode.dataset.key)
            })
        });
    }
    onP(){//Escuta todos os P que tem no DOM e ativado com o click
        $(".btnEdit").forEach(el=> {
            el.on("click",e=>{
                let btn = e.target.parentNode.parentNode.parentNode.$("p")[0]
                btn.contentEditable=true
                btn.focus()
            })
        });
    }
    deleteFolder(vetor){
        return new Promise((resolve,reject)=>{
            let promises=[]
            let promisesTwo=[]
            if(vetor){
                vetor.forEach(folder=>{
                    promises.push(new Promise((res,rjc)=>{
                        this.model.getFireBaseRef(folder.nameFolder).on('value',snapshot=>{
                        if(snapshot.val()){
                            snapshot.forEach(item=>{
                                promisesTwo.push(new Promise((r,rj)=>{
                                    this.model.deleteFirebase(folder.nameFolder,item.key)
                                    .then(msg=>{
                                        r(msg)
                                    })
                                    .catch(err=>rj(err))
                                }))
                            })
                            Promise.all(promisesTwo)
                            .then(fold=>{
                                res(fold)
                            })
                            .catch(errr=>{
                                rjc(errr)
                            })
                            
                        }else{res({ok:"pasta vazia"})}
                            
                        })
                    }))
                })
                Promise.all(promises)
                .then(res=>{
                    vetor.forEach(f=>{
                        this.model.deleteFirebase("folders",f.key)
                        .then(resf=>{
                            resolve(resf)
                        })
                        .catch(errf=>reject(errf))
                    })
                })
                .catch(err=>reject(err))
            }
            else{
                reject({info:"Nenhuma pasta foi selecionada e mesmo assim essa solicitação de deletar chegou até aqui"})
            }
        })
    }
    searchDel(){
        let checkedd=false
        let data=[];
        $(".checkbox").forEach(cs=>{
            if(cs.checked){
                checkedd=true
                data.push(JSON.parse(cs.parentNode.dataset.key))
            }
         })
         return checkedd?data:checkedd;
    }
  async  deleteFolders(){
        let res = await this.deleteFolder(this.searchDel());//Aqui passa a todas as pastas que foram selecionadas
        return res;

    }
    editFolder(){
        let name = prompt("Edita nome da pasta");
        if(name){
            $(".checkbox").forEach(cs=>{
                if(cs.checked){
                    let data = JSON.parse(cs.parentNode.dataset.key)
                    data.alias=name
                    this.update("folders",data,data.key)
                    cs.parentNode.dataset.key=JSON.stringify(data)
                    cs.parentNode.$('span')[0].innerHTML=name
                    $("#menu-folders").classList.remove("show")
                }
             })
        }
    }
    counterCheckbox(){
        let counter=0
        $(".checkbox").forEach(cs=>{
           if(cs.checked){
            cs.parentNode.$("input")[1].disabled=true
               counter++
            }
            else cs.parentNode.$("input")[1].disabled=false
        })
        return counter;
    }
    realTime(folder=false,imp){//Impressão das informações do DB para tela em tempo real
        if(this.folder[2]){
            this.model.getFireBaseRef(folder?folder:"list").on("value",snapshot=>{
                if(snapshot.val()){
                    imp.search("#")>-1?$(imp).innerHTML="":$(imp)[0].innerHTML=""
                    if(folder == "folders"){
                        snapshot.forEach(snapshotItem=>{
                            let dataset = Object.assign(snapshotItem.val(),{key:snapshotItem.key})
                            this.impFolder(JSON.stringify(dataset))
                        })
                    }else{
                        snapshot.forEach(snapshotItem=>{
                            this.imp(snapshotItem.val().msg,snapshotItem.key)
                        })
                    }
                }
                !folder?$("#back").hidden=false:0
                if(folder=="folders"){
                    $(".checkbox").forEach(cs=>{
                        cs.on("click",c=>{
                            let ch = $("#menu-folders");
                            
                            this.counterCheckbox()>1?ch.$("li")[0].hidden=true:ch.$("li")[0].hidden=false
                            this.counterCheckbox()>0?ch.classList.add("show"):ch.classList.remove("show")
                        })
                    })
                }
                this.listenToAllFolders()
                this.listener()
            })
        }
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
    get currentNameFolder(){return this._currentNameFolder}
    set currentNameFolder(value){this._currentNameFolder=value}
    get currentFolder(){return this._currentFolder}
    set currentFolder(value){this._currentFolder=value}
    get folder(){return this._folder}
    set folder(value){this._folder=value}
    get height(){return this._height}
    set height(value){this._height=value}
    get dataset(){return this._dataset}
    set dataset(value){this._dataset=value}
    get model(){return this._model}
    set model(value){this._model=value}
    
}