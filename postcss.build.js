import fs from 'fs';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';

const css = fs.readFileSync('src/tailwind.css', 'utf8');

postcss([tailwindcss])
  .process(css, { from: 'src/tailwind.css', to: 'public/tailwind.css' })
  .then(result => {
    fs.writeFileSync('public/tailwind.css', result.css);

    if (result.map) {
      fs.writeFileSync('public/tailwind.css.map', result.map);
    }
  });