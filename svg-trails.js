//helpers
function constrain(min, max, number){
    return Math.min(Math.max(parseInt(number), min), max);
}

//generate object data
//settings
var trail = {
    divisionCount: 7,
    divisions: [],
    stretch: 10,
    svgs: []
};
var radius = 50;
var segmentHeight = radius * 2 / trail.divisionCount;
var color = '#49166D';

var animationPosition = 0;
var pathPosition = 0;

var pathLength = 700;
var animationLength = 700;
var animationStartTime = Date.now();


var longestLine = 0;
//set up object
for(var i = 0; i < trail.divisionCount; i++){
    var divisionY = 0 - radius + segmentHeight*i + segmentHeight/2;
    var distToCurve = Math.sqrt((radius * radius) - (0 - divisionY) * (0 - divisionY));
    var startingLength = distToCurve + radius + 100;
    var baseLength = startingLength + segmentHeight + (startingLength * Math.random());
    if(baseLength > longestLine){
        longestLine = baseLength;
    }
    trail.divisions.push({
        'y' : divisionY,
        'baseLength' : baseLength,
        'shadowLength' : (Math.random() * (radius/6)) + baseLength / 10 +  radius / 4
    });

}
for(var j = 0; j < trail.divisionCount; j++){
    var line = trail.divisions[j];
    if(j%2){
        if(line.baseLength > trail.divisions[j-1].baseLength){
            line.baseLength = trail.divisions[j-1].baseLength / 2;
        }
        if(j != trail.divisionCount - 1){
            if(line.baseLength > trail.divisions[j+1].baseLength){
                line.baseLength = trail.divisions[j+1].baseLength / 2;
            }
        }
        line.baseLength -= segmentHeight/2;
    }
};

//setup SVG structure
var svgns = "http://www.w3.org/2000/svg";
var container = document.getElementById('container');
var defs = document.createElementNS(svgns, 'defs');
defs.setAttributeNS(null, 'id', 'svgDefs');
container.appendChild(defs);

//draw SVGs
//group element for shape and blur lines
var swish = document.createElementNS(svgns, 'g');
swish.setAttributeNS(null, 'width', "auto");
container.appendChild(swish);

//create inverse end cap
var invertedCap = document.createElementNS(svgns, 'marker');
invertedCap.setAttributeNS(null, 'id', 'InvertedRound');
invertedCap.setAttributeNS(null, 'viewbox', '0 0 5 10');
invertedCap.setAttributeNS(null, 'refX', '0.01');
invertedCap.setAttributeNS(null, 'refY', '0.5');
invertedCap.setAttributeNS(null, 'style', 'fill: '+color);
invertedCap.setAttributeNS(null, 'markerUnits', 'strokeWidth');
invertedCap.setAttributeNS(null, 'markerWidth', '0.5');
invertedCap.setAttributeNS(null, 'markerHeight', '1');
invertedCap.setAttributeNS(null, 'orient', 'auto');
var invertedPath = document.createElementNS(svgns, "path");
invertedPath.setAttributeNS(null, 'd', 'M 0 0 L 0.5 0 A 0.5 0.5 0 0 0 0.5 1 L 0 1 z');
invertedCap.appendChild(invertedPath);
defs.appendChild(invertedCap);

//create inverse circle end cap for shadow line
var shadowInvertedRound = invertedCap.cloneNode(true);
shadowInvertedRound.setAttributeNS(null, 'id', 'shadowInvertedRound');
shadowInvertedRound.setAttributeNS(null, 'style', 'fill: #000000');
defs.appendChild(shadowInvertedRound);

//create round end cap for shadow line
var shadowRound = invertedCap.cloneNode(true);
shadowRound.setAttributeNS(null, 'id', 'shadowRound');
shadowRound.setAttributeNS(null, 'refX', '0.5');
shadowRound.setAttributeNS(null, 'style', 'fill: #000000');
shadowRound.removeChild(shadowRound.lastChild);

var roundPath = document.createElementNS(svgns, "path");
//TODO: slight bug in bottom of curve shape
roundPath.setAttributeNS(null, 'd', 'M 0.5 0 A 0.25 0.25 0 0 0 0.5 1 z');
shadowRound.appendChild(roundPath);
defs.appendChild(shadowRound);

