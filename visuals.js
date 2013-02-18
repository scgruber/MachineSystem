// Global GL data structure
var glData = {
  shaderProgram: null,
  pMatrix: mat4.create(),
  mvMatrix: mat4.create(),
  mvMatrixStack: [],
  buf: {
    nodeVertexPos: null,
    rackVertexCol: null,
    physVertexCol: null,
    virtVertexCol: null
  },
  view: {
    x: 0,
    y: 0,
    z: -2500
  },
  tic: 0
};

var gl;

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
  gl.linkProgram(glData.shaderProgram);

  if (!gl.getProgramParameter(glData.shaderProgram, gl.LINK_STATUS)) {
    alert('Could not initialize shaders');
  }

  gl.useProgram(glData.shaderProgram);

  glData.shaderProgram.vertexPos = gl.getAttribLocation(glData.shaderProgram, 'aVertexPosition');
  gl.enableVertexAttribArray(glData.shaderProgram.vertexPos);

  glData.shaderProgram.vertexCol = gl.getAttribLocation(glData.shaderProgram, 'aVertexColor');
  gl.enableVertexAttribArray(glData.shaderProgram.vertexCol);

  glData.shaderProgram.pMatrixUniform = gl.getUniformLocation(glData.shaderProgram, 'uPMatrix');
  glData.shaderProgram.mvMatrixUniform = gl.getUniformLocation(glData.shaderProgram, 'uMVMatrix');
}

function setMatrixUniforms() {
  gl.uniformMatrix4fv(glData.shaderProgram.pMatrixUniform, false, glData.pMatrix);
  gl.uniformMatrix4fv(glData.shaderProgram.mvMatrixUniform, false, glData.mvMatrix);
}

function mvPushMatrix() {
  var copy = mat4.create();
  mat4.set(glData.mvMatrix, copy);
  glData.mvMatrixStack.push(copy);
}

function mvPopMatrix() {
  if (glData.mvMatrixStack.length == 0) {
    throw "invalid popMatrix!";
  }
  glData.mvMatrix = glData.mvMatrixStack.pop();
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


  glData.buf.rackVertexCol = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, glData.buf.rackVertexCol);
  colors = [];
  for (var i=0; i<4; i++) {
    colors = colors.concat([1.0, 0.5, 0.5, 1.0]);
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  glData.buf.rackVertexCol.itemSize = 4;
  glData.buf.rackVertexCol.numItems = 4;


  glData.buf.physVertexCol = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, glData.buf.physVertexCol);
  colors = [];
  for (var i=0; i<4; i++) {
    colors = colors.concat([0.5, 1.0, 0.5, 1.0]);
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  glData.buf.physVertexCol.itemSize = 4;
  glData.buf.physVertexCol.numItems = 4;


  glData.buf.virtVertexCol = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, glData.buf.virtVertexCol);
  colors = [];
  for (var i=0; i<4; i++) {
    colors = colors.concat([0.5, 0.5, 1.0, 1.0]);
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  glData.buf.virtVertexCol.itemSize = 4;
  glData.buf.virtVertexCol.numItems = 4;
}

function drawScene(interval) {
  gl.viewport(0, 0, gl.vpWidth, gl.vpHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  mat4.perspective(45, gl.vpWidth / gl.vpHeight, 0.1, 5000.0, glData.pMatrix);
  mat4.identity(glData.mvMatrix);
  mat4.translate(glData.mvMatrix, [glData.view.x, glData.view.y, glData.view.z]);

  for (r in machinesystem.rackList) {
    machinesystem.rackList[r].draw(interval);
  }
}

function updateScene() {
  return;
}

function doNextFrame() {
  toc = new Date().getTime();
  requestAnimFrame(doNextFrame);
  drawScene((toc-glData.tic)/1000.0);
  updateScene();
  glData.tic = toc;
}

function webGLStart() {
  var canvas = document.getElementById('visualization');
  initGL(canvas);
  initShaders();
  initBuffers();

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  doNextFrame();

  glData.tic = new Date().getTime();
}