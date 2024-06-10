export function generateGround(ctx,canvasWidth) {
    const groundLevel = 450;
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
            height : 250,
            width : 60
        },
        right : {
            height : 250,
            width : 60
        }
    }
    this.draw = function (){
                                                                                                                
        ctx.fillStyle = "black"
        ctx.fillRect(this.wallCoordinates.left.x,this.wallCoordinates.left.y - this.wallDimensions.left.height,this.wallDimensions.left.width , this.wallDimensions.left.height );
        ctx.fill();
        ctx.fillRect(this.wallCoordinates.right.x,this.wallCoordinates.right.y- this.wallDimensions.right.height,this.wallDimensions.right.width , this.wallDimensions.right.height );
        ctx.fill();
    }
}