var canvas = document.getElementById('trails');
canvas.width = 800;
canvas.height = 400;
var ctx = canvas.getContext('2d');
var bgColor = '#000F6D';
var shapeColor = '#00FF6D';
var shadowColor = '#0AE864';

var shapes = [];

function drawCircle(x, y, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
}

function createShape(shapeX, shapeY, shapeR, blurSegments, shapeColor, shadowColor, stretch){
    var shape = {
        trailLines : [],
        x : shapeX,
        y : shapeY,
        radius : shapeR,
        blurSegments : blurSegments,
        primaryColor : shapeColor,
        secondaryColor : shadowColor,
        stretch : stretch,
        destinationX : shapeX - 200,
        animationDuration : 100,
        currentAnimationFrame : 0,
        velocity : -8
    };
    var segmentHeight = shapeR * 2 / blurSegments;
    shape.trailLines = [];
    shape.dots = [];
    for(var i = 0; i < blurSegments; i++){
        var divisionY = shapeY - shapeR + segmentHeight*i + segmentHeight/2;
        var distToCurve = Math.sqrt((shapeR * shapeR) - (shapeY - divisionY) * (shapeY - divisionY));
        var baseLength = distToCurve + shapeR;
        shape.trailLines.push({
            'y' : divisionY,
            'baseLength' : baseLength + baseLength * Math.random(),
            'shadowLength' : Math.random() * shapeR/6 + shapeR / 4
        });
    }
    for(var j = 0; j < blurSegments; j++){
        var line = shape.trailLines[j];
        if(j%2){
            if(line.baseLength > shape.trailLines[j-1].baseLength){
                line.baseLength = shape.trailLines[j-1].baseLength / 2;
            }
            if(j != blurSegments - 1){
                if(line.baseLength > shape.trailLines[j+1].baseLength){
                    line.baseLength = shape.trailLines[j+1].baseLength / 2;
                }
            }
        }else{
            if(Math.random() < .2){
                var dot = {
                    length : Math.floor(Math.random()*4)
                };
                line.dot = dot;
            }
        }
    }

    return shape;
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.fillStyle = bgColor;
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();

    for(var i = 0; i < shapes.length; i++){
        var shape = shapes[i];

        // destinationX : shapeX - 100,
        // animationDuration : 1000,
        //currentAnimationFrame : 0
        // shape.x += shape.velocity;
        // shape.currentAnimationFrame += 1;
        if(shape.x < 100 || shape.x > 450){
            shape.velocity *= -1;
        }

        for(var j = 0; j < shape.blurSegments; j++){
            var divisionHeight = shape.radius * 2 / shape.blurSegments;
            var line = shape.trailLines[j];
            var lineLength = (line.baseLength + shape.stretch);
            ctx.beginPath();
            ctx.strokeStyle = shape.primaryColor;
            ctx.lineWidth = divisionHeight + 1;
            ctx.lineCap = "round";
            ctx.moveTo(shape.x, line.y);
            ctx.lineTo(shape.x + lineLength, line.y);
            ctx.stroke();
           
            if(j%2){
                ctx.beginPath();
                ctx.strokeStyle = shape.secondaryColor;
                ctx.moveTo(shape.x + lineLength, line.y);
                ctx.lineTo(shape.x + lineLength - line.shadowLength, line.y);
                ctx.stroke();
                drawCircle(shape.x + lineLength + 3, line.y, divisionHeight/2 - .5, bgColor)
            }
            if(line.dot){
                ctx.moveTo(shape.x + lineLength + divisionHeight * 2, line.y)
                ctx.lineTo(shape.x + lineLength + (divisionHeight* 2 * line.dot.length), line.y);
                ctx.stroke();
            }
        }
        drawCircle(shape.x, shape.y, shape.radius, shape.primaryColor);
    }
    requestAnimationFrame(draw);
}

shapes.push(createShape(450, canvas.height / 2, 70, 13, '#00FF6D', '#0AE864', 75));

requestAnimationFrame(draw);

canvas.addEventListener('click', function () {
    // shapes = [];
    // shapes.push(createShape(canvas.width / 2 - 100, canvas.height / 2, Math.random()*70 + 30, (Math.floor(Math.random()*10)*2)+1, '#00FF6D', '#0AE864', Math.random()*100));
    // draw();
});

//vector2D to calculate shape magnitude to affect stretch, line length, etc?