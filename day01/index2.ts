/*
--- Part Two ---

Your analysis only confirmed what everyone feared: the two lists of location IDs are indeed very different.

Or are they?

The Historians can't agree on which group made the mistakes or how to read most of the Chief's handwriting, but in the commotion you notice an interesting detail: a lot of location IDs appear in both lists! Maybe the other numbers aren't location IDs at all but rather misinterpreted handwriting.

This time, you'll need to figure out exactly how often each number from the left list appears in the right list. Calculate a total similarity score by adding up each number in the left list after multiplying it by the number of times that number appears in the right list.

Here are the same example lists again:

3   4
4   3
2   5
1   3
3   9
3   3

For these example lists, here is the process of finding the similarity score:

    The first number in the left list is 3. It appears in the right list three times, so the similarity score increases by 3 * 3 = 9.
    The second number in the left list is 4. It appears in the right list once, so the similarity score increases by 4 * 1 = 4.
    The third number in the left list is 2. It does not appear in the right list, so the similarity score does not increase (2 * 0 = 0).
    The fourth number, 1, also does not appear in the right list.
    The fifth number, 3, appears in the right list three times; the similarity score increases by 9.
    The last number, 3, appears in the right list three times; the similarity score again increases by 9.

So, for these example lists, the similarity score at the end of this process is 31 (9 + 4 + 0 + 0 + 9 + 9).

Once again consider your left and right lists. What is their similarity score?

*/

/*
1. lNum * # of times in rNum list
*/

//get file
const fs = require("fs");
const raw = fs.readFileSync("day01/info.tsv","utf-8");
//split it based on space
//const fileNumbers = raw.split("\n").map(line => line.trim().split("/\s+/"));
const lines=raw.split(/\r?\n/);
const lNums:number[]=[];
const rNums:number[]=[];

//the total off
let totalSimScore=0;

//split into 2 lists for comparisons
lines.forEach((line :string) => {
    const [l, r] = line.trim().split(/\s+/).map(Number);
    lNums.push(l);
    rNums.push(r);
});



for(let i=0;i<lNums.length;i++){
    let lookingNo=lNums[i];

  //find the amount of times it is found
    let noQty=rNums.filter(num=>num===lookingNo).length;

    totalSimScore+=lookingNo*noQty;  
}

console.log(totalSimScore);
//answer: 22776016