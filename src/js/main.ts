import '../scss/main.scss';
import { SimpleBeam } from "./SimpleBeam";

function main() {
  const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  SimpleBeam.draw(canvas);
}

window.addEventListener('DOMContentLoaded', () => {{
  main();
}});
