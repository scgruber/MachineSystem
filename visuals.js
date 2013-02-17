// Global GL data structure
var glData = {
  gl: null,
  shaderProgram: null,
  pMatrix: mat4.create(),
  mvMatrix: mat4.create(),
  buf: {
    nodeVertexPos: null
  }
};
var gl = glData.gl; // For brevity

function initGL(canvas) {
  try {
    gl = canvas.getContext('experimental-webgl');
    gl.vpWidth = canvas.width;
    gl.vpHeight = canvas.height;
  } catch(e) {}

  if (!gl) {
    alert("Could not intialize WebGL!");
  }
}

function initShaders() {
  var fragmentShader = getShader('frag');
  var vertexShader = getShader('vert');

  glData.shaderProgram = gl.createProgram();
  gl.attachShader(glData.shaderProgram, vertexShader);
  gl.attachShader(glData.shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(glData.shaderProgram, gl.LINK_STATUS)) {
    alert('Could not initialize shaders');
  }

  gl.useProgram(glData.shaderProgram);

  glData.shaderProgram.vertexPos = gl.getAttribLocation(glData.shaderProgram, 'aVertexPosition');
  gl.enableVertexAttribArray(glData.shaderProgram.vertexPos);

  glData.shaderProgram.pMatrixUniform = gl.getUniformLocation(glData.shaderProgram, 'uPMatrix');
  glData.shaderProgram.mvMatrixUniform = gl.getUniformLocation(glData.shaderProgram, 'uMVMatrix');
}

function setMatrixUniforms() {
  gl.uniformMatrix4fv(glData.shaderProgram.pMatrixUniform, false, glData.pMatrix);
  gl.uniformMatrix4fv(glData.shaderProgram.mvMatrixUniform, false, glData.mvMatrix);
}

function initBuffers() {
  glData.buf.nodeVertexPos = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, glData.buf.nodeVertexPos);

  var vertices = [
    1.0,  1.0,  0.0,
   -1.0,  1.0,  0.0,
    1.0, -1.0,  0.0,
   -1.0, -1.0,  0.0
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  glData.buf.nodeVertexPos.itemSize = 3;
  glData.buf.nodeVertexPos.numItems = 4;
}

function drawScene() {
  gl.viewport(0, 0, gl.vpWidth, gl.vpHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  mat4.perspective(45, gl.vpWidth / gl.vpHeight, 0.1, 100.0, glData.pMatrix);
  mat4.identity(glData.mvMatrix);

  gl.bindBuffer(gl.ARRAY_BUFFER, glData.buf.nodeVertexPos);
  gl.vertexAttribPointer(glData.shaderProgram.vertexPos, glData.buf.nodeVertexPos.itemSize, gl.FLOAT, false, 0, 0);
  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, glData.buf.nodeVertexPos.numItems);
}

function webGLStart() {
  var canvas = document.getElementById('visualization');
  initGL(canvas);
  initShaders();
  initBuffers();

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  drawScene();
}