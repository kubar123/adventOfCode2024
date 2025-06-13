/*---- Day 8: Resonant Collinearity ---
--- Part Two ---

Watching over your shoulder as you work, one of The Historians asks if you took the effects of resonant harmonics into your calculations.

Whoops!

After updating your model, it turns out that an antinode occurs at any grid position exactly in line with at least two antennas of the same frequency, regardless of distance. This means that some of the new antinodes will occur at the position of each antenna (unless that antenna is the only one of its frequency).

So, these three T-frequency antennas now create many antinodes:

T....#....
...T......
.T....#...
.........#
..#.......
..........
...#......
..........
....#.....
..........

In fact, the three T-frequency antennas are all exactly in line with two antennas, so they are all also antinodes! This brings the total number of antinodes in the above example to 9.

The original example now has 34 antinodes, including the antinodes that appear on every antenna:

##....#....#
.#.#....0...
..#.#0....#.
..##...0....
....0....#..
.#...#A....#
...#..#.....
#....#.#....
..#.....A...
....#....A..
.#........#.
...#......##

Calculate the impact of the signal using this updated model. How many unique locations within the bounds of the map contain an antinode?

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
	});
}


function addMarkToSet(firstArray:number[],secondArray:number[], offset:number[]){
	//currOffset increases on loop
    let currOffset=offset.slice();
    let mainPos,secPos;
	//antinode on top of antenna
	antinodeSet.add(firstArray+"");
    antinodeSet.add(secondArray+"");
    do{
        mainPos=[firstArray[0]-currOffset[0],firstArray[1]-currOffset[1]];
        secPos=secondArray?[secondArray[0]+currOffset[0],secondArray[1]+currOffset[1]]:undefined;

        if(isValidPosition(mainPos)){
            antinodeSet.add(mainPos+"");
        }
        if(secPos!==undefined){
            if(isValidPosition(secPos)){
                antinodeSet.add(secPos+"");
            }
        }
		//go to next antinode placement location (continue line)
        currOffset[0]+=offset[0];
        currOffset[1]+=offset[1];
    }while(isValidPosition(mainPos)||isValidPosition(secPos))
}

//calc difference in distance
function getDistanceOffset(origNum: number[], nextNum: number[]): number[] {
	console.log(origNum+" _ "+nextNum);
    let offsetArray= origNum.map((value: number, index: number) => nextNum[index] - value);
	console.log("OFFSET: "+offsetArray);
	return offsetArray;
}

//see if pos is valid on map
function isValidPosition(currPos: number[]|undefined): boolean {
	if(!currPos) return false;
	let row=currPos[0]
	let col=currPos[1]
	return row >= 0 && row < mainMap.length && col >= 0 && col < mainMap[0].length;
}

calcLocations(foundItems);
//=================== ANSWER = 1221 ==================
console.log("Total unique: " + antinodeSet.size);