
const canvas = document.querySelector('#canvas');
export class Input{
    constructor(board){
        this.keys = [];
        this.board = board;
        this.startX; //to drag
        this.startY; //to drag
        this.index = null; //drag gate at index
        this.wireIndex = null; //update position of wire relative to gate index
        this.drag = false;
        this.paint = false;
        this.branch = false;
        this.hasHead = false; //check if wire is already attached to one gate
        this.fromPin;
        this.toPin;
        this.currMouseX; 
        this.currMouseY;    
        this.cntx = canvas.getContext('2d');

        window.addEventListener("contextmenu", e => e.preventDefault());
        //find which gate is being clicked
        
        const gate_rect_check = (e)=>{
            e.preventDefault();
            this.startX = parseInt(e.offsetX);
            this.startY = parseInt(e.offsetY);
            let idx = 0;
            let active = false;
            for(let travel of this.board.allGate){
                let isOn = travel.is_mouse_over(this.startX,this.startY);
                if(isOn){
                    this.drag =true;
                    this.index = idx;
                    active = true;
                    travel.hasBorder = true;
                }else{
                    if(!active){
                        idx++;
                    }
                    travel.hasBorder = false;
                }
            }
            active = false;
            this.board.draw(this.cntx);

        }
        //move the gate being dragged
        const moveGate = (e)=>{
            if(!this.drag){
                return;
            }else{
                e.preventDefault();
                let mouseX = parseInt(e.offsetX);
                let mouseY = parseInt(e.offsetY);
                let dx = mouseX - this.startX;
                let dy = mouseY - this.startY;
                this.board.allGate[this.index].update(dx,dy);
                this.board.draw(this.cntx);

                this.startX = mouseX;
                this.startY = mouseY;
            }
        }
        //avoid moving any gates
        //no drag allowed
        const m_drag_false = (e)=>{
            this.startX = null;
            this.startY = null;
            if(!this.drag){
                return;
            }
            e.preventDefault();
            this.drag = false;
        }
        //check if mouse is clicked on a pin
        const pins = (e)=>{
            let onPin;
            for(let one of this.board.allGate){
                onPin = one.is_mouse_on_pin(e.offsetX,e.offsetY);
                if(onPin){
                    this.drag = false;
                    this.paint = true;
                    this.hasHead = true;
                    this.fromPin = onPin;
                    break;
                }
            }
            draw_wires();
        }
        //stop drawing wire
        const stop_draw_wire = ()=>{
            this.paint = false;
            this.hasHead =false;
        }
        const stroke_wire =()=>{
            this.cntx.lineWidth = 10;
            this.cntx.lineCap = 'round';
            this.cntx.strokeStyle = 'grey';
            this.cntx.beginPath();
            this.cntx.moveTo(this.fromPin.x, this.fromPin.y);
            this.cntx.lineTo(this.currMouseX, this.currMouseY);
            this.cntx.stroke();
        }
        //draw wires
        const draw_wires =()=>{
            this.board.draw(this.cntx);
            if(!this.paint) return;
            
            stroke_wire();
            this.paintHead = false;
    
        }
        const add_branch =(e)=>{
            let onPin;
            for(let one of this.board.allGate){
                onPin = one.is_mouse_on_pin(e.offsetX,e.offsetY);
                if(onPin){
                    break;
                }
            }
            if(!onPin){
                this.paint = false;
                this.hasHead =false;
                //branch here
            }else{
                //terminate here
                let val = {
                    source : this.fromPin,
                    destination : onPin
                }
                this.board.wires.addToPin(val);
                this.hasHead = false;
            }
            this.drag = false;
            this.paint = false;          
            draw_wires();
        }
        const add_branch2 =(e)=>{
            let onPin;
            for(let one of this.board.allGate){
                onPin = one.is_mouse_on_pin(e.offsetX,e.offsetY);
                if(onPin){
                    break;
                }
            }
            if(onPin){
                //terminate here
                let val = {
                    source : this.fromPin,
                    destination : onPin
                }
                this.board.wires.addToPin(val);
                this.hasHead = false;
            }         
            draw_wires();
        }

        canvas.onmousedown = (e)=>{
            gate_rect_check(e);
            if(e.button == 0){ 
                if(this.hasHead){
                    add_branch(e);
                }else{
                    pins(e);
                }
            }
            else if(e.button == 2) stop_draw_wire();
        }
        canvas.onmousemove = (e)=>{
            this.currMouseX = e.offsetX;
            this.currMouseY = e.offsetY;
            moveGate(e);
            draw_wires();
        }
        canvas.onmouseup = (e)=>{
            m_drag_false(e);
            draw_wires();
        }
        canvas.onmouseout = (e)=>{
            m_drag_false(e);
        }
 
        


        //old
        window.addEventListener('keydown', (e)=>{
            if((e.key == 'ArrowUp' || e.key == 'ArrowRight')
            && this.keys.indexOf(e.key) == -1 ){
                this.keys.push(e.key);
            }
        });
        window.addEventListener('keyup', (e)=>{
            if(e.key == 'ArrowUp' 
            || e.key == 'ArrowRight'){
                this.keys.splice(this.keys.indexOf(e.key),1);
            }
        });

    }
    draw(context){
        this.board.draw(context);
    }

}