/*
--- Day 9: Disk Fragmenter ---
--- Part Two ---

Upon completion, two things immediately become clear. First, the disk definitely has a lot more contiguous free space, just like the amphipod hoped. Second, the computer is running much more slowly! Maybe introducing all of that file system fragmentation was a bad idea?

The eager amphipod already has a new plan: rather than move individual blocks, he'd like to try compacting the files on his disk by moving whole files instead.

This time, attempt to move whole files to the leftmost span of free space blocks that could fit the file. Attempt to move each file exactly once in order of decreasing file ID number starting with the file with the highest file ID number. If there is no span of free space to the left of a file that is large enough to fit the file, the file does not move.

The first example from above now proceeds differently:

00...111...2...333.44.5555.6666.777.888899
0099.111...2...333.44.5555.6666.777.8888..
0099.1117772...333.44.5555.6666.....8888..
0099.111777244.333....5555.6666.....8888..
00992111777.44.333....5555.6666.....8888..

The process of updating the filesystem checksum is the same; now, this example's checksum would be 2858.

Start over, now compacting the amphipod's hard drive using this new method instead. What is the resulting filesystem checksum?

*/
//get file
const fs = require("fs");
const raw = fs.readFileSync("day09/diskmap.txt", "utf-8");

//uncompressed disk (unsorted)
let diskLayout: any[] = [];
//sorted disk
let sortedDisk: any[] = [];
//ID of the block
let idNo = 0;
//MAP of the size of each ID
// ID: SIZE
let idSize = new Map<number, number>();


//sorting algorithm
for (let i = 0; i < raw.length; i += 2) {
    let fileBlockCount = raw[i];
    let emptyBlockCount = raw[i + 1] ?? 0
    //add to idSize
    idSize.set(idNo, fileBlockCount);

    // console.log(fileBlockCount+emptyBlockCount+"")
    while (fileBlockCount > 0) {
        diskLayout.push(idNo);
        fileBlockCount--;
    }
    while (emptyBlockCount > 0) {
        diskLayout.push('.');
        emptyBlockCount--;
    }
    idNo++;
}

//copy of diskLayout
sortedDisk = [...diskLayout];

function sortData() {
    let lastPosCounter = sortedDisk.length - 1
    //move pos left if found empty square
    while (lastPosCounter >= 0 && sortedDisk[lastPosCounter] === ".")
        lastPosCounter--;

    // console.log(lastPosCounter);
    //process right to left
    while (lastPosCounter >= 0) {
        if (sortedDisk[lastPosCounter] !== ".") {  
            let currIdNum = sortedDisk[lastPosCounter];
            let currIdSize = idSize.get(currIdNum);  //size of the ID 
            let emptyStartPos = getEmptyThatFits(currIdSize!, sortedDisk);

            if (emptyStartPos >= 0 && emptyStartPos < lastPosCounter) {  
                //move the file  
                for(let z=0;z<currIdSize!;z++) { 
                    //Add and remove the ID's from the sorted Disk
                    sortedDisk[emptyStartPos + z] = currIdNum;  
                    sortedDisk[lastPosCounter - z] = ".";  
                }  
                //console.log("Moved:"+currIdNum+" to pos: "+emptyStartPos);  
            }  
            //skip past file size
            lastPosCounter-=currIdSize!;  
        } else {  
            lastPosCounter--;  
        }  
    }  
}

//finds pos where the size of file can fit
function getEmptyThatFits(fileSize: number, disk: any[]): number {
    for (let i=0;i<=disk.length-fileSize; i++) {
        let allEmpty=true;
        for (let z=0;z<fileSize;z++) {
            if (disk[i+z]!==".") {
                allEmpty=false;
                break;
            }
        }
    if (allEmpty) return i;
  }
   return -1;
}


//sort into new spots
sortData();

console.log(diskLayout);
console.log("Sorted: " + sortedDisk);

//calc the checksum
let newChecksum = 0;
for (let i=0;i<sortedDisk.length;i++) {
    //ignore . EMPTY SPACE
    if(sortedDisk[i]===".")
        continue;
    let x=i*parseInt(sortedDisk[i]);
    newChecksum+=x;
}

console.log(newChecksum)
//ANSWER: 6377400869326