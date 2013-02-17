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
    shader = glData.gl.createShader(glData.gl.FRAGMENT_SHADER);
  } else if (shaderScripts[name].type == 'x-shader/x-vertex') {
    shader = glData.gl.createShader(glData.gl.VERTEX_SHADER);
  } else {
    return null;
  }

  glData.gl.shaderSource(shader, str);
  glData.gl.compileShader(shader);

  if (!glData.gl.getShaderParameter(shader, glData.gl.COMPILE_STATUS)) {
    alert(glData.gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}