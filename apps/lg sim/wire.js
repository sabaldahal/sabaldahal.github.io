export class Wire {
    constructor(board) {
        this.board = board;
        this.in = [];
        this.out = [];
        this.allWires = [];
    }
    addToPin(val){
        this.allWires.push(val);
    }
    has_wire_attached(x1,y1,x2,y2){
        let distance = Math.sqrt(((x2-x1)**2) + ((y2-y1)**2));
        if(distance < this.board.Gate.radius){
            return true;
        }
        return false;
    }
    update() {

    }
    draw(context) {
        context.lineWidth = 10;
        context.lineCap = 'round';
        context.strokeStyle = 'grey';
        this.allWires.forEach((wire)=>{
            //calculate relative position
            let posS;
            let posD;
            posS = this.board.allGate[wire.source.gate_index].pass_pin_position(wire.source.io, wire.source.pin_index);
            posD = this.board.allGate[wire.destination.gate_index].pass_pin_position(wire.destination.io, wire.destination.pin_index);
            
            context.beginPath();
            context.moveTo(posS.x, posS.y);
            context.lineTo(posD.x, posD.y);
            context.stroke();
        })
    }

}