// Keyboard control of pan and zoom

$(document).ready(function() {
  $(document).keydown(function(event) {
    alert(event.which);
    switch (String.fromCharCode(event.which)) {
      case 'A': // A (Left)
        glData.view.x++;
        break;
      case 'D': // D (Right)
        glData.view.x--;
        break;
      case 'S': // S (Down)
        glData.view.y--;
        break;
      case 'W': // W (Up)
        glData.view.y++;
        break;
      case 'X': // X (Out)
        glData.view.z--;
        break;
      case 'Z': // Z (In)
        glData.view.z++;
        break;
    }
  });
});