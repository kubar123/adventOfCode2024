/*


While The Historians begin working around the guard's patrol route, you borrow their fancy device and step outside the lab. From the safety of a supply closet, you time travel through the last few months and record the nightly status of the lab's guard post on the walls of the closet.

Returning after what seems like only a few seconds to The Historians, they explain that the guard's patrol area is simply too large for them to safely search the lab without getting caught.

Fortunately, they are pretty sure that adding a single new obstruction won't cause a time paradox. They'd like to place the new obstruction in such a way that the guard will get stuck in a loop, making the rest of the lab safe to search.

To have the lowest chance of creating a time paradox, The Historians would like to know all of the possible positions for such an obstruction. The new obstruction can't be placed at the guard's starting position - the guard is there right now and would notice.

In the above example, there are only 6 different positions where a new obstruction would cause the guard to get stuck in a loop. The diagrams of these six situations use O to mark the new obstruction, | to show a position where the guard moves up/down, - to show a position where the guard moves left/right, and + to show a position where the guard moves both up/down and left/right.

Option one, put a printing press next to the guard's starting position:

....#.....
....+---+#
....|...|.
..#.|...|.
....|..#|.
....|...|.
.#.O^---+.
........#.
#.........
......#...

Option two, put a stack of failed suit prototypes in the bottom right quadrant of the mapped area:

....#.....
....+---+#
....|...|.
..#.|...|.
..+-+-+#|.
..|.|.|.|.
.#+-^-+-+.
......O.#.
#.........
......#...

Option three, put a crate of chimney-squeeze prototype fabric next to the standing desk in the bottom right quadrant:

....#.....
....+---+#
....|...|.
..#.|...|.
..+-+-+#|.
..|.|.|.|.
.#+-^-+-+.
.+----+O#.
#+----+...
......#...

Option four, put an alchemical retroencabulator near the bottom left corner:

....#.....
....+---+#
....|...|.
..#.|...|.
..+-+-+#|.
..|.|.|.|.
.#+-^-+-+.
..|...|.#.
#O+---+...
......#...

Option five, put the alchemical retroencabulator a bit to the right instead:

....#.....
....+---+#
....|...|.
..#.|...|.
..+-+-+#|.
..|.|.|.|.
.#+-^-+-+.
....|.|.#.
#..O+-+...
......#...

Option six, put a tank of sovereign glue right next to the tank of universal solvent:

....#.....
....+---+#
....|...|.
..#.|...|.
..+-+-+#|.
..|.|.|.|.
.#+-^-+-+.
.+----++#.
#+----++..
......#O..

It doesn't really matter what you choose to use as an obstacle so long as you and The Historians can put it into position without the guard noticing. The important thing is having enough options that you can find one that minimizes time paradoxes, and in this example, there are 6 different positions you could choose.

You need to get the guard stuck in a loop by adding a single new obstruction. How many different positions could you choose for this obstruction?


*/
//get file
const fs = require("fs");
const raw = fs.readFileSync("day06/map.txt","utf-8");

//game world map
type CellContent = string | Set<number>;
let mainMap: CellContent[][] = raw.trim().split('\n').map((line: string) => 
    line.trim().split('').map((char: string) => char as CellContent)
);

let totalUniqueLoops = 0;

// Using an enum for better readability
enum Direction {
    Up = 0,
    Right = 1,
    Down = 2,
    Left = 3
}

class Guard {
    public map: CellContent[][];
    public x: number;
    public y: number;
    private startX: number;
    private startY: number;
    public direction: Direction;

    public isOutOfBounds: boolean;
    public isInLoop: boolean;

    //only main guard spawns more guards
    private isMainGuard: boolean;

    // offset for movement/map directions
    private static readonly DirectionOffsets = [
        { x: 0, y: -1 }, // Up
        { x: 1, y: 0 },  // Right
        { x: 0, y: 1 },  // Down
        { x: -1, y: 0 }  // Left
    ];

