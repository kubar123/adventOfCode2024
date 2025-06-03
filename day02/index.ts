/*
--- Day 2: Red-Nosed Reports ---

Fortunately, the first location The Historians want to search isn't a long walk from the Chief Historian's office.

While the Red-Nosed Reindeer nuclear fusion/fission plant appears to contain no sign of the Chief Historian, the engineers there run up to you as soon as they see you. Apparently, they still talk about the time Rudolph was saved through molecular synthesis from a single electron.

They're quick to add that - since you're already here - they'd really appreciate your help analyzing some unusual data from the Red-Nosed reactor. You turn to check if The Historians are waiting for you, but they seem to have already divided into groups that are currently searching every corner of the facility. You offer to help with the unusual data.

The unusual data (your puzzle input) consists of many reports, one report per line. Each report is a list of numbers called levels that are separated by spaces. For example:

7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9

This example data contains six reports each containing five levels.

The engineers are trying to figure out which reports are safe. The Red-Nosed reactor safety systems can only tolerate levels that are either gradually increasing or gradually decreasing. So, a report only counts as safe if both of the following are true:

    The levels are either all increasing or all decreasing.
    Any two adjacent levels differ by at least one and at most three.

In the example above, the reports can be found safe or unsafe by checking those rules:

    7 6 4 2 1: Safe because the levels are all decreasing by 1 or 2.
    1 2 7 8 9: Unsafe because 2 7 is an increase of 5.
    9 7 6 2 1: Unsafe because 6 2 is a decrease of 4.
    1 3 2 4 5: Unsafe because 1 3 is increasing but 3 2 is decreasing.
    8 6 4 4 1: Unsafe because 4 4 is neither an increase or a decrease.
    1 3 6 7 9: Safe because the levels are all increasing by 1, 2, or 3.

So, in this example, 2 reports are safe.

Analyze the unusual data from the engineers. How many reports are safe?

To begin, get your puzzle input.

*/

//get file
const fs = require("fs");
const raw = fs.readFileSync("day02/info.tsv", "utf-8");
//split
let data = parseFileTo2DIntArray(raw);

//make a new array using filtered list
data = data.filter(item => isValidated(item));


console.log(data);
console.log(data.length);



//------- Validation --------
function isValidated(report: number[]) {
    //loop - brute force check for only 1 error - inefficient
    //try deleting one item from list, and recheck list. If still issue, delete List[i] until end of list

    for (let i = -1; i < report.length; i++) {
        let isValid: boolean = false;
        //try removing an item from array, retest
        let testReport: number[] = [...report];
        if (i >= 0)
            testReport.splice(i, 1);


        //check if going up or down
        console.log("CHECK:", testReport);

        if (isGoingUp(testReport)) {
            isValid = validateGradUp(testReport);
        } else if (isGoingDown(testReport)) {
            isValid = validateGradDown(testReport);
        } else
            isValid = false;

            //if valid no need to keep checking
        if (isValid)
            return true
    }
    return false;
}



//validate the number goes up/down by 1-3
function validateGradUp(report: number[]) {
    for (let i = 1; i < report.length; i++) {
        let diff = report[i] - report[i - 1];
        if (diff > 3 || diff <= 0) {
            return false
        }
    }
    return true
}
function validateGradDown(report: number[]) {
    for (let i = 1; i < report.length; i++) {
        let diff = report[i - 1] - report[i];
        if (diff > 3 || diff <= 0) {
            return false;
        }
    }
    return true;
}




function isGoingUp(info: number[]) {
    if (info[0] < info[1])
        return true
    return false
}
function isGoingDown(info: number[]) {
    if (info[0] > info[1])
        return true
    return false
}




function parseFileTo2DIntArray(raw: string, delimiter = /\s+/): number[][] {
    return raw.trim().split('\n').map(line =>
        line.trim().split(delimiter).map(Number)
    );
}

//Answer: 493