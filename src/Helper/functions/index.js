import { POINTS, keypointConnections } from '../data'

export function drawPoint(ctx, x, y, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

export function drawSegment(ctx, [mx, my], [tx, ty], color) {
    ctx.beginPath()
    ctx.moveTo(mx, my)
    ctx.lineTo(tx, ty)
    ctx.lineWidth = 5
    ctx.strokeStyle = color
    ctx.stroke()
}

//computing the score which is abs(difference of gradients average)


    //the points which have connections
const numbers = [0, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14]
export function computescore(userkeypoints, count, data) {
    
    
    const gradients = []
    var scorecalc = 0
    try {
        for (var i of numbers) {
            var conn = ""
            var conname = ""
            conn = userkeypoints[i]["name"]
            Object.values(keypointConnections[conn]).forEach(val => {
                conname = val.toUpperCase()
                gradients.push(calculategradient(userkeypoints[i]["y"],
                    userkeypoints[i]["x"],
                    userkeypoints[POINTS[conname]]["y"],
                    userkeypoints[POINTS[conname]]["x"]))
            })
        }
    } catch (err) { console.log(err) }
        // Adding all differences of gradients
    for (let x = 0; x < gradients.length; x++) {
        scorecalc += Math.abs(data[count][x] - gradients[x])
    }
    return scorecalc

}

//gradient calculator
function calculategradient(y1, x1, y2, x2) {
    var gradient = 0
    gradient = (y1 - y2) / (x1 - x2)
    return gradient
}