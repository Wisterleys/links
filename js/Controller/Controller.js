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
        this.realTime("folders","#ul-folder");
        this.folder[2]=false
        this.folder_alias;
    }
    initial(){//Método que inicia os eventos e intacia a classe Model
        this.model= new Model()
        this.listener()
    }
    listener(){//Método que chama as escutas
        this.onP()
        this.blurP()
        this.onDelete()
        this.onAnexo()
        this.onFiles()
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
                this.folder_alias = data.alias
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
        this.model.createFirebase(nameFolder,{msg:"Mensagem..."})
    }
    //LIs dentro das pastas
    filesTamplete(anexos,type,fileName,file,modal=false){
        let div;
        type = type.split('.')[1]
        switch(type){
            case"pdf":
            case"PDF":
                 div = anexos.addEl({tag:'div',class:'anexos-item pdf row'})
                    div.addEl({tag:'input',type:'image',class:'col-12',src:'img/icons/pdf-retangular.svg'}).dataset.file=JSON.stringify(file)
                    div.addEl({tag:'div',class:'col-12',insertTag:fileName})
            break;
            case"doc":
            case"docx":
                 div = anexos.addEl({tag:'div',class:'anexos-item docx row'})
                    div.addEl({tag:'input',type:'image',class:'col-12',src:'img/icons/docx.svg'}).dataset.file=JSON.stringify(file)
                    div.addEl({tag:'div',class:'col-12',insertTag:fileName})
                
            break;
            case"apk":
             div = anexos.addEl({tag:'div',class:'anexos-item apk row'})
                    div.addEl({tag:'input',type:'image',class:'col-12',src:'img/icons/apk.png'}).dataset.file=JSON.stringify(file)
                    div.addEl({tag:'div',class:'col-12',insertTag:fileName})
                
            break;
            case"video":
            case"mp4":
             div = anexos.addEl({tag:'div',class:'anexos-item video row'})
                    div.addEl({tag:'input',type:'image',class:'col-12',src:'img/icons/video.svg'}).dataset.file=JSON.stringify(file)
                    div.addEl({tag:'div',class:'col-12',insertTag:fileName})
                
            break;
            case"xls":
            case"xlsx":
             div = anexos.addEl({tag:'div',class:'anexos-item xlsx row'})
                    div.addEl({tag:'input',type:'image',class:'col-12',src:'img/icons/xlsx.svg'}).dataset.file=JSON.stringify(file)
                    div.addEl({tag:'div',class:'col-12',insertTag:fileName})
                
            break;
            case"mp3":
            case"audio":
             div = anexos.addEl({tag:'div',class:'anexos-item audio row'})
                    div.addEl({tag:'input',type:'image',class:'col-12',src:'img/icons/audio.svg'}).dataset.file=JSON.stringify(file)
                    div.addEl({tag:'div',class:'col-12',insertTag:fileName})
                
            break;
            default:
                 div = anexos.addEl({tag:'div',class:'anexos-item default-file row'})
                    div.addEl({tag:'input',type:'image',class:'col-12',src:'img/icons/default-file.svg'}).dataset.file=JSON.stringify(file)
                    div.addEl({tag:'div',class:'col-12',insertTag:fileName})
                
            break;
        }
        modal?div.style="position:absolute;top:0px;left:0%;transform:translateX:50%;width:200px;display:flex;flex-direction:row;":0// Apenas para mostrar o arquivo dentro do modal file com posicionamento absoluto
    }
    bodyLiTamplete(obj){
        //title=false,msg=false,dataset
        /*
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title m-0">Featured</h5>
                </div>
                <div class="card-body">
                    <h6 class="card-title">Special title treatment</h6>

                    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                    <a href="#" class="btn btn-primary">Go somewhere</a>
                </div>
            </div>
        */
        let row =  $('.ulsImp')[0].addEl({tag:"li",class:'row col-12'})
            let card = row.addEl({tag:"div",class:'card col-12 lisImp'})
                let header = card.addEl({tag:'div',class:'card-headers row'})
                    let h5 = header.addEl({tag:'h5', class:'card-title m-0 col-6'})
                        h5.addEl({tag:'img',src:this.folder[1],style:'width:40px;margin-right:5px;'})
                        h5.addEl({tag:'lable',insertTag:this.folder_alias})
                    let ul = header.addEl({tag:"ul",class:"menu col-6"})
                    let lii = ul.addEl({tag:"li",class:"menuEdit"})
                    lii.addEl({
                    tag:"input",class:"btnEdit",alt:"edite",type:"image",src:"img/edit-small.png"
                    })
                    lii=ul.addEl({tag:"li",class:"menuEdit"})
                    lii.addEl({
                        tag:"input",class:"btnDel",alt:"delete",type:"image",src:"img/delete.png"
                    })
                    
                let card_body = card.addEl({tag:'div',class:'card-body'})
                card_body.dataset.key=obj.key
                card_body.dataset.obj=JSON.stringify(obj)
                    card_body.addEl({tag:'h6',class:'card-title ps',insertTag:obj.title?obj.title:'Título...'})
                    let anexos = card_body.addEl({tag:'div',class:'card-anexos row'});
                    obj.files?anexos.dataset.files=JSON.stringify(obj.files):0;
                        obj.files?
                        obj.files.forEach(file=>this.filesTamplete(anexos,file.fullPath,file.name,file)):0
                        let modal_files = anexos.addEl({tag:'div',class:'menu-modal-file',hidden:true})
                        modal_files.addEl({tag:'div',class:'x-file',insertTag:'X'})
                        let content = modal_files.addEl({tag:'div',class:'options'})
                            content.addEl({tag:'h4',class:'h4'})
                            content.addEl({tag:'a',href:'',target:'__blak',class:'btn btn-primary down',value:'Download',insertTag:'Download'})
                            content.addEl({tag:'input',type:'button',class:'btn btn-danger delet',value:'Deletar'})
                        let modal_load =anexos.addEl({tag:'div',class:'loading',hidden:true})
                            modal_load.addEl({tag:'img',src:'img/loading.gif',style:'width:30%;'})
                    card_body.addEl({tag:'p',class:'card-text ps',insertTag:obj.msg?this.tag(obj.msg):'Mensagem...'})
                    card_body.addEl({tag:'input',type:'button',class:'btn btn-primary v anexo',value:'Add anexo'})
                    card_body.addEl({tag:'input',type:'button',class:'btn btn-success btn-save hidde',value:'Salvar',style:'margin-left:10px;'})
                    card_body.addEl({tag:'input',type:'file',hidden:true,class:'anexo-file',multiple:''})
    }
    onFiles(){
        $(".anexos-item").forEach(item=>{
            item.on("click",e=>{
                const file = JSON.parse(e.target.dataset.file)
                e.target.parentNode.parentNode.$('.down')[0].href=file.customMetadata.downloadURL
                e.target.parentNode.parentNode.$('.h4')[0].innerHTML=file.name
               
                e.target.parentNode.parentNode.$(".menu-modal-file")[0].hidden=false
            })
        })
        $(".x-file").forEach(item=>{
            item.on("click",e=>{
                
                e.target.parentNode.hidden=true
            })
        })
        $(".delet").forEach(item=>{
            item.on("click",e=>{
                const h6 = e.target.parentNode.parentNode.parentNode.parentNode.$("h6")[0].innerHTML
                const p = e.target.parentNode.parentNode.parentNode.parentNode.$("p")[0].innerHTML
                const key = e.target.parentNode.parentNode.parentNode.parentNode.dataset.key
                const datas = JSON.parse(e.target.parentNode.parentNode.parentNode.dataset.files)
                const data = JSON.parse(e.target.parentNode.parentNode.parentNode.$('.anexos-item > input[type=image]')[0].dataset.file)
                this.model.deleteStorage({fileName:data.fullPath.split('/')[1]})
                .then(res=>{
                    datas.forEach((d,i)=>{
                        d.fullPath==data.fullPath?datas.splice(i, 1):0;
                    })
                    this.update(this.currentNameFolder,
                        {
                            title:h6,
                            msg:p,
                            files:JSON.stringify(datas)
                        },
                        key)
                })
                .catch(err=>{
                    // Vai apagar o arquivo do firebase pois n foi encontrado no storage
                    datas.forEach((d,i)=>{
                        d.fullPath==data.fullPath?datas.splice(i, 1):0;
                    })
                    this.update(this.currentNameFolder,
                        {
                            title:h6,
                            msg:p,
                            files:JSON.stringify(datas)
                        },
                        key)
                })
            })
        })
        
    }
    imp(obj){//Método responsavel para realizar impressão de LI corretamente na tela com as informações
       
        this.bodyLiTamplete(obj)
    }
    tamplateCode(value){
       let tag= `
        <pre style="box-sizing: border-box; margin-top: 0px; margin-bottom: 10px; padding: 9.5px; border: 1px solid rgb(204, 204, 204); font-variant-numeric: inherit; font-variant-east-asian: inherit; font-stretch: inherit; font-size: 13px; line-height: 1.42857; font-family: Menlo, Monaco, Consolas, &quot;Courier New&quot;, monospace; vertical-align: baseline; overflow: auto; color: rgb(51, 51, 51); word-break: break-all; overflow-wrap: break-word; background-color: rgb(245, 245, 245); border-radius: 4px;">
        <span style="box-sizing: border-box; margin: 0px; padding: 0px; border: 0px; font-style: inherit; font-variant: inherit; font-stretch: inherit; font-size: inherit; line-height: inherit; font-family: inherit; vertical-align: baseline;">
        ${value}
        </span>
        </pre>
        `
        return tag;
    }
    tag(msg){
        let tag = msg.replace(/[\[]([\w]+)[\]][{](.*)[}]/,e=>{
            let es = e.replace(/[\[]([\w]+)[\]][{](.*)[}]/,"$1,$2").split(',')
            let name; 
            es.length>1?es[1].replace(/(http[s]?[:][/]{2}.*[.][c]?[o]?[m]?[.]?[b]?[r]?)/,c=>{// Pega só o que precisa e armazena na variavel name
                name = c+"..."
                return c;
            }):0
            if(es.length>1){
                switch(es[0]){
                    case"a":
                    es=`<${es[0]} target="_blank" href="${es[1]}">${name?name:"Link..."}</${es[0]}>`
                    break;
                    case"img":
                    es=`<${es[0]} src="${es[1]}" width="100%">`
                    break;
                    case"code":
                    es=this.tamplateCode(es[1])
                    break;
                    case"youtube":
                    let code = es[1].split("v=")[1].search("&")>-1?
                    es[1].split("v=")[1].split("&")[0]:es[1].split("v=")[1].split("&")[0]
                    es=`
                    <div class="embed-responsive embed-responsive-21by9">
                        <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/${code}"></iframe>
                    </div>
                    `
                    
                    break;
                    default:
                        es=`${es[0]} ${es[1]}`
                }
            }else{
                es=e
            }
            return es;
        })//PEGO O NOME DA TAG E O CONTEUDO [<TAGNAME>]{CONTEUDO}
        return tag;
       
    }
    update(folder_name,msg,id){
        this.model.updateFirebase(folder_name,msg,id)
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
            
            const data = JSON.parse(e.target.parentNode.dataset.obj)
            if(data.files.length>0){
                this.deleteAllFiles(data.files)
                .then(res=>{
                    this.model.deleteFirebase(this.currentNameFolder,this.dataset.key)
                    this.dataset.el.remove()
                    $("#x").click()
                })
                .catch(err=>{
                    this.model.deleteFirebase(this.currentNameFolder,this.dataset.key)
                    this.dataset.el.remove()
                    $("#x").click()
                })
            }else{
                this.model.deleteFirebase(this.currentNameFolder,this.dataset.key)
                this.dataset.el.remove()
                $("#x").click()
            }
        })
    }
    onDelete(){//Escuta para o modal deletar
        $(".btnDel").forEach(el=> {
            el.on("click",e=>{
                this.dataset.key=e.target.parentNode.parentNode.parentNode.parentNode.$(".card-body")[0].dataset.key
                let obj =e.target.parentNode.parentNode.parentNode.parentNode.$(".card-body")[0].dataset.obj
                this.dataset.el=e.target.parentNode.parentNode.parentNode.parentNode.$(".card-body")[0]
                let el = e.target.parentNode.parentNode.parentNode.parentNode.$(".card-body")[0].cloneNode(true)
             
                $("#sw").innerHTML=""
                $("#sw").appendChild(el)
                $("#sw").$(".v")[0].remove()
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
                $("#arnaldo").dataset.obj = obj;
                $("#warning").classList.toggle("fall")
            })
        });
    }
    fileUpload(load,files){
        const data_files = load.$(".card-anexos")[0].dataset.files?JSON.parse(load.$(".card-anexos")[0].dataset.files):[]
        this.model.uploadTask(files)
        .then(array=>{
            array.forEach(f=>{//Consertar o nome do arquivo, ou seja, apenas o apelido e n o fullname e também preenche array data 
                const part = f.name.split("-")
                const name = part[0]
                f.name = name
                data_files.push(f)
            })
            console.log(data_files)
            this.update(this.currentNameFolder,
                {
                    title:load.$("h6")[0].innerHTML,
                    msg:load.$("p")[0].innerHTML,
                    files:JSON.stringify(data_files)
                },
                load.dataset.key)
        })

    }
    onAnexo(){
        $(".anexo").forEach(anexo=>{
            anexo.addEventListener("click",e=>{
                e.target.parentNode.$('input[type=file]')[0].click()
            })
        })
        $('.anexo-file').forEach(file=>{
            file.addEventListener("change",e=>{
                e.target.parentNode.$(".loading")[0].hidden=false
                this.fileUpload(e.target.parentNode,e.target.files)
                
            })
        })
    }
    blurP(){//Escuta todos os P que tem no DOM e ativado quando clica no botão salvar
        $(".btn-save").forEach(el=> {
            el.on("click",e=>{
                $(".ps").forEach(p=>p.contentEditable=false)
                let data = JSON.parse(e.target.parentNode.dataset.obj)
                
                this.update(this.currentNameFolder,{
                    title:e.target.parentNode.$("h6")[0].innerHTML,
                    msg:e.target.parentNode.$("p")[0].innerHTML,
                    files:JSON.stringify(data.files)

                },
                    e.target.parentNode.dataset.key)
                this.save(e.target.parentNode.dataset.key)
            })
        });
    }
    onP(){//Escuta todos os P que tem no DOM e ativado com o click
        $(".btnEdit").forEach(el=> {
            el.on("click",e=>{
                let ps = e.target.parentNode.parentNode.parentNode.parentNode.$(".ps")
                let hiddes = e.target.parentNode.parentNode.parentNode.parentNode.$(".hidde")
                ps.forEach(p=>{
                    p.contentEditable=true
                    p.style.border="1px solid green"
                    p.focus()
                })
                hiddes.forEach(hidde=>hidde.toggle('hidde'))
            })
        });
    }
    deleteAllFiles(array){
        let promises=[]
        for (let index = array.length-1; index >= 0; index--) {
            promises.push(new Promise((resolve,rejec)=>{
                this.model.deleteStorage({fileName:array[index].fullPath.split('/')[1]})
                .then(res=>{
                    resolve(res)
                    
                })
                .catch(err=>rejec(err))
            }))
            
        }
        return Promise.all(promises)
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
                                    
                                    if(item.val().files){
                                        
                                        this.deleteAllFiles(JSON.parse(item.val().files))
                                        .then(fil=>{
                                            this.model.deleteFirebase(folder.nameFolder,item.key)
                                            .then(msg=>{
                                                r(msg)
                                            })
                                            .catch(err=>rj(err))
                                            })
                                        .catch(er=>{
                                            this.model.deleteFirebase(folder.nameFolder,item.key)
                                            .then(msg=>{
                                                r(msg)
                                            })
                                            .catch(err=>rj(err))
                                        })
                                    }else{
                                        this.model.deleteFirebase(folder.nameFolder,item.key)
                                        .then(msg=>{
                                            r(msg)
                                        })
                                        .catch(err=>rj(err))
                                    }
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
                            let obj={
                                title:snapshotItem.val().title?snapshotItem.val().title:false,
                                msg:snapshotItem.val().msg,
                                files:snapshotItem.val().files?JSON.parse(snapshotItem.val().files):[],
                                key:snapshotItem.key
                            } 
                            this.imp(obj)
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
