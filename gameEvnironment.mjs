export function generateGround(ctx,canvasWidth) {
    const groundLevel = 450;
    ctx.beginPath();
    ctx.moveTo(0,groundLevel);
    ctx.lineTo(canvasWidth,groundLevel)
    ctx.stroke();
    return groundLevel
}