//ANIMATE
///////////////////////////////////////////////////

var animate = document.createElementNS(svgns, "animateMotion");
animate.setAttributeNS(null, "rotate", "auto");
animate.setAttributeNS(null, "dur", animationLength/1000);
animate.setAttributeNS(null, "ease", "out");
animate.setAttributeNS(null, "id", "circleAnimation");
// animate.setAttributeNS(null, "repeatCount", "indefinite"); 
animate.setAttributeNS(null, "fill", "freeze"); 
animate.setAttributeNS(null, "values", "0; 100; 0");
animate.setAttributeNS(null, "keyTimes", "0; 0.8; 1");
animate.setAttributeNS(null, "begin", "click");

//sin wave type curve
//animate.setAttributeNS(null, "path", "M120 260 C 360 120, 460 120, 580 260 S 800 400, 920 260");
//straight line
animate.setAttributeNS(null, "path", "M220 260 920 260");
swish.appendChild(animate);

//group for blur lines
var trailSVG = document.createElementNS(svgns, 'g');
for(var i = 0; i < trail.divisions.length; i++){
    line = trail.divisions[i];
    var lineContainer = document.createElementNS(svgns, 'g');

    var svgLine = document.createElementNS(svgns, 'line');
    svgLine.setAttributeNS(null, 'y1', line.y);
    svgLine.setAttributeNS(null, 'y2', line.y);
    svgLine.setAttributeNS(null, 'x1', "0");
    svgLine.setAttributeNS(null, 'x2', "0");
    // svgLine.setAttributeNS(null, 'stroke-dasharray', line.baseLength);
    lineContainer.appendChild(svgLine);

    var lineAnimate = document.createElementNS(svgns, "animate");
    //start offset relative to length, creates stretching effect as if line is anchored to point behind
    var startOffset = (longestLine - line.baseLength) / 1000;
    //how long should the line animated for (to counter movement of circle)
    var lineAnimationDuration = (animationLength / pathLength) * line.baseLength - startOffset;
    
    //line animation duration as a %
    var durationAsValue = lineAnimationDuration / animationLength;
    console.log(lineAnimationDuration/1000, durationAsValue);

    lineAnimate.setAttributeNS(null, "attributeName","x2");
    lineAnimate.setAttributeNS(null, "values", "0; " + -line.baseLength + "; " + -line.baseLength + "; 0");
    lineAnimate.setAttributeNS(null, "keyTimes", "0; " + durationAsValue + "; 0.6; 1");
    lineAnimate.setAttributeNS(null, "dur", animationLength / 1000);
    lineAnimate.setAttributeNS(null, "from","0");
    lineAnimate.setAttributeNS(null, "to", -line.baseLength);
    lineAnimate.setAttributeNS(null, "begin", "circleAnimation.begin+"+startOffset);
    lineAnimate.setAttributeNS(null, "fill","freeze");
    
    svgLine.appendChild(lineAnimate);
    
    if(i%2){
        //Every second line inverse end cap and shadow line
        //Shadow line
        var lineShadow = document.createElementNS(svgns, 'line');
        //-line.baseLength + line.shadowLength
        lineShadow.setAttributeNS(null, 'x1', "0");
        lineShadow.setAttributeNS(null, 'y1', line.y);
        //-line.baseLength
        lineShadow.setAttributeNS(null, 'x2', "0");
        lineShadow.setAttributeNS(null, 'y2', line.y);
        lineShadow.setAttributeNS(null, 'style', 'stroke: #000000; stroke-width:'+(segmentHeight+1));
        lineShadow.setAttributeNS(null, 'opacity', '0.3');
        lineShadow.setAttributeNS(null, 'marker-end', 'url(#shadowInvertedRound)');
        lineShadow.setAttributeNS(null, 'marker-start', 'url(#shadowRound)');

        lineShadowAnimate = document.createElementNS(svgns, "animate");
        lineShadowAnimate.setAttributeNS(null, "attributeName","x2");
        // lineShadowAnimate.setAttributeNS(null, "to", -line.baseLength + 100);
        lineShadowAnimate.setAttributeNS(null, "values", "0; " + -line.baseLength + "; " + -line.baseLength + "; 0");
        lineShadowAnimate.setAttributeNS(null, "keyTimes", "0; " + durationAsValue + "; 0.6; 1");
        lineShadowAnimate.setAttributeNS(null, "dur", animationLength / 1000);
        lineShadowAnimate.setAttributeNS(null, "begin", "circleAnimation.begin+"+startOffset);
        lineShadowAnimate.setAttributeNS(null, "fill","freeze");
        lineShadow.appendChild(lineShadowAnimate);

        var shadowX1 = -line.baseLength + line.shadowLength;
        lineShadowAnimate2 = document.createElementNS(svgns, "animate");
        lineShadowAnimate2.setAttributeNS(null, "attributeName","x1");
        lineShadowAnimate2.setAttributeNS(null, "values", "-10; " + shadowX1 + "; " + shadowX1 + "; -10");
        lineShadowAnimate2.setAttributeNS(null, "keyTimes", "0; " + durationAsValue + "; 0.6; 1");
        lineShadowAnimate2.setAttributeNS(null, "dur", animationLength / 1000);
        lineShadowAnimate2.setAttributeNS(null, "begin", "circleAnimation.begin+"+startOffset);
        lineShadow.appendChild(lineShadowAnimate2);

        lineContainer.appendChild(lineShadow);

        //inverse round end cap on main line
        svgLine.setAttributeNS(null, 'style', 'stroke: '+color+'; stroke-width:'+(segmentHeight+1));
        svgLine.setAttributeNS(null, 'marker-end', 'url(#InvertedRound)');
    }else{
        svgLine.setAttributeNS(null, 'style', 'stroke: '+color+'; stroke-width:'+(segmentHeight));
        svgLine.setAttributeNS(null, 'stroke-linecap', 'round');
    }
    trailSVG.appendChild(lineContainer);
}

