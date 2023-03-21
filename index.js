const args = process.argv.slice(2);
const prompt = require("prompt-sync")({ sigint: true });
const crypto = require('crypto');
const Table = require('cli-table'); 

class GenerateKey {
    computerMove(args) {
        this.moves = args;
        this.generatedComputerMove = Math.round(Math.random() * this.moves.length - 1);
        this.generatedRandomHmac = this.generateHMAC();
        this.computerHMACKey = crypto.createHash('SHA3-256', this.generatedRandomHmac).update(this.generatedComputerMove.toString()).digest('hex');
    }

    generateHMAC() {
        return crypto.createHash('SHA3-256').update(crypto.randomBytes(256).toString("hex")).digest("hex");
    }
}

class GeneratedTableHelp extends GenerateKey {
    generateTable() {
        console.log('Explanation:');

        const table = new Table({
            head: ["User/Computer", ...this.moves],
        });

        const arr = [];

        for (let i = 0; i < this.moves.length; ++i) {
            const newArr = [];
            newArr.push(this.moves[i]);
            arr.push(newArr);
        }
        const winSituation = ['win', 'draw', 'lose'];

        for (let i = 0; i < this.moves.length; ++i) {
            for (let j = 0; j < this.moves.length; ++j) {
                const mathRandom = Math.round(Math.random() * 2);
                arr[i][j + 1] = winSituation[mathRandom];
            }
        }

        table.push(
            ...arr
        );

        console.log(table.toString());
    }
}

class WhoWin extends GeneratedTableHelp {

    checkMovesValidity() {
        if (this.moves.length % 2 === 0 || new Set(this.moves).size !== this.moves.length) {
            console.log("Example usage: node rps.js rock paper scissors, elements shouldn't be repetitive");
            process.exit(1);
        }
    }

    showMoves() {
        console.log('Available moves:');
        for (let i = 0; i < this.moves.length; ++i) {
            console.log(i + 1, '-', this.moves[i]);
        }
    }

    showOptions() {
        console.log(0, '-', 'exit');
        console.log('?', '-', 'help');
    }

    userMoveValidity(userMove) {

        if (userMove == "?") {
            this.generateTable();
            process.exit(1);
        }

        if (userMove == 0) {
            console.log('you exited from game');
            process.exit(1);
        }

        if (userMove > this.moves.length || userMove < 0) {
            console.log('invalid move')
            console.log(`Example usage: node rps.js rock paper scissors, your move shouldn't be more than ${this.moves.length}`);
            process.exit(1);
        }
    }

    showWinner(enteredMove) {
        console.log(`Your move: ${this.moves[enteredMove - 1]}`);
        console.log(`Computer move: ${this.moves[this.generatedComputerMove - 1]}`);

        if (enteredMove === this.generatedComputerMove) {
            console.log('draw')
        } else if (enteredMove > this.generatedComputerMove) {
            console.log('you win!')
        } else {
            console.log('computer win!');
        }
    }

    determineWinner() {
        console.log(`HMAC: ${this.generatedRandomHmac}`)
        this.showMoves();
        this.showOptions();
        const enteredMove = prompt("Enter your move: ")
        this.userMoveValidity(enteredMove.trim());
        this.showWinner(enteredMove, this.generatedComputerMove);

        console.log(`HMAC key: ${this.computerHMACKey}`);
    }
}

const whowin = new WhoWin();
whowin.computerMove(args)
whowin.checkMovesValidity()
whowin.determineWinner() 


