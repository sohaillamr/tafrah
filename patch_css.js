const fs = require('fs');

const addition = `
/* AUTISM / SENSORY REGULATION MODE */
[data-profile="autism"] {
  --bg-color: #E2E8F0;
  --text-color: #334155;
  --panel-bg: #F1F5F9;
  --container-pad: 20%;
}
[data-profile="autism"] * {
  animation: none !important;
  transition: none !important;
}

/* CP / MOTOR ADAPTIVE MODE */
[data-profile="cp"] button, 
[data-profile="cp"] a, 
[data-profile="cp"] input,
[data-profile="cp"] select {
  min-height: 64px !important;
  min-width: 64px !important;
  margin: 8px; /* avoid accidental clicks by spacing */
}
[data-profile="cp"] :focus-visible {
  outline: 4px solid #FFD700 !important;
  outline-offset: 4px !important;
}

/* focus mode */
.focus-mode header,
.focus-mode footer {
  display: none !important;
}
`;

fs.appendFileSync('app/globals.css', addition);
console.log('globals updated');
