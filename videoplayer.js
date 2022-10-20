const popup_video = document.querySelector('.popup-video');

document.querySelectorAll('.video-grid video').forEach(one => {
    one.addEventListener('mouseover', (eve)=>{
        one.muted = true;
        one.currentTime = one.duration - (0.7 * one.duration);
        one.play();
    })
    one.addEventListener('mouseleave', (eve)=>{
        one.removeAttribute('muted');
        one.currentTime = 0;
        one.pause();
    })
    one.onclick = () => {
        console.log(one.getAttribute('src'));
        popup_video.style.display = 'block';
        popup_video.querySelector('video').src = one.getAttribute('src');

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