export class Bottom{
    constructor(board){
        this.board = board;
        this.width = this.board.width;
        this.height = 50;
        this.x = 0;
        this.y = this.board.height - this.height;
        this.color = 'black';
        this.gateWidth = 70;
        this.gateHeight = this.height - 10;
        this.availGates = [{
            name : 'AND',
            input : 2,
            output : 1,
            color : 'red',
            x : this.x + 5 + (0 * this.gateWidth), //general formula: this.x + 5*current array length + 1 +(currArray length * this.gateWidth) 
            y : this.y + 5,
            algo : null
        },{
            name : 'NOT',
            input : 1,
            output : 1,
            color : 'blue',
            x : this.x + 10 + (1 * this.gateWidth ),
            y : this.y + 5,
            algo : null
        }] //list of available gates

    }

    is_mouse_on(mouseX, mouseY){
        for(let one of this.availGates){
            if(mouseX > one.x && mouseX < one.x + this.gateWidth && mouseY > one.y && mouseY < one.y + this.gateHeight){
                this.board.addGate(one);
            }
        }
    }

    draw_gates(context){
        for(let one of this.availGates){
            context.fillStyle = one.color;
            context.fillRect(one.x, one.y, this.gateWidth, this.gateHeight);
            context.fillStyle = 'white';
            context.font = "20px serif";
            context.fillText(one.name, one.x +10, this.y + this.height/1.5, this.gateWidth);  
        }
    }

    draw(context){
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y,this.width, this.height);
        this.draw_gates(context);
    }
}