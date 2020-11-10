
/*
感谢周钜华同学的帮助，但由于自身代码能力欠缺，
如果完全由自己写代码，不参考同学代码，
是不能将绘制的四种图形整合一起，所以我将四种图形分开绘制
*/

"use strict";

var canvas;
var gl;

var index = 0;

var move = [];
var moveLoc;
var zoom = 0.0;
var zoomLoc;
var theta = 0.0;
var thetaLoc;

var points = [
	0.0, 0.1, 0.0, 
	-0.1, 0.0, 0.0,
	0.1, 0.0, 0.0,
	0.0, -0.1, 0.0,
];
var colors = [
	0.0, 1.0, 0.0, 1.0,
	0.0, 1.0, 0.0, 1.0,
	0.0, 1.0, 0.0, 1.0,
	0.0, 1.0, 0.0, 1.0,
];


window.onload = function init(){
	
	canvas = document.getElementById("various-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) {
	    alert("WebGL isn't available");
	}
	
	
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0.5, 0.5, 0.5, 1.0);
	
	gl.enable(gl.DEPTH_TEST);
	
	var program = initShaders(gl, "v-shader", "f-shader");
	gl.useProgram(program);
	
	zoomLoc = gl.getUniformLocation(program, "zoom");
	moveLoc = gl.getUniformLocation(program, "move");
	thetaLoc = gl.getUniformLocation(program, "theta");
	
	var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
	
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);
	
	var cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	
	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);		
	

	canvas.addEventListener("mousedown", function(event){
		var rect = canvas.getBoundingClientRect();
		var cx = event.clientX - rect.left;
		var cy = event.clientY - rect.top; // offset
		var t = 2 * cx / canvas.width - 1;
		var c = 2 * (canvas.height - cy) / canvas.height - 1;
		move.push([t, c]);
		index++;
	});

	render();

}

function render(){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	theta += 0.1;
	if(theta>2 * Math.PI)
		theta -= (2 * Math.PI);
	gl.uniform2fv(thetaLoc, [0.0, theta]);
	gl.uniform2fv(zoomLoc, [0.0, 0.0]);
	for(var i=0;i<index;i++){
		gl.uniform2fv(moveLoc, move[i]);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}
	requestAnimFrame(render);
}
