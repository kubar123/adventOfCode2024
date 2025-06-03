/*
--- Day 4: Ceres Search ---

"Looks like the Chief's not here. Next!" One of The Historians pulls out a device and pushes the only button on it. After a brief flash, you recognize the interior of the Ceres monitoring station!

As the search for the Chief continues, a small Elf who lives on the station tugs on your shirt; she'd like to know if you could help her with her word search (your puzzle input). She only has to find one word: XMAS.

This word search allows words to be horizontal, vertical, diagonal, written backwards, or even overlapping other words. It's a little unusual, though, as you don't merely need to find one instance of XMAS - you need to find all of them. Here are a few ways XMAS might appear, where irrelevant characters have been replaced with .:

..X...
.SAMX.
.A..A.
XMAS.S
.X....

The actual word search will be full of letters instead. For example:

MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX

In this word search, XMAS occurs a total of 18 times; here's the same word search again, but where letters not involved in any XMAS have been replaced with .:

....XXMAS.
.SAMXMS...
...S..A...
..A.A.MS.X
XMASAMX.MM
X.....XA.A
S.S.S.S.SS
.A.A.A.A.A
..M.M.M.MM
.X.X.XMASX

Take a look at the little Elf's word search. How many times does XMAS appear?
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