
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
        this.drag_source = false; //allow the source to be dragged
        this.drag_output = false; //allow the ouput to be dragged
        this.drag_source_index = null; //capture the source index to drag
        this.drag_output_index = null; //capture the output index to drag
        this.s_is_dragging = false; //check if the source is being dragged
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
            //checking if the mouse is on Gates
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
            if(!onPin){
                //checking if the mouse is on input
                onPin = this.board.inputBit.is_mouse_on_pin(e.offsetX, e.offsetY)
                if(onPin){
                    this.drag = false;
                    this.paint = true;
                    this.hasHead = true;
                    this.fromPin = onPin;
                }
            }
            if(!onPin){
                //checking if the mouse is on output
                onPin = this.board.outputBit.is_mouse_on_pin(e.offsetX, e.offsetY)
                if(onPin){
                    this.drag = false;
                    this.paint = true;
                    this.hasHead = true;
                    this.fromPin = onPin;
                }
            }

            draw_wires();
        }
        //stop drawing wire
        const stop_draw_wire = ()=>{
            this.paint = false;
            this.hasHead =false;
        }
        //set the styling of the wire
        const stroke_wire =()=>{
            this.cntx.lineWidth = 5;
            this.cntx.lineCap = 'round';
            this.cntx.strokeStyle = '#000000';
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
        //terminate or branch wire
        const add_branch =(e)=>{
            let onPin;
            //checking on the pins of all the Gates
            for(let one of this.board.allGate){
                onPin = one.is_mouse_on_pin(e.offsetX,e.offsetY);
                if(onPin){
                    break;
                }
            }
            //checking on the input Bit
            if(!onPin){
                onPin = this.board.inputBit.is_mouse_on_pin(e.offsetX, e.offsetY);            
            }
            //checking on the output bits
            if(!onPin){
                onPin = this.board.outputBit.is_mouse_on_pin(e.offsetX, e.offsetY);            
            }
            if(!onPin){
                this.paint = false;
                this.hasHead =false;
                //branch here
            }else{
                //terminate here
                let val = {
                    source : this.fromPin,
                    destination : onPin,
                    on : false, //need to update this
                    visited : false
                }
                this.board.wires.addToPin(val);
                this.board.wires.update_array();
                this.hasHead = false;
            }
            this.drag = false;
            this.paint = false;          
            draw_wires();
        }
        // const add_branch2 =(e)=>{
        //     let onPin;
        //     for(let one of this.board.allGate){
        //         onPin = one.is_mouse_on_pin(e.offsetX,e.offsetY);
        //         if(onPin){
        //             break;
        //         }
        //     }
        //     if(onPin){
        //         //terminate here
        //         let val = {
        //             source : this.fromPin,
        //             destination : onPin
        //         }
        //         this.board.wires.addToPin(val);
        //         this.hasHead = false;
        //     }         
        //     draw_wires();
        // }

        //toggle the source bit on or off
        const toggle_source = (e)=>{
            if(this.s_is_dragging) return;
            this.board.inputBit.is_mouse_on_bit(e.offsetX, e.offsetY);
            this.s_is_dragging = false;
        }
        //check if the mouse is on the source bit
        const toggle_source_drag = (e)=>{
            let check = this.board.inputBit.allow_toggle(e.offsetX, e.offsetY)
            if(check.isOver){
                this.drag_source = true;
                this.startX = parseInt(e.offsetX);
                this.startY = parseInt(e.offsetY);
                this.drag_source_index = check.index;
            }
        }
        //check if the mouse is on the output bit
        const toggle_output_drag = (e)=>{
            let check = this.board.outputBit.allow_toggle(e.offsetX, e.offsetY)
            if(check.isOver){
                this.drag_output = true;
                this.startX = parseInt(e.offsetX);
                this.startY = parseInt(e.offsetY);
                this.drag_output_index = check.index;
            }
        }
        //move the source bit on the y axis
        const move_source = (e) =>{
            if(!this.drag_source) return;
            else{
                let mouseX = parseInt(e.offsetX);
                let mouseY = parseInt(e.offsetY);
                let dy = mouseY - this.startY;
                this.board.inputBit.bit[this.drag_source_index].y += dy;
                this.board.inputBit.bit[this.drag_source_index].pinY += dy;
                this.s_is_dragging = true;
                this.startX = mouseX;
                this.startY = mouseY;
            }
            this.board.draw(this.cntx);
        }
        //move the ouput bit on the y axis
        const move_output = (e) =>{
            if(!this.drag_output) return;
            else{
                let mouseX = parseInt(e.offsetX);
                let mouseY = parseInt(e.offsetY);
                let dy = mouseY - this.startY;
                this.board.outputBit.bit[this.drag_output_index].y += dy;
                this.board.outputBit.bit[this.drag_output_index].pinY += dy;
                this.startX = mouseX;
                this.startY = mouseY;
            }
            this.board.draw(this.cntx);
        }
        //add a source bit
        const add_source = (e) =>{

            let check = this.board.inputBit.is_on_source(e.offsetX, e.offsetY);
            if(check && this.board.inputBit.temp_bit != {}){
                this.board.inputBit.bit.push(this.board.inputBit.temp_bit);
            }
            this.board.draw(this.cntx);
        }
        //add a output bit
        const add_output = (e) =>{
            let check = this.board.outputBit.is_on_source(e.offsetX, e.offsetY);
            if(check && this.board.outputBit.temp_bit != {}){
                this.board.outputBit.bit.push(this.board.outputBit.temp_bit);
            }
            this.board.draw(this.cntx);
        }
        //add gate
        const bottom_add = (e)=>{
            this.board.bottom.is_mouse_on(e.offsetX, e.offsetY);

        }
        canvas.onmousedown = (e)=>{
            gate_rect_check(e); //check if mouse is clicked on any of the gates
            toggle_source_drag(e); //check if mouse is clicked on any of the source bits
            toggle_output_drag(e); //check if mouse is clicked on any of the output bits
            add_source(e); //add a source bit
            add_output(e); //add a output bit
            bottom_add(e); //add a gate
            this.board.menu.gate_menu(e); //gate menu
            if(e.button == 0){ 
                if(this.hasHead){
                    //work in progress, for now see comment
                    add_branch(e); //terminates wire
                }else{
                    pins(e); //start drawing wire
                }
            }
            else if(e.button == 2) {
                stop_draw_wire();
            }
        }
        canvas.onmousemove = (e)=>{
            this.currMouseX = e.offsetX;
            this.currMouseY = e.offsetY;
            moveGate(e);
            move_source(e); //move source bit
            move_output(e); //move output bit
            draw_wires();
            //add a temp source when mouse is over the source panel
            this.board.inputBit.is_mouse_on(e.offsetX, e.offsetY, this.cntx);
            this.board.outputBit.is_mouse_on(e.offsetX, e.offsetY, this.cntx);
        }
        canvas.onmouseup = (e)=>{
            this.drag_source = false;
            this.drag_output = false;
            m_drag_false(e);
            toggle_source(e);
            draw_wires();
            //turn off dragging status
            this.s_is_dragging = false; //place this after toggle_source(e)
        }
        canvas.onmouseout = (e)=>{
            m_drag_false(e);
        }
        
        //for mobile devices
        canvas.ontouchstart = (e)=>{
            gate_rect_check(e); //check if mouse is clicked on any of the gates
            toggle_source_drag(e); //check if mouse is clicked on any of the source bits
            toggle_output_drag(e); //check if mouse is clicked on any of the output bits
            add_source(e); //add a source bit
            add_output(e); //add a output bit
            bottom_add(e); //add a gate
            this.board.menu.gate_menu(e); //gate menu
            if(e.button == 0){ 
                if(this.hasHead){
                    //work in progress, for now see comment
                    add_branch(e); //terminates wire
                }else{
                    pins(e); //start drawing wire
                }
            }
            else if(e.button == 2) {
                stop_draw_wire();
            }
        }
        canvas.ontouchmove = (e)=>{
            this.currMouseX = e.offsetX;
            this.currMouseY = e.offsetY;
            moveGate(e);
            move_source(e); //move source bit
            move_output(e); //move output bit
            draw_wires();
            //add a temp source when mouse is over the source panel
            this.board.inputBit.is_mouse_on(e.offsetX, e.offsetY, this.cntx);
            this.board.outputBit.is_mouse_on(e.offsetX, e.offsetY, this.cntx);
        }
        canvas.ontouchend = (e)=>{
            this.drag_source = false;
            this.drag_output = false;
            m_drag_false(e);
            toggle_source(e);
            draw_wires();
            //turn off dragging status
            this.s_is_dragging = false; //place this after toggle_source(e)
        }


    }
    draw(context){
        this.board.draw(context);
    }

}