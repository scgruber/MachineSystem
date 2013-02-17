$.support.cors = true;

var drowsyUrl = "http://visium.club.cc.cmu.edu:8080";

// Global data structure
var machinesystem = {
  rackList: {},
  physList: {},
  virtList: {}
};

function updateServers() {
  $.ajax(drowsyUrl + '/machinesystem/server', {
    type: 'get',
    success: function (records) {
      return;
    }
  });
}

function Rack(name) {
  this.name = name;
  this.count = 0;
  this.children = [];

  this.x = Math.random() * 10.0;
  this.y = Math.random() * 10.0;
  this.z = Math.random() * 10.0;
}

Rack.prototype.addPhysicalServer = function(pServer) {
  this.count++;
  this.children.push(pServer);
}

Rack.prototype.draw = function() {
  mvPushMatrix();

  mat4.translate(mvMatrix, [this.x, this.y, this.z]);

  gl.bindBuffer(gl.ARRAY_BUFFER, glData.buf.nodeVertexPos);
  gl.vertexAttribPointer(glData.shaderProgram.vertexPos, glData.buf.nodeVertexPos.itemSize, gl.FLOAT, false, 0, 0);
  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, glData.buf.nodeVertexPos.numItems);

  mvPopMatrix();
}

function Phys(name) {
  this.name = name;
  this.mem = 0;
  this.cpu = 0;
  this.disk = 0;

  this.count = 0;
  this.children = [];

  this.orbitRadius = 0.0;
  this.theta = 0.0;
  this.radius = 0.0;
}

Phys.prototype.addVirtualServer = function(vServer) {
  this.count++;
  this.children.push(vServer);
}

function Virt(name) {
  this.name = name;
  this.mem = mem;
  this.cpu = cpu;
  this.disk = disk;

  this.orbitRadius = 0.0;
  this.theta = 0.0;
  this.radius = 0.0;
}