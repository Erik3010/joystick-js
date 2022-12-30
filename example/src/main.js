import "../css/style.css";
import JoyStick from "@erikhau/joystick-js";

const joyStick = new JoyStick({
  selector: "#joystick",
  options: {
    size: 300,
    padding: 30,
  },
  onMove: (obj) => {
    console.log(obj);
  },
});
joyStick.init();
