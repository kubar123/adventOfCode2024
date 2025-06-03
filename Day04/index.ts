/*
--- Part Two ---

As you scan through the corrupted memory, you notice that some of the conditional statements are also still intact. If you handle some of the uncorrupted conditional statements in the program, you might be able to get an even more accurate result.

There are two new instructions you'll need to handle:

    The do() instruction enables future mul instructions.
    The don't() instruction disables future mul instructions.

Only the most recent do() or don't() instruction applies. At the beginning of the program, mul instructions are enabled.

For example:

xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))

This corrupted memory is similar to the example from before, but this time the mul(5,5) and mul(11,8) instructions are disabled because there is a don't() instruction before them. The other mul instructions function normally, including the one at the end that gets re-enabled by a do() instruction.

This time, the sum of the results is 48 (2*4 + 8*5).

Handle the new instructions; what do you get if you add up all of the results of just the enabled multiplications?


*/


//get file
const fs = require("fs");
const raw = fs.readFileSync("day04/info.txt", "utf-8");

let wordCount=0;
const targetLetters = ["X","M", "A", "S"];

//make 2d array of crossword
const crossword: string[][]=raw
      .split(/\r?\n/)
      .filter((line:string) => line.length>0)
      .map((line:string)=>line.split(""));
      

for(let row=0;row<crossword.length;row++){
    //each column...
    for (let column = 0; column < crossword[row].length; column++) {
        const letter = crossword[row][column];
        if (letter === targetLetters[0]) {
            checkIfWordExist(row,column);
            // x found - check around for letters
        }
}

}
//Answer: 2567
console.log(wordCount);



function checkIfWordExist(row: number, col: number) {
    const directions = [
        [0, 1], [0, -1], [1, 0], [-1, 0],  // Straight
        [1, 1], [1, -1], [-1, 1], [-1, -1]  // Diagonal
    ];
    
    directions.forEach(([rd, cd]) => wordCount += +isWordMatch(row, col, rd, cd));
}

function isWordMatch(row: number, col: number, rowDir: number, colDir: number): boolean {
    const endRow = row + rowDir * (targetLetters.length - 1);
    const endCol = col + colDir * (targetLetters.length - 1);
    
    if (endRow < 0 || endRow >= crossword.length || 
        endCol < 0 || endCol >= crossword[0].length) return false;
    
    for (let i = 1; i < targetLetters.length; i++) {
        if (crossword[row + i * rowDir][col + i * colDir] !== targetLetters[i]) {
            return false;
        }
    }
    return true;
}
