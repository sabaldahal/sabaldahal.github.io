import { Gate } from './gate.js';
import { Input } from './lgsinput.js';
import { Wire } from './wire.js';
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('#canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 0.9 * window.innerWidth;
    canvas.height = window.innerHeight - 200;
    console.log(canvas.height);
    console.log(canvas.width);
    class Board {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.allGate = [];
            this.gate1 = new Gate(this);
            this.gate2 = new Gate(this);
            this.gate1.text = 'Coming';
            this.gate2.text = 'Soon';
            this.gate2.color = 'blue';
            this.gate2.x += 450;
            this.gate2.y += 200;
            this.gate2.input = 4;
            this.gate2.output = 1;
            this.gate2.update();
            this.gate2.name = 'Not';
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
            //this.gate.draw(context, border_status);
            this.clear(ctx);
            for (let one of this.allGate) {
                one.draw(context);
            }
            this.wires.draw(context);
        }
    }

    const game = new Board(canvas.width, canvas.height);
    //temp
    game.wires.allWires.push({
        source : {
            x : 0,
            y : 0,
            gate_index : 0,
            io : 'out',
            pin_index : 1

        },
        destination : {
            x : 0,
            y : 0,
            gate_index : 1,
            io : 'in',
            pin_index : 0
        }
    })
    game.draw(ctx);


    //inputs outside of canvas
    const add_gate = document.querySelector('#try');
    add_gate.onclick = () => {
        game.addGate();
    }
})