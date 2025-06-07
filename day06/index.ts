/*
--- Day 6: Guard Gallivant ---

The Historians use their fancy device again, this time to whisk you all away to the North Pole prototype suit manufacturing lab... in the year 1518! It turns out that having direct access to history is very convenient for a group of historians.

You still have to be careful of time paradoxes, and so it will be important to avoid anyone from 1518 while The Historians search for the Chief. Unfortunately, a single guard is patrolling this part of the lab.

Maybe you can work out where the guard will go ahead of time so that The Historians can search safely?

You start by making a map (your puzzle input) of the situation. For example:

....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...

The map shows the current position of the guard with ^ (to indicate the guard is currently facing up from the perspective of the map). Any obstructions - crates, desks, alchemical reactors, etc. - are shown as #.

Lab guards in 1518 follow a very strict patrol protocol which involves repeatedly following these steps:

    If there is something directly in front of you, turn right 90 degrees.
    Otherwise, take a step forward.

Following the above protocol, the guard moves up several times until she reaches an obstacle (in this case, a pile of failed suit prototypes):

....#.....
....^....#
..........
..#.......
.......#..
..........
.#........
........#.
#.........
......#...

Because there is now an obstacle in front of the guard, she turns right before continuing straight in her new facing direction:

....#.....
........>#
..........
..#.......
.......#..
..........
.#........
........#.
#.........
......#...

Reaching another obstacle (a spool of several very long polymers), she turns right again and continues downward:

....#.....
.........#
..........
..#.......
.......#..
..........
.#......v.
........#.
#.........
......#...

This process continues for a while, but the guard eventually leaves the mapped area (after walking past a tank of universal solvent):

....#.....
.........#
..........
..#.......
.......#..
..........
.#........
........#.
#.........
......#v..

By predicting the guard's route, you can determine which specific positions in the lab will be in the patrol path. Including the guard's starting position, the positions visited by the guard before leaving the area are marked with an X:

....#.....
....XXXXX#
....X...X.
..#.X...X.
..XXXXX#X.
..X.X.X.X.
.#XXXXXXX.
.XXXXXXX#.
#XXXXXXX..
......#X..

In this example, the guard will visit 41 distinct positions on your map.

Predict the path of the guard. How many distinct positions will the guard visit before leaving the mapped area?


*/
//get file
const fs = require("fs");
const raw = fs.readFileSync("day06/map.txt","utf-8");

//game world map
let map: string[][] = raw.trim().split('\n').map((line: string) => line.trim().split(''));

//----------------- THE GUARD ----------------------
// Using an enum for better readability
enum Direction {
    Up = 0,
    Right = 1,
    Down = 2,
    Left = 3
}

class Guard{
    public x: number;   //<---->
    public y: number;   //⬆ OR ⬇
    //direction guard faces
    public direction: Direction;
    //the guard will KEEP MOVING until OUT OF BOUNDS (left area)
    public isOutOfBounds:boolean;

    //offset for movement/map directions
    //"Look at the next 'step' in Guards path"
    private static readonly DirectionOffsets = [
        { x:  0, y:  -1 }, // Up
        { x:  1, y:  0 }, // Right
        { x:  0, y: 1 }, // Down
        { x: -1, y:  0 }  // Left
    ];

    constructor(x:number,y:number,direction:Direction){
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.isOutOfBounds=false;
    }


    public processNextMove(){
        //Replace Guard (or . EMPTY) icon with X (making a trail)
        map[this.y][this.x]="X";

        //TURN until FREE TO MOVE FORWARD
        while(!this.isStepSafe()){
            this.changeDirection();
        }
        if(this.isOutOfBounds)
            return 0;
        
        this.step();
        return;
    }

    //MOVE in FACEing direction
    private step(){
        const offset=Guard.DirectionOffsets[this.direction];
        this.x+=offset.x;
        this.y+=offset.y;
    }


    //check IF NEXT map LOCATION is SAFE to MOVE TO
    private isStepSafe():boolean{
        const offset = Guard.DirectionOffsets[this.direction];
        const nextY = this.y + offset.y;
        const nextX = this.x + offset.x;

        //OUT OF BOUNDS check
        if(nextY<0||nextY>=map.length||nextX<0||nextX>=map[0].length){
            this.isOutOfBounds=true;
            return true;
        }
        //ensure no obstacle in way
        return map[nextY][nextX] !== "#";
    }
    
    //changes direction clockwise or set from arg Dir
    private changeDirection(): void;//overload
    private changeDirection(dir: number): void;//unneeded - dont need to turn into a specific direction

    private changeDirection(dir?:number):void{
        if(dir!==undefined){
            this.direction=dir;

        }else{
            if(this.direction===3)
                this.direction=0;
            else
                this.direction++
        }
    }
}
//-------------------- END -------------------------


let guardTest!:Guard;

//find guard in map and create the Guard class
map.forEach((element, y) => {
    let x:number=element.indexOf("^");
    if(x>=0)//pos is found
        guardTest=new Guard(x,y,Direction.Up);
});


while(!guardTest.isOutOfBounds)
    guardTest.processNextMove();


//show the updatd MAP and info
debugLog();

//count the total amount of X
const count=map.flat().filter(cell => cell==="X").length
console.log("TOTAL UNIQUE X "+count);
//===================ANSWER==================
// 5080
//===========================================



//generic debug info log
function debugLog(){
    console.log(guardTest.x+"x_"+guardTest.y+"y_DIR:"+guardTest.direction);
    for(let i=0;i<map.length;i++){
        console.log(map[i]);
    }
    
}
