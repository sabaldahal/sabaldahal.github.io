export class InputBit{
    bg_color = '#284B63';
    off_color = '#525252';
    on_color = 'red';
    big_radius = 15;
    small_radius = 7.0;
    constructor(board){
        this.board = board;
        this.height = this.board.height - this.board.bottom.height;
        this.width = 0.05 * this.board.width;
        this.transparency = 0.8;
        this.x = 0;
        this.y = 0;
        this.color = 'red';
        this.isOn = false;
        this.hover = true;
        //contains data for test purposes
        this.bit = [];
        this.temp_bit = {};
        this.connectedWire = [];
    }
    //pass the position of the updated pin
    pass_pin_position(ix){
        return{
            x : this.bit[ix].pinX,
            y : this.bit[ix].pinY
        }
    }
    //pass status of source bit
    pass_bit_status(idx){
        return this.bit[idx].on;
    }
    //set the status of a source bit
    status(idx){
        if(idx == null) return this.off_color;
        if(this.bit[idx].on) return this.on_color;
        else return this.off_color;
    }
    //build every block of source bits
    build_block(context, one, index=null){
        context.strokeStyle = this.off_color;
        context.lineWidth = 5;
        context.lineCap = 'round';
        context.beginPath();
        context.moveTo(one.x + this.big_radius,one.y);
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
    //draw all the active source bits
    draw_bit(context){
        let index = 0;
        this.bit.forEach(one => {
            this.build_block(context, one, index);
            index++;
        });        
    }

    //check if the mouse is hovering on this class
    is_mouse_on(mouseX, mouseY, context){
        if(this.allow_toggle(mouseX, mouseY).isOver == false && mouseX < this.width && mouseX > 0 && mouseY < this.height && mouseY > 0){
            //draw transparent source
            this.temp_bit = {
                x : this.width,
                y : mouseY,
                pinX : this.width + 30,
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
        if(mouseX < this.width && mouseX > 0 && mouseY < this.height && mouseY > 0){
            return true;
        }
        return false;
    }
    //checks if the mouse is over the source bit
    allow_toggle(mouseX, mouseY){
        let idx = 0;
        for(let one of this.bit){
            let distance = Math.sqrt(((mouseX-one.x)**2) + ((mouseY-one.y)**2));
            if(distance < this.big_radius){
                return {
                    index : idx,
                    isOver : true
                };
            }
            idx++;
        }
        return {
            index : null,
            isOver : false
        };
    }
    //check to switch the bit on or off
    is_mouse_on_bit(mouseX, mouseY){
        let check = this.allow_toggle(mouseX, mouseY)
        if(check.isOver) this.bit[check.index].on = !this.bit[check.index].on;
        //if(this.bit[check.index].on) debugger;

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
                    from_source : true,
                    to_output : false,
                    pin_index : ix,
                    on : false

                };
            }
            ix++
        }
        return null;
    }
    
    draw(context){
        //background
        context.fillStyle = this.bg_color;
        context.fillRect(this.x,this.y,this.width,this.height);
        //draw inputs
        this.draw_bit(context);
    }
}