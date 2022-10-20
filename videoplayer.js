const popup_video = document.querySelector('.popup-video');

function time_string(value){
    let min = value / 60;
    min = Math.floor(min);
    let seconds = value % 60; 
    seconds = Math.floor(seconds);
    if(min < 10) {
        min = '0' + min;
    };
    if(seconds < 10){
        seconds = '0' + seconds;
    }  
    return `${min}:${seconds}`;
}
document.querySelectorAll('.video-grid div').forEach(one => {
    let div_video = one.querySelector('video');
    let div_img = one.querySelector('img');
    let div_span = one.querySelector('span');
    
    div_video.onloadedmetadata = ()=>{
        div_span.innerHTML = time_string(div_video.duration);      
    }
    

    one.addEventListener('mouseover', (eve)=>{
        if(div_img != null){
            div_img.style.opacity = 0;
        }
        div_span.style.display = 'none';
        div_video.muted = true;
        div_video.currentTime = div_video.duration - (0.7 * div_video.duration);
        div_video.play();
    })
    one.addEventListener('mouseleave', (eve)=>{
        if(div_img != null){
            div_img.style.opacity = 1;
        }
        div_span.style.display = 'block';
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