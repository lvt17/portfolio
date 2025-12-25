const aboutSketch = (p) => {
  let img;
  let icons = [];
  let gridCols, gridRows;
  let spacing = 100;
  let isMobile = false;

  p.preload = () => {
    img = p.loadImage("figma/assets/pattern 3 1.png");
  };

  p.setup = () => {
    isMobile = p.windowWidth < 768;

    // Don't create canvas on mobile for performance
    if (isMobile) {
      return;
    }

    const aboutEl = document.querySelector("#about");
    if (!aboutEl) return;

    const c = p.createCanvas(
      p.windowWidth,
      aboutEl.offsetHeight
    );
    c.parent("bg-canvas-about");

    p.imageMode(p.CENTER);
    p.noStroke();
    p.clear();

    // Optimize: reduce framerate on tablet
    const isTablet = p.windowWidth < 1024;
    p.frameRate(isTablet ? 15 : 20);

    // Larger spacing on tablet = fewer icons
    spacing = isTablet ? 150 : 100;

    gridCols = Math.ceil((p.width + spacing) / spacing);
    gridRows = Math.ceil((p.height + spacing) / spacing);

    for (let y = 0; y < gridRows; y++) {
      for (let x = 0; x < gridCols; x++) {
        let tx = x * spacing + spacing / 2;
        let ty = y * spacing + spacing / 2;

        icons.push({
          x: p.random(p.width),
          y: p.random(p.height),
          tx,
          ty,
          size: p.random(40, 80),
          speed: p.random(0.02, 0.05),
          angle: p.random(p.TWO_PI),
          spinning: false,
          spinSpeed: p.random(0.01, 0.05)
        });
      }
    }
  };

  p.draw = () => {
    if (isMobile) return;

    p.clear();

    for (let icon of icons) {
      icon.x = p.lerp(icon.x, icon.tx, icon.speed);
      icon.y = p.lerp(icon.y, icon.ty, icon.speed);

      if (p.dist(icon.x, icon.y, icon.tx, icon.ty) < 1) {
        icon.spinning = true;
      }

      if (icon.spinning) icon.angle += icon.spinSpeed;

      p.push();
      p.translate(icon.x, icon.y);
      p.rotate(icon.angle);
      p.image(img, 0, 0, icon.size, icon.size);
      p.pop();
    }
  };

  p.windowResized = () => {
    if (isMobile) return;

    const aboutEl = document.querySelector("#about");
    if (!aboutEl) return;

    p.resizeCanvas(
      p.windowWidth,
      aboutEl.offsetHeight
    );
  };
};

// Only init on non-mobile
if (window.innerWidth >= 768) {
  new p5(aboutSketch);
}