    constructor(x: number, y: number, direction: Direction, map: CellContent[][], isMain: boolean = false) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.direction = direction;
        this.isOutOfBounds = false;
        this.isInLoop = false;
        this.isMainGuard = isMain;
        
        // copy of map for simulation, copy set (dont share set reference)
        if (!isMain) {
            this.map = map.map(row => row.map(cell => 
                typeof cell === 'string' ? cell : new Set(cell)
            ));
        } else
            this.map = map;

    }


    public simulate(){
        while (!this.isOutOfBounds && !this.isInLoop) {
            this.processNextMove();
        }
    }

    public processNextMove() {
        // Mark current pos and check for loop
        if (this.markMeOnMap()) {
            this.isInLoop = true;
            return;
        }

        // Turn until we can move forward
        while (!this.isStepSafe()) {
            this.changeDirection();
            if (this.isOutOfBounds) return;
        }

        // If main guard, try place obstacle ahead
        if (this.isMainGuard && this.isStepSafe()) {
            this.tryPlaceObstacle();
        }

        // Move forward
        this.step();
    }

    //retuns if we are in loop
    private markMeOnMap():boolean {
        const currentCell = this.map[this.y][this.x];
        
        if (typeof currentCell==="string") {
            this.map[this.y][this.x]=new Set<number>([this.direction]);
            return false;
        } else {
            const cellSet = currentCell as Set<number>;
            if (cellSet.has(this.direction)) {
                return true; // In loop
            }
            cellSet.add(this.direction);
            return false;
        }
    }

    private isStepSafe(): boolean {
        const offset = Guard.DirectionOffsets[this.direction];
        const nextY = this.y + offset.y;
        const nextX = this.x + offset.x;

        // Check bounds
        if (nextY < 0 || nextY >= this.map.length || nextX < 0 || nextX >= this.map[0].length) {
            this.isOutOfBounds = true;
            return false;
        }

        // Check for #
        const nextCell = this.map[nextY][nextX];
        return (typeof nextCell === 'string' ? nextCell : '.') !== '#';
    }

    private changeDirection() {
        this.direction = (this.direction + 1) % 4;
    }

    private step(){
        const offset = Guard.DirectionOffsets[this.direction];
        this.x += offset.x;
        this.y += offset.y;
    }

    private tryPlaceObstacle(){
        const offset = Guard.DirectionOffsets[this.direction];
        const obstacleY = this.y + offset.y;
        const obstacleX = this.x + offset.x;

        // Dont place # at start pos
        if (obstacleX === this.startX && obstacleY === this.startY)
            return;
        
        // OR if theres one there
        const targetCell = this.map[obstacleY][obstacleX];
        if ((typeof targetCell === 'string' ? targetCell : '.') === '#')
            return;

        // Dont place obstacle if guard has been at this POS
        // obstacle should only be placed on unvisited cells
        if (typeof targetCell !== 'string')
            return;

        // copy of the map and obstacle
        const testMap = this.map.map(row => row.map(cell => 
            typeof cell === 'string' ? cell : '.'
        ));
        testMap[obstacleY][obstacleX] = '#';

        // Test if loop
        const testGuard = new Guard(this.startX, this.startY, Direction.Up, testMap, false);
        testGuard.simulate();
        
        if (testGuard.isInLoop) {
            totalUniqueLoops++;
        }
    }
}

// Find guard starting position
let startX = -1, startY = -1;
for (let y = 0; y < mainMap.length; y++) {
    for (let x = 0; x < mainMap[y].length; x++) {
        if (mainMap[y][x] === '^') {
            startX = x;
            startY = y;
            break;
        }
    }
    if (startX !== -1) break;
}

// make & run MainGuard
const mainGuard = new Guard(startX, startY, Direction.Up, mainMap, true);
mainGuard.simulate();



console.log("TOTAL UNIQUE LOOPS: " + totalUniqueLoops);
//------ANSWER 1919 ------