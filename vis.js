var camera, scene, renderer;
var machinesystem = {
  rackList: {},
  physList: {},
  virtList: {}
};

$(document).ready(function() {
  init();
  updateServers();
  animate();
  window.setInterval(function() {
    updateServers();
  }, 30000);
});

function init() {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 1000;

  scene = new THREE.Scene();

  renderer = new THREE.CanvasRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);

  for (rack in machinesystem.rackList) {
    machinesystem.rackList[rack].animate();
    for (var i=machinesystem.rackList[rack].children.length-1; i>=0; i--) {
      machinesystem.rackList[rack].children[i].animate();
    }
  }

  renderer.render(scene, camera);
}

function updateServers() {
  var drowsyUrl = "http://visium.club.cc.cmu.edu:8080";
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

function Rack(name) {
  this.name = name;
  this.count = 0; // Incl. subchildren
  this.children = [];

  this.mesh = new THREE.Mesh(
    new THREE.SphereGeometry(25, 16, 16),
    new THREE.MeshLambertMaterial({color: 0xff7f7f})
  );

  //this.mesh.position.x = Math.random()*50;
  //this.mesh.position.y = Math.random()*50;
  //this.mesh.position.z = Math.random()*50;

  scene.add(this.mesh);
}

Rack.prototype.addPhysicalServer = function(pServer) {
  this.count++;
  this.children.push(pServer);
  pServer.racked = true;
}

Rack.prototype.animate = function() {
  this.count = this.children.length;
  for (var i=this.children.length-1; i>=0; i--) {
    this.count += this.children[i].children.length;
  }
  this.mesh.scale.x = this.count+1;
  this.mesh.scale.y = this.count+1;
  this.mesh.scale.z = this.count+1;
}

function Phys(name, parent) {
  this.name = name;
  this.parent = parent;
  this.mem = 0;
  this.cpu = 0;
  this.disk = 0;

  this.count = 0;
  this.children = [];

  this.mesh = new THREE.Mesh(
    new THREE.SphereGeometry(25, 16, 16),
    new THREE.MeshLambertMaterial({color: 0x7fff7f})
  );
  this.theta = 0.0;
  this.orbit = 0.0;

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

Phys.prototype.animate = function() {
  var pNode = machinesystem.rackList[this.parent];
  this.mesh.position.x = pNode.mesh.position.x + (this.orbit * Math.cos(this.theta));
  this.mesh.position.y = pNode.mesh.position.y + (this.orbit * Math.sin(this.theta));
  this.mesh.position.z = pNode.mesh.position.z;
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
  this.orbitRadius = (this.orbitRadius + (this.mem/50000.0))/2;
  this.speed = (this.speed + (0.001 * this.cpu / 1000.0)) / 1.001;
  this.theta = (this.theta + this.speed + 0.01) % (2*Math.PI);
  this.radius = (this.radius + (this.disk/1000000.0))/2;
}