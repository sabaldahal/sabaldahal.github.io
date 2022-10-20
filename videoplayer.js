console.log(document.querySelectorAll('.video-grid video'))
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
        document.querySelector('.popup-video').style.display = 'block';
        document.querySelector('.popup-video video').src = one.getAttribute('src');

    }
});

document.querySelector('.popup-video span').onclick = () => {
    let curr = document.querySelector('.popup-video');
    curr.style.display = 'none';
    let curr_video = curr.querySelector('video');
    curr_video.pause();
    curr_video.currentTime = 0;
    
}