$.support.cors = true;

var drowsyUrl = "http://visium.club.cc.cmu.edu:8080";

// Global data structure
var machinesystem = {
  rackList: {};
  physList: {};
  virtList: {};
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

  this.x = 0.0;
  this.y = 0.0;
  this.z = 0.0;
}

Rack.prototype.addPhysicalServer(pServer) {
  this.count++;
  this.children.push(pServer);
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

Phys.prototype.addVirtualServer(vServer) {
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