var svgns = "http://www.w3.org/2000/svg";
var container = document.getElementById('container');
var defs = document.createElementNS(svgns, 'defs');
defs.setAttributeNS(null, 'id', 'svgDefs');
container.appendChild(defs);

//settings
var trail = {
    divisionCount: 15,
    divisions: [],
    stretch: 10,
    svgs: []
};
var radius = 50;
var segmentHeight = radius * 2 / trail.divisionCount;
var color = '#49166D';

//set up object
for(var i = 0; i < trail.divisionCount; i++){
    var divisionY = 0 - radius + segmentHeight*i + segmentHeight/2;
    var distToCurve = Math.sqrt((radius * radius) - (0 - divisionY) * (0 - divisionY));
    var baseLength = distToCurve + radius;
    trail.divisions.push({
        'y' : divisionY,
        'baseLength' : baseLength + segmentHeight + (baseLength * Math.random()),
        'shadowLength' : (Math.random() * (radius/6)) + radius / 4
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

//Draw SVGs
//group element for shape and blur lines
var swish = document.createElementNS(svgns, 'g');
swish.setAttributeNS(null, 'transform', 'translate(100, 100) rotate(50)');
swish.setAttributeNS(null, 'width', 1000);
container.appendChild(swish);

//draw circle
var circle = document.createElementNS(svgns, 'circle');
circle.setAttributeNS(null, 'r', radius);
circle.setAttributeNS(null, 'style', 'fill: '+color+'; stroke: none; stroke-width: 1px;' );
swish.appendChild(circle);

//Custom cap shapes for svg line added to defs
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

//group for blur lines
var trailSVG = document.createElementNS(svgns, 'g');
for(var i = 0; i < trail.divisions.length; i++){
    line = trail.divisions[i];

    //container per line (line and shadow)
    var lineContainer = document.createElementNS(svgns, 'g');

    var svgLine = document.createElementNS(svgns, 'line');
    svgLine.setAttributeNS(null, 'y1', line.y);
    svgLine.setAttributeNS(null, 'y2', line.y);
    svgLine.setAttributeNS(null, 'x1', '0');
    svgLine.setAttributeNS(null, 'x2', line.baseLength);
    svgLine.setAttributeNS(null, 'stroke-dasharray', line.baseLength);
    lineContainer.appendChild(svgLine);
    
    if(i%2){
        //Every second line inverse end cap and shadow line
        //Shadow line
        var lineShadow = document.createElementNS(svgns, 'line');
        lineShadow.setAttributeNS(null, 'x1', line.baseLength - line.shadowLength);
        lineShadow.setAttributeNS(null, 'y1', line.y);
        lineShadow.setAttributeNS(null, 'x2', line.baseLength);
        lineShadow.setAttributeNS(null, 'y2', line.y);
        lineShadow.setAttributeNS(null, 'style', 'stroke: #000000; stroke-width:'+(segmentHeight+1));
        lineShadow.setAttributeNS(null, 'opacity', '0.3');
        lineShadow.setAttributeNS(null, 'marker-end', 'url(#shadowInvertedRound)');
        lineShadow.setAttributeNS(null, 'marker-start', 'url(#shadowRound)');
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

var trailsCollection = trailSVG.getElementsByTagName('g');
console.log(trailsCollection[0]);
// for(var i = 0; i < trailsCollection.length; i++){
//     var line = trailsCollection[i];
//     line.setAttributeNS(null, 'stroke-dasharray', '100');

//     line.setAttributeNS(null, 'stroke-dashoffset', '-10');
// }

//animate
var angle = 0;
function update(){
    for(var i = 0; i < trailsCollection.length; i++){
        var line = trailsCollection[i];
        line.setAttributeNS(null, 'stroke-dashoffset', angle);
    }

    angle += 1;
    swish.setAttributeNS(null, 'transform', 'translate(200, 180) rotate(210)');
    requestAnimationFrame(update);
}
requestAnimationFrame(update);