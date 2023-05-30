//gets the canvas element from the html file
const canvas = document.querySelector('canvas');
//provides the 2D rendering context for the drawing surface of a <canvas> element.
const c = canvas.getContext('2d');

//sets the canvas height and width
canvas.width = 64 * 15;
canvas.height = 64 * 8;


//sets the left and right keys to remove glitches
const keys = {
    left: {
        pressed: false
    },
    right: {
        pressed: false
    }

}

//sets the colision blocks for lvl1
const collisions = colLvl1.parse2D(); //parsedCollisions
const collisionBlocks = collisions.createObjectsFrom2D();


//creates background
const bg = new Sprite(
    {position: {x: 0, y: 0},
    imageSrc: 'img/Lvl1.png'});


//makes a player from Player class
const player = new Player({
    collisionBlocks,
    imageSrc: "img/king/idle.png",
    frameRate: 11,
    animations: {
        idleRight: {
            frameRate: 11,
            frameBuffer: 2,
            loop: true,
            imageSrc: "img/king/idle.png"
        },
        idleLeft: {
            frameRate: 11,
            frameBuffer: 2,
            loop: true,
            imageSrc: "img/king/idleLeft.png"
        },
        runRight: {
            frameRate: 8,
            frameBuffer: 4,
            loop: true,
            imageSrc: "img/king/runRight.png"
        },
        runLeft: {
            frameRate: 8,
            frameBuffer: 4,
            loop: true,
            imageSrc: "img/king/runLeft.png"
        },
        enterDoor: {
            frameRate: 8,
            frameBuffer: 4,
            loop: false,
            imageSrc: "img/king/enterDoor.png"
        }
    }
});

const doors = [
    new Sprite({
        position:{
            x: 240,
            y: 272
        },
        imageSrc: "img/doorOpen.png",
        frameRate: 5,
        frameBuffer: 5,
        loop: false,
        autoplay: false
    })];

const keyes = [
    new Sprite({
        position: {
            x: 780,
            y: 160
        },
        imageSrc: "img/key.png",
        frameRate: 7,
        frameBuffer: 5,
        autoplay: true

    })
];


//adds movement, creates canvas and resets it when needed, sets player x velocity and changes it when needed
//calls draw and update methods from Player class
function animate() {

    window.requestAnimationFrame(animate);
    bg.draw();
    

    doors.forEach(door => {
        door.draw();
    })
    
    if(player.unlocked != true){
    keyes.forEach(key => {
        key.draw();
    })}
    
    player.playerMovements(keys);
    player.draw();
    player.update();
    
   
}

//calls animate function, starts game basically
animate();

