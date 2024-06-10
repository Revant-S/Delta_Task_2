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
            x : 1000,
            y: groundLevel
        }
    }

    this.wallDimensions = {
        left : {
            height : 150,
            width : 60
        },
        right : {
            height : 150,
            width : 60
        }
    }
    this.canonTowerDetails = {
        location : (this.wallCoordinates.left.x + this.wallDimensions.left.width + this.wallCoordinates.right.x)/2,
        height : 400,
        width : 80,
        bullets : 500
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