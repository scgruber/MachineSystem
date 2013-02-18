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
            var p = new Phys(srv.hostname, srv.parent);
            machinesystem.physList[srv.hostname] = p;
            machinesystem.rackList[srv.parent].addPhysicalServer(p);
          } else if (!machinesystem.physList[srv.hostname].racked) {
            // In case we created as dummy for a virtual machine
            machinesystem.rackList[srv.parent].addPhysicalServer(machinesystem.physList[srv.hostname]);
          }
          machinesystem.physList[srv.hostname].update(srv);
        } else if (srv.kind == 'virtual') {
          // Create parent server if needed
          if (!machinesystem.physList[srv.parent]) {
            var p = new Phys(srv.parent);
            machinesystem.physList[srv.parent] = p;
          }

          // Check for existence of machine
          if (!machinesystem.virtList[srv.hostname]) {
            var s = new Virt(srv.hostname, srv.parent);
            machinesystem.virtList[srv.hostname] = s;
            machinesystem.physList[srv.parent].addVirtualServer(s);
          }
          machinesystem.virtList[srv.hostname].update(srv);
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
  }, 3000);
});

function Rack(name) {
  this.name = name;
  this.count = 0; // Incl. subchildren
  this.children = [];

  this.x = (Math.random()-0.5) * 250.0;
  this.y = (Math.random()-0.5) * 250.0;
  this.z = 0.0;
}

Rack.prototype.addPhysicalServer = function(pServer) {
  this.count++;
  this.children.push(pServer);
  pServer.racked = true;
}

Rack.prototype.draw = function() {
  //Update Code
  this.count = 0;
  for (var i=this.children.length-1; i>=0; i--) {
    this.count += this.children[i].children.length;
  }

  // Draw Code
  mvPushMatrix();

  mat4.translate(glData.mvMatrix, [this.x, this.y, this.z]);
  mat4.scale(glData.mvMatrix, [this.count+1, this.count+1, this.count+1])

  gl.bindBuffer(gl.ARRAY_BUFFER, glData.buf.nodeVertexPos);
  gl.vertexAttribPointer(glData.shaderProgram.vertexPos, glData.buf.nodeVertexPos.itemSize, gl.FLOAT, false, 0, 0);
  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, glData.buf.nodeVertexPos.numItems);

  for (var i=this.children.length-1; i>=0; i--) {
    this.children[i].draw();
  }

  mvPopMatrix();
}

function Phys(name, parent) {
  this.name = name;
  this.parent = parent;
  this.mem = 0;
  this.cpu = 0;
  this.disk = 0;

  this.count = 0;
  this.children = [];

  this.orbitRadius = 0.0;
  this.speed = 0.0;
  this.theta = 0.0;
  this.radius = 0.0;

  this.racked = false;
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

Phys.prototype.draw = function() {
  // Update code
  this.orbitRadius = (this.orbitRadius + (this.mem/50000.0))/2;
  this.speed = (this.speed + (0.25 * this.cpu / 1000.0)) / 1.25;
  this.theta = (this.theta + this.speed) % (2*Math.PI);
  this.radius = (this.radius + (this.disk/1000000.0))/2;

  // Draw code
  mvPushMatrix();

  mat4.rotate(glData.mvMatrix, this.theta, [0, 0, 1]);
  mat4.translate(glData.mvMatrix, [this.orbitRadius, 0, 0]);
  mat4.scale(glData.mvMatrix, [this.radius, this.radius, this.radius]);

  gl.bindBuffer(gl.ARRAY_BUFFER, glData.buf.nodeVertexPos);
  gl.vertexAttribPointer(glData.shaderProgram.vertexPos, glData.buf.nodeVertexPos.itemSize, gl.FLOAT, false, 0, 0);
  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, glData.buf.nodeVertexPos.numItems);

  for (var i=this.children.length-1; i>=0; i--) {
    this.children[i].draw();
  }

  mvPopMatrix();
}

function Virt(name, parent) {
  this.name = name;
  this.parent = parent;
  this.mem = 0;
  this.cpu = 0;
  this.disk = 0;

  this.orbitRadius = 0.0;
  this.speed = 0.0;
  this.theta = 0.0;
  this.radius = 0.0;
}

Virt.prototype.update = function(serverData) {
  this.mem = serverData.mem;
  this.cpu = serverData.cpu;
  this.disk = serverData.disk;
}

Virt.prototype.draw = function() {
    // Update code
  this.orbitRadius = (this.orbitRadius + (this.mem/500000.0))/2;
  this.speed = (this.speed + (0.25 * this.cpu / 1000.0)) / 1.25;
  this.theta = (this.theta + this.speed) % (2*Math.PI);
  this.radius = (this.radius + (this.disk/10000000.0))/2;

  // Draw code
  mvPushMatrix();

  mat4.rotate(glData.mvMatrix, this.theta, [0, 0, 1]);
  mat4.translate(glData.mvMatrix, [this.orbitRadius, 0, 0]);
  mat4.scale(glData.mvMatrix, [this.radius, this.radius, this.radius]);

  gl.bindBuffer(gl.ARRAY_BUFFER, glData.buf.nodeVertexPos);
  gl.vertexAttribPointer(glData.shaderProgram.vertexPos, glData.buf.nodeVertexPos.itemSize, gl.FLOAT, false, 0, 0);
  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, glData.buf.nodeVertexPos.numItems);

  mvPopMatrix();
}