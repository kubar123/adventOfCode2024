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
const raw = fs.readFileSync("day03/info.tsv", "utf-8");


let totalValue = 0;
let counting = true;      //keep multi the numbers
type ResultEntry = [number, number] | "Don't()" | "Do()";
//regex to match all **Mul(NUMBER,NUMBER)** AND Do() or DOn't()
const regex = /mul\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)|do\(\)|don't\(\)/g;

//turn matches into 2d array for easy multi
const matches = [...raw.matchAll(regex)];
//---- Create the results Array -----
const resultArray: ResultEntry[] = matches.map(match => {
    if (match[1] !== undefined && match[2] !== undefined) {
        // It's a mul() match
        return [parseInt(match[1]), parseInt(match[2])];
    } else if (match[0] === "do()") {
        return "Do()";
    } else if (match[0] === "don't()") {
        return "Don't()";
    }
    //return for the default case
    throw new Error(`Unexpected match: ${match[0]}`);
});
// ----------------------------------

//main count
for (const item of resultArray) {
    if (item === "Don't()") {
        counting = false;
        continue;
    }
    if (item === "Do()") {
        counting = true;
        continue;
    }
    if (counting && typeof item[0] === "number" && typeof item[1] === "number") {
        totalValue += item[0] * item[1];
    }
}
console.log(totalValue)
//Answer: 76911921