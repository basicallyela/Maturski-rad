//class that contains all necessary features to paint sprites in the game
class Sprite{
    //position(x, y values), imageSrc(finding image for sprite within game file), frameRate(how many frames does the animaion have),
    //animations(which animation has which name and which values), frameBuffer(so the frames dont change too quickly),
    //loop(wether the animation should be played in a loop), autoplay(if the animation should be played on the start of the game or not) 
    constructor({position, imageSrc, frameRate = 1, animations, frameBuffer = 2, loop = true, autoplay = true}){
        this.position = position;
        this.loaded = false;
        this.image = new Image();
        this.image.onload = () => {
            this.loaded = true;
            this.width = this.image.width / this.frameRate;
            this.height = this.image.height;
        };
        this.image.src = imageSrc;
        this.frameRate = frameRate;
        this.currentFrame = 0;
        this.elapsedFrames = 0;
        this.frameBuffer = frameBuffer;
        this.animations = animations;
        this.loop = loop;
        this.autoplay = autoplay;
        if(this.animations){
            for(let keywrd in this.animations){
                const image = new Image();
                image.src = this.animations[keywrd].imageSrc;
                this.animations[keywrd].image = image;
            }}}
    draw(){
        if(!this.loaded) return;
        
        const crop = {
            position:{
                x: this.width * this.currentFrame,
                y: 0
            },
            width: this.width,
            height: this.height
        }
        c.drawImage(
            this.image, 
            crop.position.x, 
            crop.position.y, 
            crop.width,
            crop.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height);
            this.frames();
            }
    play(){
        this.autoplay = true;
    }
    
    frames(){
        if (!this.autoplay) return
        this.elapsedFrames++;
        if( this.elapsedFrames % this.frameBuffer === 0){
        if(this.currentFrame < this.frameRate - 1){
            this.currentFrame++
        }
        else if (this.loop){
            this.currentFrame = 0;
        }}

    }
}



class Player extends Sprite{
    constructor({collisionBlocks = [], imageSrc, frameRate, animations, loop}){
        super({imageSrc, frameRate, animations, loop});
        this.position = {
            x: 200,
            y: 200
        }
        //player speed
        this.velocity = {
            x: 0,
            y: 0,
        }
        this.sides = {
            bottom: this.position.y + this.height
        }
        this.gravity = 1;
        this.collisionBlocks = collisionBlocks;
        this.unlocked = false;  
    }
    update() {
        this.position.x += this.velocity.x;
        this.makeHitbox();
        this.checkForHorCollisions();
        this.applyGravity();
        this.makeHitbox();
        this.checkForVerCollisions();
    }
    switchSprite(nameOfSprite){
        if(this.image === this.animations[nameOfSprite].image) return;
        this.currentFrame = 0;
        this.image = this.animations[nameOfSprite].image;
        this.frameRate = this.animations[nameOfSprite].frameRate;
        this.frameBuffer = this.animations[nameOfSprite].frameBuffer;
        this.loop = this.animations[nameOfSprite].loop;
    }
    makeHitbox(){
        this.hitbox ={
            position:{
                x: this.position.x + 58,
                y: this.position.y + 34
            },
            width: 54,
            height: 52
        }
    }
    checkForHorCollisions(){
        for(let i = 0; i< this.collisionBlocks.length; i++){
            const collisionBlock = this.collisionBlocks[i];

            if(
                this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width  &&
                this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
                this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
                this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height
                ){
                    if( this.velocity.x < 0){
                        const offset = this.hitbox.position.x - this.position.x;
                        this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01;
                        break;
                    }
                    if(this.velocity.x > 0){
                        const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;
                        this.position.x = collisionBlock.position.x - offset - 0.01;
                        break;
                    }
            }

        }
    }
    checkForVerCollisions(){
        for(let i = 0; i< this.collisionBlocks.length; i++){
            const collisionBlock = this.collisionBlocks[i];

            //if collision exists
            if(
                this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width  &&
                this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
                this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
                this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height
                ){
                    if( this.velocity.y < 0){
                        this.velocity.y = 0;
                        const offset = this.hitbox.position.y - this.position.y;
                        this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01;
                        break;
                    }
                    if(this.velocity.y > 0){
                        this.velocity.y = 0;
                        const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;
                        this.position.y = collisionBlock.position.y - offset - 0.01;
                        break;
                    }
            }

        }
    }
    applyGravity(){
        this.velocity.y += this.gravity;
        this.position.y += this.velocity.y;
        this.sides.bottom = this.position.y + this.height;

    }

    playerMovements(keys){
        if(this.preventMovement) return;
        this.velocity.x = 0;
        if(keys.right.pressed){
            this.switchSprite('runRight');
            this.velocity.x = 4;
            this.lastDirection = 'right';
        }
        else if (keys.left.pressed){
            this.switchSprite('runLeft');
            this.velocity.x = -4
            this.lastDirection = 'left';
        }
   
        else{
            if(this.lastDirection === 'left') this.switchSprite('idleLeft');
        
            else this.switchSprite('idleRight');
        
        }
    }
}








//collisions
Array.prototype.parse2D = function(){
    const rows = [];
    for( let i = 0; i < this.length; i+=15){
        rows.push(this.slice(i, i+15));
    }

    return rows;

}


Array.prototype.createObjectsFrom2D = function () {
    const objects = [];
    this.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if(symbol === 1){
            objects.push(
                new CollidedBlock({
                position: {
                    x: x * 64,
                    y: y * 64,
                },
            }));}
        if(symbol === 2){
            objects.push(
                new CollidedLine({
                position: {
                    x: x * 64,
                    y: y * 64,
                },
            }));}});});
return objects;
}


class CollidedBlock{
    constructor({position}){
        this.position = position;
        this.width = 64;
        this.height = 64;
    }
}
class CollidedLine{
    constructor({position}){
        this.position = position;
        this.width = 64;
        this.height = 5;
    }
}