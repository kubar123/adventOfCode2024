/*---- Day 8: Resonant Collinearity ---

You find yourselves on the roof of a top-secret Easter Bunny installation.

While The Historians do their thing, you take a look at the familiar huge antenna. Much to your surprise, it seems to have been reconfigured to emit a signal that makes people 0.1% more likely to buy Easter Bunny brand Imitation Mediocre Chocolate as a Christmas gift! Unthinkable!

Scanning across the city, you find that there are actually many such antennas. Each antenna is tuned to a specific frequency indicated by a single lowercase letter, uppercase letter, or digit. You create a map (your puzzle input) of these antennas. For example:

............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............

The signal only applies its nefarious effect at specific antinodes based on the resonant frequencies of the antennas. In particular, an antinode occurs at any point that is perfectly in line with two antennas of the same frequency - but only when one of the antennas is twice as far away as the other. This means that for any pair of antennas with the same frequency, there are two antinodes, one on either side of them.

So, for these two antennas with frequency a, they create the two antinodes marked with #:

..........
...#......
..........
....a.....
..........
.....a....
..........
......#...
..........
..........

Adding a third antenna with the same frequency creates several more antinodes. It would ideally add four antinodes, but two are off the right side of the map, so instead it adds only two:

..........
...#......
#.........
....a.....
........a.
.....a....
..#.......
......#...
..........
..........

Antennas with different frequencies don't create antinodes; A and a count as different frequencies. However, antinodes can occur at locations that contain antennas. In this diagram, the lone antenna with frequency capital A creates no antinodes but has a lowercase-a-frequency antinode at its location:

..........
...#......
#.........
....a.....
........a.
.....a....
..#.......
......A...
..........
..........

The first example has antennas with two different frequencies, so the antinodes they create look like this, plus an antinode overlapping the topmost A-frequency antenna:

......#....#
...#....0...
....#0....#.
..#....0....
....0....#..
.#....A.....
...#........
#......#....
........A...
.........A..
..........#.
..........#.

Because the topmost A-frequency antenna overlaps with a 0-frequency antinode, there are 14 total unique locations that contain an antinode within the bounds of the map.

Calculate the impact of the signal. How many unique locations within the bounds of the map contain an antinode?

*/
//get file
const fs = require("fs");
const raw = fs.readFileSync("day08/info.txt", "utf-8");

//list of all 'anti nodes'
const antinodeSet = new Set<string>();

const mainMap: string[][] = raw
	.split(/\r?\n/)
	.filter((line: string) => line.length > 0)
	.map((line: string) => line.split(""));

//populate the unique list
const uniqueAntenna=new Set<string>();
for (const row of mainMap) {
    for (const char of row) {
        if (/[a-zA-Z0-9]/.test(char))//Lower/upper case and numbers ONLY
            uniqueAntenna.add(char);
    }
}

//map of all items
const foundItems=new Map();
for(let row=0;row<mainMap.length;row++){
	for(let col=0;col<mainMap[row].length;col++){
		//get char
		let char=mainMap[row][col];
		//ignore empty fields
		if(char===".")
			continue;;

		//make a set of everything found
		if(foundItems.has(char)){
			foundItems.get(char).push([row,col]);
		}else{
			foundItems.set(char,[[row,col]]);
		}
	}
}

//calc the positions and mark on map
function calcLocations(foundItems: Map<any, any>) {
	foundItems.forEach((pos,freq)=>{
		console.log(pos+" <=== "+freq);

		for(let i=0;i<pos.length;i++){
			for(let z=i+1;z<pos.length;z++){

				let offset=[0,0];
				if(pos[z]===undefined)
					return;
				offset=getDistanceOffset(pos[i],pos[z]);
				addMarkToSet(pos[i],pos[z],offset);
			}
		}
		console.log('end')
	});
}


function addMarkToSet(firstArray:number[],secondArray:number[], offset:number[]){
	//Array of the main position with offset
	let mainPos=[firstArray[0]-offset[0],firstArray[1]-offset[1]];
	let secPos=secondArray?[secondArray[0]+offset[0],secondArray[1]+offset[1]]:undefined;


	// returnedArray=[[mainPosf,mainPosS],[secPosf,secPosS]];
	// console.log("________________ Marking on map:"+returnedArray)

	if(isValidPosition(mainPos)){
		antinodeSet.add(mainPos+"");
	}
	if(secPos!==undefined){
		if(isValidPosition(secPos)){
			antinodeSet.add(secPos+"");
		}
	}		
}

//calc difference in distance
function getDistanceOffset(origNum: number[], nextNum: number[]): number[] {
	console.log(origNum+" _ "+nextNum);
    let offsetArray= origNum.map((value: number, index: number) => nextNum[index] - value);
	console.log("OFFSET: "+offsetArray);
	return offsetArray;
}

//see if pos is valid on map
function isValidPosition(currPos: number[]): boolean {
	let row=currPos[0]
	let col=currPos[1]
	return row >= 0 && row < mainMap.length && col >= 0 && col < mainMap[0].length;
}

calcLocations(foundItems);
console.log(mainMap);
//=================== ANSWER = 348 ==================
console.log("Total unique: " + antinodeSet.size);