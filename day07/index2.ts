/*--- Day 7: Bridge Repair ---
--- Part Two ---

The engineers seem concerned; the total calibration result you gave them is nowhere close to being within safety tolerances. Just then, you spot your mistake: some well-hidden elephants are holding a third type of operator.

The concatenation operator (||) combines the digits from its left and right inputs into a single number. For example, 12 || 345 would become 12345. All operators are still evaluated left-to-right.

Now, apart from the three equations that could be made true using only addition and multiplication, the above example has three more equations that can be made true by inserting operators:

    156: 15 6 can be made true through a single concatenation: 15 || 6 = 156.
    7290: 6 8 6 15 can be made true using 6 * 8 || 6 * 15.
    192: 17 8 14 can be made true using 17 || 8 + 14.

Adding up all six test values (the three that could be made before using only + and * plus the new three that can now be made by also using ||) produces the new total calibration result of 11387.

Using your new knowledge of elephant hiding spots, determine which equations could possibly be true. What is their total calibration result?

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
    Multi = 1,
    Concat=2
}

function solvePuzzle(puzzle: number[]): string | null {
    const target = puzzle[0];
    const nums = puzzle.slice(1);
    const numOperators = nums.length - 1;
    
    //i will give a bin represenation of the total amount of possible combinations
    // converted to BASE 3
    for (let i = 0; i < Math.pow(3,numOperators); i++) {
        //list of all different Operator combinations
        const operators: OperatorType[] = [];

        //loop through EACH number until length-1 is reached (all possible options)
        for (let pos = 0; pos < numOperators; pos++) {
            // Convert i to BASE 3, extract each Num
            const op =Math.floor(i/Math.pow(3,pos))%3;
            operators.push(op as OperatorType);
        }
        
        // test Left -> right
        let result = nums[0];
        for (let z = 0; z < operators.length; z++) {
            if (operators[z] === OperatorType.Add){
                result += nums[z + 1];
            }else if(operators[z]===OperatorType.Multi){
                result *= nums[z + 1];
            }else{
                //concat numbers (as string)
                result=parseInt(""+result+nums[z+1]);
            }
        }
        
        //=====found solution======
        if (result === target) {
            //ADD sum to TOTAL
            totalCount+=target;

            //format solution to look nicely
            const equationParts: string[] = [nums[0].toString()];
            operators.forEach((op, index) => {
                let opSymbol;
                if(op===OperatorType.Add)
                    opSymbol='+';
                else if(op===OperatorType.Multi)
                    opSymbol='*';
                else
                    opSymbol="||";
                
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

//============ANSWER  248427118972289  =============
console.log("Total:" +totalCount)