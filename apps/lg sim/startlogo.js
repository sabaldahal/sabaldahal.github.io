import { mainMenu } from "./mainmenu.js";

export const startAnimation = ()=>{
    const logo = document.querySelector('#startlogo .holder');
    let val = 1;
    let op = 1;
    
    let logoInterval = setInterval(()=>{
        if (val >= 1.6) {
            clearInterval(logoInterval);
            logo.style.display = 'none';
            document.querySelector('#startlogo').style.display = 'none';
            mainMenu();

        };
        
        logo.style.transform = `translate(-50%, -50%) scale(${val})`;
        logo.style.opacity = op;
        logo.style.display = 'block';
        val = val + 0.2;
        op -= 0.4;
    },600)
    
}