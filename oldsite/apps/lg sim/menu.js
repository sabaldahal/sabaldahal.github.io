
const menuholder = document.querySelector('#canvas-popup');
const openGateMenu = (x, y)=>{
    menuholder.style.left = 100 + x + 'px';
    menuholder.style.top = -50 + y + 'px';
}

export class Menu{
    constructor(board){
        this.board = board;
        this.activeGate = null;
        this.activeBit = null;
        this.activeWire = null;
        this.cntx = canvas.getContext('2d');

        //interactive methods
        menuholder.onclick = (e)=>{
            alert('This Functionality will cause the program to crash! The Error will be addressed in the next update');
            let idx = this.board.allGate.findIndex((gate)=>gate.isIndex == this.activeGate);
            this.board.allGate.splice(idx,1);
            menuholder.style.display = 'none';
            this.board.draw(this.cntx);
        }
    }

    gate_menu(e){
        //check for the button
        if(e.button != 2) {
            menuholder.style.display = 'none';
            return;
        }
        //check for the gate index;
        let val;
        for(let gate of this.board.allGate){
            val = gate.is_mouse_over(e.offsetX, e.offsetY);
            if(val){
                this.activeGate = gate.isIndex;
                break;
            }
        }
        if(!val) this.activeGate = null;
        if(this.activeGate != null){
            openGateMenu(e.pageX, e.pageY);
            menuholder.style.display = 'block';
        }else{
            menuholder.style.display = 'none';
        }
    }
}