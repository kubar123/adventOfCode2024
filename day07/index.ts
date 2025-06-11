/*--- Day 7: Bridge Repair ---

The Historians take you to a familiar rope bridge over a river in the middle of a jungle. The Chief isn't on this side of the bridge, though; maybe he's on the other side?

When you go to cross the bridge, you notice a group of engineers trying to repair it. (Apparently, it breaks pretty frequently.) You won't be able to cross until it's fixed.

You ask how long it'll take; the engineers tell you that it only needs final calibrations, but some young elephants were playing nearby and stole all the operators from their calibration equations! They could finish the calibrations if only someone could determine which test values could possibly be produced by placing any combination of operators into their calibration equations (your puzzle input).

For example:

190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20

Each line represents a single equation. The test value appears before the colon on each line; it is your job to determine whether the remaining numbers can be combined with operators to produce the test value.

Operators are always evaluated left-to-right, not according to precedence rules. Furthermore, numbers in the equations cannot be rearranged. Glancing into the jungle, you can see elephants holding two different types of operators: add (+) and multiply (*).

Only three of the above equations can be made true by inserting operators:

    190: 10 19 has only one position that accepts an operator: between 10 and 19. Choosing + would give 29, but choosing * would give the test value (10 * 19 = 190).
    3267: 81 40 27 has two positions for operators. Of the four possible configurations of the operators, two cause the right side to match the test value: 81 + 40 * 27 and 81 * 40 + 27 both equal 3267 (when evaluated left-to-right)!
    292: 11 6 16 20 can be solved in exactly one way: 11 + 6 * 16 + 20.

The engineers just need the total calibration result, which is the sum of the test values from just the equations that could possibly be true. In the above example, the sum of the test values for the three equations listed above is 3749.

Determine which equations could possibly be true. What is their total calibration result?

*/
//get file
const fs = require("fs");
const raw = fs.readFileSync("day07/info.txt","utf-8");

const numbers = raw.split('\n').map((line:string) => 
  line.match(/\d+/g)?.map(Number) || []
);
//SUM of all solvable puzzles
let totalCount=0;

enum OperatorType {
    Add = 0,
    Multi = 1
}

function solvePuzzle(puzzle: number[]): string | null {
    const target = puzzle[0];
    const nums = puzzle.slice(1);
    const numOperators = nums.length - 1;
    
    //i will give a bin represenation of the total amount of possible combinations
    for (let i = 0; i < (1 << numOperators); i++) {
        //list of all different Operator combinations
        const operators: OperatorType[] = [];

        //loop through EACH binary number until length-1 is reached (all possible options)
        for (let pos = 0; pos < numOperators; pos++) {
            // Convert i to binary, extract each bit
            const bit = (i >> pos) & 1;
            operators.push(bit as OperatorType);
        }
        
        // test Left -> right
        let result = nums[0];
        for (let z = 0; z < operators.length; z++) {
            if (operators[z] === OperatorType.Add){
                result += nums[z + 1];
            }else{
                result *= nums[z + 1];
            }
        }
        
        //=====found solution======
        if (result === target) {
            //ADD sum to TOTAL
            totalCount+=target;

            //format solution to look nicely
            const equationParts: string[] = [nums[0].toString()];
            operators.forEach((op, index) => {
                const opSymbol= (op===OperatorType.Add ? '+':'*');
                equationParts.push(opSymbol,nums[index+1].toString());
            });
            return `${equationParts.join(' ')}=${target}`
        }
    }
    
    return null; // No solution found
}

// Solve all puzzles
numbers.forEach((puzzle: number[], index: number) => {
    const solution = solvePuzzle(puzzle);
    
    console.log(`Puzzle ${index + 1}: ${solution || 'Not Found'}`);
    console.log(puzzle);
});

//============ANSWER  1298300076754 =============
console.log("Total:" +totalCount)