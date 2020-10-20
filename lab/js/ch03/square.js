"use strict";
var canvas;
var gl;
var theta = 0.0;
var thetaLoc;
var direction = 1;
var speed = 50;

function change(){
	direction *= -1;
}

function init(){
	canvas = document.getElementById( "rot-canvas" );
	gl = WebGLUtils.setupWebGL( canvas, "experimental-webgl" );
	if( !gl ){
		alert( "WebGL isn't available" );
	}

	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	var program = initShaders( gl, "rot-v-shader", "rot-f-shader" );
	gl.useProgram( program );

	var vertices = [
		0,  1,  0,
		-1,  0,  0,
		 1,  0,  0,
		 0, -1,  0
		
		 
	];

	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	thetaLoc = gl.getUniformLocation( program, "theta" );
	
	//按钮控制
		document.getElementById( "speed01" ).onchange = function( event ){
			speed = 100 - event.target.value;
		};
		//列表控制
		document.getElementById("Controls").onclick = function( event) {
		        switch(event.srcElement.index) {
		          case 0:
		            direction = !direction;
		            break;
		
		         case 1:
		            speed /= 2.0;
		            break;
		
		         case 2:
		            speed *= 2.0;
		            break;
		       }
		    };
		//键盘功能键1：暂停：2：加速：3：减速
		 window.onkeydown = function( event ) {
		        var key = String.fromCharCode(event.keyCode);
		        switch( key ) {
		          case '1':
		            direction = !direction;
		            break;
		
		          case '2':
		            speed /= 2.0;
		            break;
		
		          case '3':
		            speed *= 2.0;
		            break;
		        }
		    };
		
	renderSquare();
}

function renderSquare(){
	gl.clear( gl.COLOR_BUFFER_BIT );

	theta += direction * 0.1;
	
	gl.uniform1f( thetaLoc, theta );

	gl.drawArrays( gl.TRIANGLE_STRIP, 0, 12 );

	setTimeout( function(){ requestAnimFrame( renderSquare ); }, speed );
}


/*
<body>
   <!--画板-->
    // 当浏览器不支持的时候才会出现文字
   <canvas id="canvas" style="background-color: black;">您当前的版本不支持       </canvas>

   <script type="text/javascript">

       // 拿到画板
       var canvas = document.getElementById('canvas');
       canvas.width = 1000;
       canvas.height = 1000;

       // 拿到上下文
       var context = canvas.getContext('2d');
       // 设置线条的颜色
       context.strokeStyle = 'red';
       // 设置线条的宽度
       context.lineWidth = 5;

       // 绘制直线
       context.beginPath();
      // 起点
       context.moveTo(200, 200);
      // 终点
       context.lineTo(500, 200);
       context.closePath();
       context.stroke();
    
   // 绘制弧线
    context.beginPath();

    context.arc(200,200,100,0,Math.PI/2,false);
    context.closePath();
    context.stroke();

    context.strokeStyle = 'red';
    context.arc(200,200,100,0,Math.PI/2, true);
    context.closePath();
    context.stroke();
   </script>

</body>*/