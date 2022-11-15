import { Gate } from './gate.js';
import { Input } from './lgsinput.js';
import { Wire } from './wire.js';
import { InputBit } from './inputbit.js';
import { OutputBit } from './outputbit.js';
import { Bottom } from './bottompanel.js';
import { Menu } from './menu.js';

const ctx = canvas.getContext('2d');
export class Board {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.bottom = new Bottom(this);
        this.inputBit = new InputBit(this);
        this.inputBit.bit.push({
            x : this.inputBit.width,
            y : this.height/2.2,
            pinX : this.inputBit.width + 30,
            pinY : this.height/2.2,
            on : false
        })
        this.outputBit = new OutputBit(this);
        this.outputBit.bit.push({
            x : this.outputBit.x,
            y : this.height/2.2,
            pinX : this.outputBit.x - 30,
            pinY : this.height/2.2,
            on : false
        })
        this.allGate = [];
        this.gate1 = new Gate(this);
        //this.gate1.width = 200;
        this.gate1.update();
        this.gate2 = new Gate(this);
        this.gate1.text = 'AND';
        this.gate2.text = 'NOT';
        this.gate2.color = '#DBBBF5';
        this.gate2.x += 150;
        this.gate2.input = 1;
        this.gate2.update();
        this.gate2.name = 'Not';
        this.pinColor = '#ffffff';
        this.wires = new Wire(this);
        this.input = new Input(this);
        this.menu = new Menu(this); //deleting gates, wires, and bits
        this.allGate.push(this.gate1);
        this.allGate.push(this.gate2);

    }
    clear(context) {
        context.clearRect(0, 0, this.width, this.height);
    }

    addGate(one) {
        let gate = new Gate(this);
        gate.x = this.width/2;
        gate.y = this.height/2;
        gate.input = one.input;
        gate.output = one.output;
        gate.color = one.color;
        gate.text = one.name;
        gate.update();
        this.allGate.push(gate);
        this.draw(ctx)
    }
    
    draw(context) {
        this.clear(context);
        this.wires.calculate_signal();
        this.inputBit.draw(context);
        this.outputBit.draw(context);
        for (let one of this.allGate) {
            one.draw(context);
        }
        this.wires.draw(context);
        this.bottom.draw(context);
    }
}
