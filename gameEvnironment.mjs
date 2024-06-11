import {Canon, bullets} from "./weapons.mjs"
export const groundLevel = 600;
export function generateGround(ctx,canvasWidth) {
    ctx.beginPath();
    ctx.moveTo(0,groundLevel);
    ctx.lineTo(canvasWidth,groundLevel)
    ctx.stroke();
    return groundLevel
}

export function createTheBase({groundLevel,ctx}){
    this.weaponsAvailabe = [];
    this.wallCoordinates = {
        left : {
            x : 400,
            y : groundLevel
        },
        right : {
            x : 900,
            y: groundLevel
        }
    }

    this.wallDimensions = {
        left : {
            height : 120,
            width : 120
        },
        right : {
            height : 120,
            width : 120
        }
    }
    this.canonTowerDetails = {
        location : (this.wallCoordinates.left.x + this.wallDimensions.left.width + this.wallCoordinates.right.x)/2,
        height : 400,
        width : 80,
        bullets : 500
    }
    this.wallLife = {
        left : 100,
        right : 100
    }
    this.draw = function (){                                                                                                      
        ctx.fillStyle = "black"
        ctx.fillRect(this.wallCoordinates.left.x,this.wallCoordinates.left.y - this.wallDimensions.left.height,this.wallDimensions.left.width , this.wallDimensions.left.height );
        ctx.fill();
        ctx.fillRect(this.wallCoordinates.right.x,this.wallCoordinates.right.y- this.wallDimensions.right.height,this.wallDimensions.right.width , this.wallDimensions.right.height );
        ctx.fill();
        ctx.fillStyle = "grey"
        ctx.fillRect(this.canonTowerDetails.location-this.canonTowerDetails.width/2,groundLevel-this.canonTowerDetails.height,this.canonTowerDetails.width , this.canonTowerDetails.height );
        ctx.fill();
    }
}