const firstSnippet = document.querySelector('#first-snippet');
const secondSnippet = document.querySelector('#second-snippet');
const thirdSnippet = document.querySelector('#third-snippet');


const default_copy_msg = `<i class="fa fa-thin fa-paste"></i>Copy Code Snippet`;
const copied_msg = `<i class="fa fa fa-thin fa-check"></i>Copied`;

//copy code snippet to Clipboard, display copied message and reset it
firstSnippet.onclick = function(evt){
    navigator.clipboard.writeText(firstSnippet.querySelector('.copyCode').innerText);
    firstSnippet.querySelector('.copy-to-clipboard').innerHTML = copied_msg;
    setTimeout(() => {
        firstSnippet.querySelector('.copy-to-clipboard').innerHTML = default_copy_msg;
    }, 1500
    );
};

secondSnippet.onclick = function(evt){
    navigator.clipboard.writeText(secondSnippet.querySelector('.copyCode').innerText);
    secondSnippet.querySelector('.copy-to-clipboard').innerHTML = copied_msg;
    setTimeout(() => {
        secondSnippet.querySelector('.copy-to-clipboard').innerHTML = default_copy_msg;
    }, 1500
    );
}

thirdSnippet.onclick = function(evt){
    navigator.clipboard.writeText(thirdSnippet.querySelector('.copyCode').innerText);
    thirdSnippet.querySelector('.copy-to-clipboard').innerHTML = copied_msg;
    setTimeout(() => {
        thirdSnippet.querySelector('.copy-to-clipboard').innerHTML = default_copy_msg;
    }, 1500
    );
}




