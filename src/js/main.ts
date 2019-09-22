import '../scss/main.scss';

type X = {
  id: string
}

function main() {
  const x: X = {id: "hogehoeg"};
  console.log('xxxx', x);
}


window.addEventListener('DOMContentLoaded', () => {{
    main();
}});
