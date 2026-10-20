(function () {
  try {
    var map = document.createElement("script");
    map.type = "importmap";
    map.textContent = JSON.stringify({
      imports: { three: "/vendor/three/build/three.module.js" }
    });
    document.head.appendChild(map);
    var script = document.createElement("script");
    script.type = "module";
    script.src = "/vendor/crema-motion.js";
    document.body.appendChild(script);
  } catch (error) {
    console.error("fixes.js", error);
  }
})();