swish.appendChild(trailSVG);
var circle = document.createElementNS(svgns, 'circle');
circle.setAttributeNS(null, 'r', radius);
circle.setAttributeNS(null, 'id', 'ball');
circle.setAttributeNS(null, 'style', 'fill: '+color+';' );
swish.appendChild(circle);

// var trailsCollection = trailSVG.getElementsByTagName('g');
// console.log(trailsCollection[0]);

// for(var i = 0; i < trailsCollection.length; i++){
//     var line = trailsCollection[i];
//     line.setAttributeNS(null, 'stroke-dashoffset', angle);
// }


//animate
// function update(){
//     var elapsedTime = (Date.now() - animationStartTime) % animationLength;
//     animationPosition = elapsedTime / animationLength;
//     pathPosition = pathLength * animationPosition;
//     requestAnimationFrame(update);
// }
// requestAnimationFrame(update);


 //animateMotion tag properties
    // dur="4s" 
    // path="M 0, 0
    // a 348,348 0 1, 0 696,0
    // a 348,348 0 1, 0 -696,0"
    // begin="click"
    // fill="freeze"
    // calcMode="linear"
    // keyTimes="0;1"
    // keyPoints="1;0"
    // repeatCount="1"


//example property animation
// var animate = document.createElementNS(svgns, "animate");
// animate.setAttributeNS(null, "attributeName","x");
// animate.setAttributeNS(null, "from","0");
// animate.setAttributeNS(null, "to", radius);
// animate.setAttributeNS(null, "dur", "5");
// animate.setAttributeNS(null, "repeatCount","indefinite"); 
// // animate.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href","#ball"); 
// circle.appendChild(animate);

//example transform animation
// var animate = document.createElementNS(svgns, "animateTransform");
// animate.setAttributeNS(null, "attributeName","transform");
// animate.setAttributeNS(null, "from","0 60 60");
// animate.setAttributeNS(null, "to", "360 100 60");
// animate.setAttributeNS(null, "type", "rotate");
// animate.setAttributeNS(null, "dur", "5");
// animate.setAttributeNS(null, "repeatCount","indefinite"); 
// swish.appendChild(animate);

//example path animation

// swish.setAttributeNS(null, 'transform', 'translate(100, 100) rotate(50)');
