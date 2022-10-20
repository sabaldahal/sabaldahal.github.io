const popup_video = document.querySelector('.popup-video');


// document.querySelectorAll('.video-grid div').forEach(one => {
//     let div_video = one.querySelector('video');
//     let div_img = one.querySelector('img');
//     one.addEventListener('mouseover', (eve)=>{
//         div_img.style.display = 'none';
//         div_video.style.display = 'block';    
//         div_video.muted = true;
//         div_video.currentTime = div_video.duration - (0.7 * div_video.duration);
//         div_video.play();
//     })
//     one.addEventListener('mouseleave', (eve)=>{
//         div_img.style.display = 'block';
//         div_video.style.display = 'none';
//         div_video.removeAttribute('muted');
//         div_video.currentTime = 0;
//         div_video.pause();
//     })
//     one.onclick = () => {
//         popup_video.style.display = 'block';
//         popup_video.querySelector('video').src = div_video.getAttribute('src');

//     }
// });

document.querySelectorAll('.video-grid div').forEach(one => {
    let div_video = one.querySelector('video');
    let div_img = one.querySelector('img');
    console.log(div_img);

    one.addEventListener('mouseover', (eve)=>{
        if(div_img != null){
            div_img.style.opacity = 0;
        }    
        div_video.muted = true;
        div_video.currentTime = div_video.duration - (0.7 * div_video.duration);
        div_video.play();
    })
    one.addEventListener('mouseleave', (eve)=>{
        if(div_img != null){
            div_img.style.opacity = 1;
        }
        div_video.removeAttribute('muted');
        div_video.currentTime = 0;
        div_video.pause();
    })
    one.onclick = () => {
        popup_video.style.display = 'block';
        popup_video.querySelector('video').src = div_video.getAttribute('src');

    }
});

popup_video.onclick = function(evt) {
    if((evt.target) !=  popup_video.querySelector('video')){
        popup_video.style.display = 'none';
        let popup_videoElement = popup_video.querySelector('video');
        popup_videoElement.pause();
        popup_videoElement.currentTime = 0;
    }
}