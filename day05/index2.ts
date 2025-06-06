/*
--- Part Two ---

While the Elves get to work printing the correctly-ordered updates, you have a little time to fix the rest of them.

For each of the incorrectly-ordered updates, use the page ordering rules to put the page numbers in the right order. For the above example, here are the three incorrectly-ordered updates and their correct orderings:

    75,97,47,61,53 becomes 97,75,47,61,53.
    61,13,29 becomes 61,29,13.
    97,13,75,29,47 becomes 97,75,47,29,13.

After taking only the incorrectly-ordered updates and ordering them correctly, their middle page numbers are 47, 29, and 47. Adding these together produces 123.

Find the updates which are not in the correct order. What do you get if you add up the middle page numbers after correctly ordering just those updates?


*/
//get file
const fs = require("fs");
const raw = fs.readFileSync("day05/info.csv","utf-8");

//total value of middle number (only is they are NOT sorted)
let totalMidVal=0;

const lines:string[] = raw.trim().split('\n');
// Find where the format changes (from | to ,)
const orderRules = lines.filter(line => line.includes('|'));
const pageUpdates = lines.filter(line => line.includes(',')).map(line =>
	line.split(',').map(Number)
);

//full list - ordered.
let orderedPageList:number[][]=[];

//orderRules in sorted into map
const sortedOrderRules = new Map<number, Set<number>>();


//populate the rules
for(let i=0;i<orderRules.length;i++){
	const parts = orderRules[i].split('|').map(Number); // Split and convert to numbers
	addRule(parts[0], parts[1]);
}

//sort the data line by line (each update)
for(let i=0;i<pageUpdates.length;i++){
	const sortedLine = sortData(pageUpdates[i]);
    orderedPageList.push(sortedLine);
}

//===================================================
console.log(totalMidVal);
//Answer: 4030
// ==================================================



function sortData(pageLine: number[]):number[] {   
    // Create a copy to sort
    const sorted = [...pageLine];

    // Custom comparator using the rules
    sorted.sort((a, b) => {
        // If a must come before b according to rules
        if (sortedOrderRules.get(a)?.has(b)) {
			return -1; // a comes first
        }
        if (sortedOrderRules.get(b)?.has(a)) {
			return 1; // b comes first
        }
        return 0;
    });


	//was the update (array) sorted
	const wasSorted = pageLine.every((val, index) => val === sorted[index]);
	//get the middle number, and add it to the total midValue counter
	if (!wasSorted) {
        totalMidVal += sorted[Math.floor(sorted.length / 2)];
    }
	// DEBUG: 
	console.log(wasSorted+"__"+sorted[(sorted.length-1)/2]);
    //console.log('Sorted to:', sorted);
	return sorted;
	}

//populate rule map
function addRule(beforePage: number, afterPage: number) {
	if (!sortedOrderRules.has(beforePage)) {
		sortedOrderRules.set(beforePage, new Set());
	}
	sortedOrderRules.get(beforePage)!.add(afterPage);
}