var Module;
var p8_is_running = false;

function p8_run_cart(cart_url) {
  if (!p8_is_running) {
    create_p8_frame('player', cart_url);
    return;
  }

  console.log(String(cart_url));

  iframe = document.querySelector('iframe');

  destroy_p8_frame(iframe);
  create_p8_frame('player', cart_url);


  // code below keeps the dull attribute upon page reload, not sure how to fix

  // iframe.contentWindow.location.reload();
  
  // iframe.onload = () => {
  //   iframe.contentWindow.p8_run_cart(cart_url);
  //   iframe.focus();
  // };
  return;
}

function create_p8_frame(container_selector, cart_url) {
  const iframe = document.createElement('iframe');
  iframe.sandbox = "allow-scripts allow-same-origin";

  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = 0;

  iframe.srcdoc = `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        html, body {
          margin: 0;
          padding: 0;
        }

        canvas {
          display: block;
          width: 100%;
          height: 100%;
          image-rendering: optimizeSpeed;
          image-rendering: pixelated;
          cursor: none;
        }
      </style>
    </head>
    <body>
      <canvas id="canvas"></canvas>
      <script>
        var Module;

        function p8_run_cart(cart) {
          var canvas = document.getElementById('canvas');

          Module = {
            arguments: [cart],
            canvas: canvas
          };

          var js = document.createElement('script');
          js.src = 'https://www.lexaloffle.com/play/pico8_0207.js';
          document.head.appendChild(js);
        }

      </script>
    </body>
  </html>
  `;

  container = document.getElementById(container_selector);
  container.appendChild(iframe);

  iframe.onload = () => {
    iframe.contentWindow.p8_run_cart(cart_url);
    iframe.focus();
  };
  p8_is_running = true;

  iframe.contentWindow.addEventListener('focus', () => {
    iframe.classList.remove('dull');
  });
  iframe.contentWindow.addEventListener('blur', () => {
    iframe.classList.add('dull');
  });

  iframe.contentWindow.addEventListener("keydown", function (e) {
    const keys = [
      "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
      "z", "x", "c"
    ];
    if (keys.includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  return iframe;
}

function destroy_p8_frame(iframe) {
  if (iframe && iframe.parentNode) {
    iframe.remove();
  }
}