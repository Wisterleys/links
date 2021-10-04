const FIELDS={}
new Controller()
let play =document.querySelector("#girar")
play.addEventListener("click",()=>{
     document.querySelectorAll(".back-video");
    document.querySelectorAll(".back-video").forEach(video=>{
        video.play()
        .then(e=>play.remove())
    })
})
