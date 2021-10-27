const FIELDS={}
new Controller()

let play =document.querySelector("#girar")

function clickPlay(el){
    document.querySelectorAll(".back-video").forEach(video=>{
        video.play()
        .then(e=>play.parentNode.remove())
    })
}
play.addEventListener("click",()=>{
     clickPlay();
    
})