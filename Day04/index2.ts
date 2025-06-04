/*
--- Part Two ---

The Elf looks quizzically at you. Did you misunderstand the assignment?

Looking for the instructions, you flip over the word search to find that this isn't actually an XMAS puzzle; it's an X-MAS puzzle in which you're supposed to find two MAS in the shape of an X. One way to achieve that is like this:

M.S
.A.
M.S

Irrelevant characters have again been replaced with . in the above diagram. Within the X, each MAS can be written forwards or backwards.

Here's the same example from before, but this time all of the X-MASes have been kept instead:

.M.S......
..A..MSMS.
.M.S.MAA..
..A.ASMSM.
.M.S.M....
..........
S.S.S.S.S.
.A.A.A.A..
M.M.M.M.M.
..........

In this example, an X-MAS appears 9 times.

Flip the word search from the instructions back over to the word search side and try again. How many times does an X-MAS appear?

*/

//1. Find A
//2. Find MAS around the A?

//get file
const fs = require("fs");
const raw = fs.readFileSync("day04/info.txt", "utf-8");

let wordCount = 0;
const targetLetters = ["M", "A", "S"];
const midLetter = "A";

//make 2d array of crossword
const crossword: string[][] = raw
    .split(/\r?\n/)
    .filter((line: string) => line.length > 0)
    .map((line: string) => line.split(""));


for (let row = 0; row < crossword.length; row++) {
    //each column...
    for (let column = 0; column < crossword[row].length; column++) {
        const letter = crossword[row][column];
        if (letter === targetLetters[0]) {
            checkIfWordExist(row, column);
            // x found - check around for letters
        }
    }

}

//Answer: 2029
//wordCount will be doubled due to 'finding' the word 2 times (2 words to find the cross)
wordCount=wordCount/2;
console.log(wordCount);




// Check all 4d directions from current pos for word match
function checkIfWordExist(row: number, col: number) {
    const directions = [
        [1, 1], [1, -1], [-1, 1], [-1, -1]  // Diagonal
    ];
    // + isWordmatch converts boolean to number (1 or 0)
    directions.forEach(([rd, cd]) => wordCount += +isWordMatch(row, col, rd, cd));
}

function isInBounds(row: number, col: number): boolean {
    return row >= 0 && row < crossword.length && 
           col >= 0 && col < crossword[0].length;
}

function hasPerpendicularMatch(middleRow: number, middleCol: number, rowDir: number, colDir: number, targetLetters: string[]): boolean {
    // Perpendicular directions are [rowDir, -colDir] and [-rowDir, colDir]
    const perpDirs = [[rowDir, -colDir], [-rowDir, colDir]];
    const wordLength = targetLetters.length;

    for (const [perpRowDir, perpColDir] of perpDirs) {
        // Calculate start and end positions for perpendicular word
        const startRow = middleRow - perpRowDir;
        const startCol = middleCol - perpColDir;
        const endRow = middleRow + perpRowDir;
        const endCol = middleCol + perpColDir;

        // Check bounds for entire perpendicular word
        if (!isInBounds(startRow, startCol) || !isInBounds(endRow, endCol)) {
            continue;
        }

        // Test condition for X match found
        let matchesForward = true;
        let matchesBackward = true;

        for (let i = 0; i < wordLength; i++) {
            const currentRow = startRow + i * perpRowDir;
            const currentCol = startCol + i * perpColDir;
            const currentLetter = crossword[currentRow][currentCol];

            if (currentLetter !== targetLetters[i]) {
                matchesForward = false;
            }
            if (currentLetter !== targetLetters[wordLength - 1 - i]) {
                matchesBackward = false;
            }
        }

        if (matchesForward || matchesBackward) {
            return true; // Found cross pattern
        }
    }
    return false;
}

function isWordMatch(row: number, col: number, rowDir: number, colDir: number): boolean {
    let middleRow = -1, middleCol = -1; // Initialize with invalid values

    // Calculate bounds for early exit
    const endRow = row + rowDir * (targetLetters.length - 1);
    const endCol = col + colDir * (targetLetters.length - 1);

    if (!isInBounds(endRow, endCol)) return false;

    // Check remaining letters (skip first since we know it matches)
    for (let i = 1; i < targetLetters.length; i++) {
        const currentRow = row + i * rowDir;
        const currentCol = col + i * colDir;

        if (crossword[currentRow][currentCol] !== targetLetters[i]) {
            return false;
        }
        // Middle letter is found - store letter pos
        if (crossword[currentRow][currentCol] === midLetter) {
            middleRow = currentRow;
            middleCol = currentCol;
        }
    }

    // Check if the same word appears on the other side of the cross
    if (middleRow !== -1 && middleCol !== -1) {
        return hasPerpendicularMatch(middleRow, middleCol, rowDir, colDir, targetLetters);
    }
    return false;
}