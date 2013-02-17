// Keyboard control of pan and zoom

$('#visualization').keypress(function() {
  switch (event.which) {
    case 65: // A (Left)
      glData.view.x++;
      break;
    case 68: // D (Right)
      glData.view.x--;
      break;
    case 83: // S (Down)
      glData.view.y--;
      break;
    case 87: // W (Up)
      glData.view.y++;
      break;
    case 88: // X (Out)
      glData.view.z--;
      break;
    case 90: // Z (In)
      glData.view.z++;
      break;
  }
});