export class Wire {
    off_color = "grey";
    on_color = "red";
    constructor(board) {
        this.board = board;
        this.in = [];
        this.out = [];
        this.allWires = [];
        this.allGateIndices = [];
        this.errCheck = 0;
        this.errGateIndex = [];
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

    //change the color of the wire based on its current status
    find_color(val){
        if(val) return this.on_color;
        else return this.off_color;
    }
    //updates wire index at the respective gate instances
    calc_new_index(num){
        let idx = this.board.allGate.findIndex((gate)=>gate.isIndex == num);
        return idx;
    }
    //put source bit  in the key 'source' of the dictionary
    update_array(){
        let arr = [];
        arr = this.allWires.map((wire)=>{
            if(wire.source.from_source){
                return wire;
            }else if(wire.destination.from_source){
                return{
                    source : wire.destination,
                    destination : wire.source,
                    on : wire.on
                }
            }else if(wire.source.to_output){
                return{
                    source : wire.destination,
                    destination : wire.source,
                    on : wire.on
                }
            }
            else{
                return wire;
            }
        })
        this.allWires = arr;
        this.update_index();
    }

    update_index(){
        this.board.allGate.forEach((gate)=>{
            gate.connectedWires = [];
        })
        this.board.inputBit.connectedWire = [];
        this.board.outputBit.connectedWire = [];
        let index = 0;
        let atIdx;
        for(let wire of this.allWires){
            if(wire.source.from_source){
                //save wire info in the source bit
                this.board.inputBit.connectedWire.push({
                    wireIndex : index,
                    pin_index : wire.source.pin_index
                });
                if(!wire.destination.to_output){
                    //if another end is gate save the wire info at the gate
                    atIdx = wire.destination.gate_index;
                    atIdx = this.calc_new_index(atIdx);
                    this.board.allGate[atIdx].connectedWires.push({
                        isAt : wire.destination.io,
                        wireIndex : index
                    })             
                    this.allGateIndices.push(wire.destination.gate_index);
                }else{
                    //if the other end is output save the wire info at output
                    this.board.outputBit.connectedWire.push({
                        wireIndex : index,
                        pin_index : wire.destination.pin_index
                    });
                }

            }else{
                if(wire.destination.to_output){
                    //if the destination is output
                    this.board.outputBit.connectedWire.push({
                        wireIndex : index,
                        pin_index : wire.destination.pin_index
                    });

                }else{
                    //saving wire info at the other gate
                    atIdx = wire.destination.gate_index;
                    atIdx = this.calc_new_index(atIdx);
                    this.board.allGate[atIdx].connectedWires.push({
                        isAt : wire.destination.io,
                        wireIndex : index
                    })
                    this.allGateIndices.push(wire.destination.gate_index);
                }
                //saving wire info at one of the other gates
                atIdx = wire.source.gate_index;
                atIdx = this.calc_new_index(atIdx);
                this.board.allGate[atIdx].connectedWires.push({
                    isAt : wire.source.io,
                    wireIndex : index
                })

                this.allGateIndices.push(wire.source.gate_index);
            }
            index++;
        }
        this.allGateIndices = [...new Set(this.allGateIndices)];
    }

    calculate_signal(){
        //if(this.allWires.length == 6 && this.allWires[5].on) debugger;
        let i = 0;
        let totalGateVisited = 0;
        //read the current in wires attached to the source
        // mark wires as visited
        for(let wire of this.allWires){
            wire.visited = false;
            wire.on = false;
        }
        //visit the wires connected to the source
        for(let wire of this.allWires){
            if(wire.source.from_source){
                //write to wire
                let bitStatus = this.board.inputBit.pass_bit_status(wire.source.pin_index); 
                if(bitStatus){
                    wire.on = true;
                }else{
                    wire.on = false;
                }
                this.allWires[i].visited = true;
            }
            i++;
        }// 0 gates visited here in the first iteration
        //check in each of the gate
        let allIndices = [...new Set(this.allGateIndices)];
        while(totalGateVisited < this.allGateIndices.length){
            let val;
            for(let one of allIndices){
                val = this.board.allGate[this.calc_new_index(one)].check_update_current();
                if(val){
                    totalGateVisited++;
                    allIndices = allIndices.filter((e)=> e!== one);
                }  
            }
        }

        for(let wire of this.allWires){
            if(wire.destination.to_output){
                if(wire.source.from_source){
                    this.board.outputBit.toggle_bit(wire.destination.pin_index, wire.on);
                }else{
                    wire.on = this.board.allGate[this.calc_new_index(wire.source.gate_index)].outputCurrent;
                    this.board.outputBit.toggle_bit(wire.destination.pin_index, wire.on);
                }
            }
        }
        this.errCheck = 0;
        this.errGateIndex = [];
    }
    draw(context) {
        context.lineWidth = 7;
        context.lineCap = 'round';
        this.allWires.forEach((wire)=>{
            //calculate relative position
            let posS;
            let posD;
            if(wire.source.from_source){
                posS = this.board.inputBit.pass_pin_position(wire.source.pin_index);
            }else{
                if(wire.source.to_output){
                    posS = this.board.outputBit.pass_pin_position(wire.source.pin_index);
                }else posS = this.board.allGate[this.calc_new_index(wire.source.gate_index)].pass_pin_position(wire.source.io, wire.source.pin_index);                
            }
            if(wire.destination.from_source){
                posD = this.board.inputBit.pass_pin_position(wire.destination.pin_index);
            }
            else{
                if(wire.destination.to_output){
                    posD = this.board.outputBit.pass_pin_position(wire.destination.pin_index);
                }else posD = this.board.allGate[this.calc_new_index(wire.destination.gate_index)].pass_pin_position(wire.destination.io, wire.destination.pin_index);      
            }
            context.strokeStyle = this.find_color(wire.on);
            context.beginPath();
            context.moveTo(posS.x, posS.y);
            context.lineTo(posD.x, posD.y);
            context.stroke();
        })
    }

}