export class Gate{
    //color on click
    click_color = '#787878';
    static id = -1;
    isIndex;
    //radius of io pins
    radius = 8.00;
    constructor(Board,x=0,y=0){
        this.board = Board;
        this.name = 'And';
        this.text = '';
        this.input = 3;     //no. of input pins
        this.output = 2;    //no. of ouput pins
        this.i = [];        //input pins, location
        this.o = [];        //output pins, location
        this.width = 200;   //width of gate
        this.height = 100;  //height of gate
        this.color = 'red'; //color of gate
        this.x = this.board.width/6;                  //this gate x location
        this.y = this.board.height/22;   //this gate y location
        this.hasBorder = false;
        this.add_inputs();
        this.add_outputs();
        this.isIndex = ++Gate.id;
    }
    //initialize the position of inputs
    add_inputs(){
        let displace = 0;
        for(let idx=0; idx<this.input; idx++){
            displace += ((1/(this.input+1))*this.height);
            this.i.push({
                x: this.x,
                y: this.y + displace
            })
        }
    }
    //initialize the position of outputs
    add_outputs(){
        let displace = 0;
        for(let idx=0; idx<this.output; idx++){
            displace += ((1/(this.output+1))*this.height);
            this.o.push({
                x: this.x + this.width,
                y: this.y + displace
            })
        }
    }

    //check if mouse is over pins
    is_mouse_on_pin(mouseX,mouseY){
        let ix = 0;
        for(let one of this.i){
            let distance = Math.sqrt(((mouseX-one.x)**2) + ((mouseY-one.y)**2));
            if(distance < this.radius){
                return {
                    x : one.x,
                    y : one.y,
                    gate_index : this.isIndex,
                    io : 'in',
                    pin_index : ix

                };
            }
            ix++
        }
        ix=0;
        for(let one of this.o){
            let distance = Math.sqrt(((mouseX-one.x)**2) + ((mouseY-one.y)**2));
            if(distance < this.radius){
                return {
                    x : one.x,
                    y : one.y,
                    gate_index : this.isIndex,
                    io : 'out',
                    pin_index : ix
                };
            }
            ix++;
        }
        return null;
    }
    pass_pin_position(val, ix){
        if(val=='in'){
            return ({
                x : this.i[ix].x,
                y : this.i[ix].y
            })
        }else if(val == 'out'){
            return ({
                x : this.o[ix].x,
                y : this.o[ix].y
            })
        }
    }
    //erase canvas completely
    clear(context){
        context.clearRect(0,0, this.board.width, this.board.height);
    }
    //check if mouse is over the gate
    is_mouse_over(startX,startY){
        if((startX > this.x) && (startX < this.x + this.width)
        && startY > this.y && startY < this.y + this.height){
            return true;
        }
        return false;
    }
    //check if object is touching the canvas boundary
    checkBoundary(){
        //creating boundaries
        if(this.x < 0) {this.x = 0};
        if(this.x > this.board.width - this.width) this.x = this.board.width - this.width;
        if(this.y < 0) this.y = 0;
        if(this.y > this.board.height - this.height) this.y = this.board.height - this.height;
    }
    //draw the input pins
    input_bit(context){
        let circle = new Path2D();
        context.fillStyle = 'white';
        let displace = 0;
        this.i.forEach(one => {
            circle.arc(one.x, one.y, this.radius, 0, 2 * Math.PI); 
            context.fill(circle);
        });        
    }
    //draw the ouput pins
    output_bit(context){
        let circle = new Path2D();
        context.fillStyle = 'white';
        let displace = 0;
        this.o.forEach(one => {
            circle.arc(one.x, one.y, this.radius, 0, 2 * Math.PI); 
            context.fill(circle);
        });

    }
    //change the position of the pins in correspondance to gate's position
    update_pins(){
        this.i = [];
        this.o = [];
        this.add_inputs();
        this.add_outputs();
    }
    //updates x and y position
    update(cx=0,cy=0){
        this.x += cx;
        this.y += cy;
        this.update_pins();
    }
    //change the status of the current gate when clicked or unclicked
    status(context){
        this.checkBoundary();
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y,this.width,this.height);
        context.fillStyle = '#2ae39c';
        context.font = "30px Arial";
        context.fillText(this.text, this.x+this.width/5, this.y+this.height/2)
        this.input_bit(context);
        this.output_bit(context);
    }
    draw(context){
        if(this.hasBorder){
            this.checkBoundary();
            //adding stroke on click
            context.lineWidth = 20;
            context.strokeStyle = this.click_color;
            context.strokeRect(this.x,this.y,this.width,this.height)
        }
        this.status(context);
    }
}