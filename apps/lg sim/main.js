import { Gate } from './gate.js';
import { Input } from './lgsinput.js';
import { Wire } from './wire.js';
import { InputBit } from './inputbit.js';
import { OutputBit } from './outputbit.js';

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('#canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth -6;
    canvas.height = window.innerHeight - 200;
    class Board {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.inputBit = new InputBit(this);
            this.outputBit = new OutputBit(this);
            this.allGate = [];
            this.gate1 = new Gate(this);
            this.gate1.width = 200;
            this.gate1.update();
            this.gate2 = new Gate(this);
            this.gate1.text = 'Coming';
            this.gate2.text = 'Soon';
            this.gate2.color = 'blue';
            this.gate2.x += 450;
            this.gate2.y += 200;
            this.gate2.input = 1;
            this.gate2.update();
            this.gate2.name = 'Not';
            this.pinColor = '#ffffff';
            this.wires = new Wire(this);
            this.input = new Input(this);
            this.allGate.push(this.gate1);
            this.allGate.push(this.gate2);

        }
        clear(context) {
            context.clearRect(0, 0, this.width, this.height);
        }

        addGate() {
            let gate = new Gate(this);
            gate.x = 0;
            gate.y = 0;
            gate.update();
            gate.color = 'yellow';
            this.allGate.push(gate);
            this.draw(ctx)
        }
        
        draw(context) {
            this.clear(context);
            this.wires.draw(context);
            this.inputBit.draw(context);
            this.outputBit.draw(context);
            for (let one of this.allGate) {
                one.draw(context);
            }

        }
    }

    const game = new Board(canvas.width, canvas.height);

    game.draw(ctx);


    //inputs outside of canvas
    const add_gate = document.querySelector('#try');
    add_gate.onclick = () => {
        game.addGate();
    }
})