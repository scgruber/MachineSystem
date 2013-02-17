$.support.cors = true;

var drowsyUrl = "http://visium.club.cc.cmu.edu:8080";

// Global data structure
var machinesystem = {
  rackList: {},
  physList: {},
  virtList: {},
};

function updateServers() {
  $.ajax(drowsyUrl + '/machinesystem/server', {
    type: 'get',
    success: function (servers) {
      for (var i=servers.length-1; i>=0; i--) {
        var srv = servers[i];
        if (srv.kind == 'physical') {
          // Create parent rack if needed
          if (!machinesystem.rackList[srv.parent]) {
            var r = new Rack(srv.parent);
            machinesystem.rackList[srv.parent] = r;
          }

          // Check for existence of machine
          if (!machinesystem.physList[srv.hostname]) {
            var s = new Phys(srv.hostname);
            machinesystem.physList[srv.hostname] = s;
            machinesystem.rackList[srv.parent].addPhysicalServer(s);
          }
          machinesystem.physList[srv.hostname].update(srv);
        } else if (srv.kind == 'virtual') {
          return; // Do this later
        } else {
          console.log('bad server record: ' + srv.hostname);
        }
      }
    }
  });
}

// Make sure this is updated constantly
$(document).ready(function() {
  updateServers();
  window.setInterval(function() {
    updateServers();
  }, 5000);
});

function Rack(name) {
  this.name = name;
  this.count = 0;
  this.children = [];

  this.x = (Math.random()-0.5) * 100.0;
  this.y = (Math.random()-0.5) * 100.0;
  this.z = 0.0;
}

Rack.prototype.addPhysicalServer = function(pServer) {
  this.count++;
  this.children.push(pServer);
}

Rack.prototype.draw = function() {
  mvPushMatrix();

  mat4.translate(glData.mvMatrix, [this.x, this.y, this.z]);

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

Phys.prototype.update = function(serverData) {
  this.mem = serverData.mem;
  this.cpu = serverData.cpu;
  this.disk = serverData.disk;
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