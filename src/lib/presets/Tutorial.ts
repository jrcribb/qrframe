export const Tutorial = `export const paramsSchema = {
  Margin: {
    type: "number",
    min: 0,
    max: 10,
    step: 0.1,
    default: 2,
  },
  Foreground: {
    type: "color",
    default: "#000000",
  },
  Background: {
    type: "color",
    default: "#ffffff",
  },
};

export function renderSVG(qr, params) {
  const matrixWidth = qr.version * 4 + 17;
  const margin = params["Margin"];
  const fg = params["Foreground"];
  const bg = params["Background"];

  const size = matrixWidth + 2 * margin;
  let svg = \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="\${-margin} \${-margin} \${size} \${size}">\`;
  svg += \`<rect x="\${-margin}" y="\${-margin}" width="\${size}" height="\${size}" fill="\${bg}"/>\`;
  svg += \`<path fill="\${fg}" d="\`;

  for (let y = 0; y < matrixWidth; y++) {
    for (let x = 0; x < matrixWidth; x++) {
      const module = qr.matrix[y * matrixWidth + x];
      if (module & 1) {
        svg += \`M\${x},\${y}h1v1h-1z\`;
      }
    }
  }
  svg += \`"/></svg>\`;

  return svg;
}

// export function renderCanvas(qr, params, canvas) {
//   const matrixWidth = qr.version * 4 + 17;
//   const margin = params["Margin"];
//   const fg = params["Foreground"];
//   const bg = params["Background"];
//   const unit = 10;
//   const size = (matrixWidth + 2 * margin) * unit;
//   canvas.width = size;
//   canvas.height = size;

//   const ctx = canvas.getContext("2d");
//   ctx.fillStyle = bg;
//   ctx.fillRect(0, 0, size, size)

//   ctx.fillStyle = fg;
//   for (let y = 0; y < matrixWidth; y++) {
//     for (let x = 0; x < matrixWidth; x++) {
//       const module = qr.matrix[y * matrixWidth + x];
//       if (module & 1) {
//         ctx.fillRect((x + margin) * unit, (y + margin) * unit, unit, unit)
//       }
//     }
//   }
// }
`