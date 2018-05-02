var svgns = "http://www.w3.org/2000/svg";
var container = document.getElementById('container');

var trail = {
    divisionCount: 9,
    divisions: [],
    stretch: 10,
    svgs: []
};
var radius = 50;
var segmentHeight = radius * 2 / trail.divisionCount;

for(var i = 0; i < trail.divisionCount; i++){
    var divisionY = 0 - radius + segmentHeight*i + segmentHeight/2;
    var distToCurve = Math.sqrt((radius * radius) - (0 - divisionY) * (0 - divisionY));
    var baseLength = distToCurve + radius;
    trail.divisions.push({
        'y' : divisionY,
        'baseLength' : baseLength + baseLength * Math.random(),
        'shadowLength' : Math.random() * radius/6 + radius / 4
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
    }
}
console.log(trail.divisions);

//draw SVGs
var swish = document.createElementNS(svgns, 'g');
// swish.setAttributeNS(null, 'transform', 'translate(100, 100) rotate(0)');
swish.setAttributeNS(null, 'transform', 'translate(100, 100)');
swish.setAttributeNS(null, 'width', 1000);
container.appendChild(swish);

var circle = document.createElementNS(svgns, 'circle');
circle.setAttributeNS(null, 'r', radius);
circle.setAttributeNS(null, 'style', 'fill: none; stroke: blue; stroke-width: 1px;' );
swish.appendChild(circle);

var trail = document.createElementNS(svgns, 'line');
// trail.setAttributeNS(null, 'x1', 100);
// trail.setAttributeNS(null, 'y1', 100);
trail.setAttributeNS(null, 'x2', 100);
// trail.setAttributeNS(null, 'y2', 100);
trail.setAttributeNS(null, 'style', 'stroke: blue; stroke-width: 2px');
swish.appendChild(trail);

//create SVG shapes
for(var i = 0; i < tail.divisions.length; i++){
    line = trail[i];
    var svgLine = document.createElementNS(svgns, 'line');
    svgLine.setAttributeNodeNS(null, 'x2', 100);
    trail.svgs.push(svgLine);
}