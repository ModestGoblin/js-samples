/*
 * Copyright 2021 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
import "./style.css";

let map;

const mapOptions = {
  tilt: 0,
  heading: 0,
  zoom: 18,
  center: { lat: 35.6594945, lng: 139.6999859 },
  mapId: "15431d2b469f209e",
};

function initMap() {
  const mapDiv = document.getElementById("map") as HTMLElement;
  map = new google.maps.Map(mapDiv, mapOptions);
  initWebglOverlayView(map);
}

function initWebglOverlayView(map: google.maps.Map) {
  let scene, renderer, camera, loader;
  const webglOverlayView = new google.maps.WebglOverlayView();

  webglOverlayView.onAdd = () => {
    // Set up the scene.
    // @ts-ignore THREE.js loaded from CDN
    scene = new THREE.Scene();
    // @ts-ignore THREE.js loaded from CDN
    camera = new THREE.PerspectiveCamera();
    // @ts-ignore THREE.js loaded from CDN
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75); // Soft white light.
    scene.add(ambientLight);
    // @ts-ignore THREE.js loaded from CDN
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
    directionalLight.position.set(0.5, -1, 0.5);
    scene.add(directionalLight);

    // Load the model.
    // @ts-ignore THREE.js loaded from CDN
    loader = new THREE.GLTFLoader();
    const source =
      "https://raw.githubusercontent.com/googlemaps/js-samples/master/assets/pin.gltf";
    loader.load(source, (gltf) => {
      gltf.scene.scale.set(10, 10, 10);
      gltf.scene.rotation.x = Math.PI; // Rotations are in radians.
      scene.add(gltf.scene);
    });
  };

  webglOverlayView.onContextRestored = (gl: WebGLRenderingContext) => {
    // Create the three.js renderer, using the
    // maps's WebGL rendering context.
    // @ts-ignore THREE.js loaded from CDN
    renderer = new THREE.WebGLRenderer({
      canvas: gl.canvas,
      context: gl,
      ...gl.getContextAttributes(),
    });
    renderer.autoClear = false;

    // Wait to move the camera until the 3D model loads.
    loader.manager.onLoad = () => {
      renderer.setAnimationLoop(() => {
        webglOverlayView.requestRedraw();
        const { tilt, heading, zoom } = mapOptions;
        map.moveCamera({ tilt, heading, zoom });

        // Rotate the map 360 degrees.
        if (mapOptions.tilt < 67.5) {
          mapOptions.tilt += 0.5;
        } else if (mapOptions.heading <= 360) {
          mapOptions.heading += 0.2;
          mapOptions.zoom -= 0.0005;
        } else {
          renderer.setAnimationLoop(null);
        }
      });
    };
  };

  webglOverlayView.onDraw = (gl: WebGLRenderingContext, transformer: any) => {
    // Update camera matrix to ensure the model is georeferenced correctly on the map.
    const matrix = transformer.fromLatLngAltitude(mapOptions.center, 120);
    // @ts-ignore THREE.js loaded from CDN
    camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);

    webglOverlayView.requestRedraw();
    renderer.render(scene, camera);

    // Sometimes it is necessary to reset the GL state.
    renderer.state.reset();
  };
  webglOverlayView.setMap(map);
}
export { initMap };
