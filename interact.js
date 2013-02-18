// Keyboard control of pan and zoom

$(document).ready(function() {
  $(document).keydown(function(event) {
    switch (String.fromCharCode(event.which)) {
      case 'A': // A (Left)
        glData.view.x+=5;
        break;
      case 'D': // D (Right)
        glData.view.x-=5;
        break;
      case 'S': // S (Down)
        glData.view.y-=5;
        break;
      case 'W': // W (Up)
        glData.view.y+=5;
        break;
      case 'X': // X (Out)
        glData.view.z-=5;
        break;
      case 'Z': // Z (In)
        glData.view.z+=5;
        break;
    }
  });
});