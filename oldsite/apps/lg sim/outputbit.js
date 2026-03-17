import { InputBit } from './inputbit.js';

export class OutputBit extends InputBit{
    constructor(board){
        super(board);
        this.x = this.board.width - this.width;
    }
    //build every block of source bits
    build_block(context, one, index=null){
        context.strokeStyle = this.off_color;
        context.lineWidth = 5;
        context.lineCap = 'round';
        context.beginPath();
        context.moveTo(one.x - this.big_radius,one.y);
        context.lineTo(one.pinX, one.pinY);
        context.stroke();
        context.fillStyle = this.status(index);
        context.arc(one.x, one.y, this.big_radius, 0, 2 * Math.PI); 
        context.fill();
        context.beginPath();
        context.fillStyle = this.board.pinColor;
        context.arc(one.pinX, one.pinY, this.small_radius, 0, 2 * Math.PI);
        context.fill();
        context.beginPath();
    }
    //check if the mouse is hovering on this class
    is_mouse_on(mouseX, mouseY, context){
        if(this.allow_toggle(mouseX, mouseY).isOver == false && mouseX < this.x + this.width && mouseX > this.x && mouseY < this.height && mouseY > 0){
            //draw transparent source
            this.temp_bit = {
                x : this.x,
                y : mouseY,
                pinX : this.x - 30,
                pinY : mouseY,
                on : false
            }
            context.globalAlpha = this.transparency;
            this.build_block(context, this.temp_bit);
            context.globalAlpha = 1.0;
        }
        else this.temp_bit = {};
    }

    //checks if the mouse is over the source panel
    is_on_source(mouseX, mouseY){
        if(mouseX < this.x + this.width && mouseX > this.x && mouseY < this.height && mouseY > 0){
            return true;
        }
        return false;
    }
    //check if the mouse is on source pin
    is_mouse_on_pin(mouseX,mouseY){
        let ix = 0;
        for(let one of this.bit){
            let distance = Math.sqrt(((mouseX-one.pinX)**2) + ((mouseY-one.pinY)**2));
            if(distance < this.small_radius){
                return {
                    x : one.pinX,
                    y : one.pinY,
                    from_source : false,
                    to_output : true,
                    pin_index : ix,
                    on : false

                };
            }
            ix++
        }
        return null;
    }

    toggle_bit(pin_idx, on_status){
        this.bit[pin_idx].on = on_status;
    }


}