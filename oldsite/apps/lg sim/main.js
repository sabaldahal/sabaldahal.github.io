import { Board } from './board.js';
import { instructions } from './instructions.js';



const canvas = document.querySelector('#canvas');
const lgswrapper = document.querySelector('#lgswrapper');
const ret_menu = document.querySelector('#returnMainMenu');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth -6;
canvas.height = window.innerHeight - 6;

const startGame = ()=>{
    lgswrapper.style.display = 'block';
    const game = new Board(canvas.width, canvas.height);
    game.draw(ctx);
}
const startAnimation = ()=>{
    document.querySelector('#startlogo').style.display = 'block';
    const logo = document.querySelector('#startlogo .holder');
    let val = 1;
    let op = 1;
    
    let logoInterval = setInterval(()=>{
        if (val >= 1.6) {
            clearInterval(logoInterval);
            logo.style.display = 'none';
            document.querySelector('#startlogo').style.display = 'none';
            main_menu();
        };
        
        logo.style.transform = `translate(-50%, -50%) scale(${val})`;
        logo.style.opacity = op;
        logo.style.display = 'block';
        val = val + 0.2;
        op -= 0.4;
    },600)
    
}
const main_menu = ()=>{
    let main_menu = document.querySelector('#mainmenu');
    let  menuHolder = main_menu.querySelector('.holder');
    let instHolder = main_menu.querySelector('.instructions');
    let b_start = document.querySelector('#Gstart');
    let b_inst = document.querySelector('#Ginstructions');
    let b_inst_back = document.querySelector('#instBack');
    lgswrapper.style.display = 'none';
    main_menu.style.display = 'block';
    //start game
    b_start.onclick = (e)=>{
        e.preventDefault();
        main_menu.style.display = 'none';
        startGame();
    }
    b_inst.onclick = (e)=>{
        e.preventDefault();
        menuHolder.style.display = 'none';
        instHolder.querySelector('#addinst').innerHTML = instructions();
        instHolder.style.display = 'block';
    }
    b_inst_back.onclick = (e)=>{
        e.preventDefault();
        instHolder.style.display = 'none';
        menuHolder.style.display = 'block';
    }
}

ret_menu.onclick = ()=>{
    main_menu();
}
const Game = () => {
    startAnimation();
    // main_menu();
}

window.addEventListener('DOMContentLoaded', Game());
