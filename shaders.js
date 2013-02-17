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