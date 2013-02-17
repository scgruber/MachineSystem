// Global shader list

var shaderScripts = {};

shaderScripts['frag'] = {
  type: 'x-shader/x-fragment',
  source: [
    'precision mediump float;',
    '',
    'void main(void) {',
    '  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);',
    '}'
  ].join('\n')
};

shaderScripts['vert'] = {
  type: 'x-shader/x-fragment',
  source: [
    'attribute vec3 aVertexPosition;',
    '',
    'uniform mat4 uMVMatrix;',
    'uniform mat4 uPMatrix;',
    '',
    'void main(void) {',
    '  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);',
    '}'
  ].join('\n')
};

function getShader(name) {
  if (!shaderScripts[name]) return null;

  var shader;
  if(shaderScripts[name].type == 'x-shader/x-fragment') {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScripts[name].type == 'x-shader/x-vertex') {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }

  gl.shaderSource(shader, str);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}