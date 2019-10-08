import '../scss/main.scss';
import { SimpleBeam } from "./SimpleBeam";

function main() {
  const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
  SimpleBeam.draw(canvas);
}

window.addEventListener('DOMContentLoaded', () => {{
  main();
}});
