/*
 * Copyright 2019 Google LLC. All Rights Reserved.
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

// This example adds a user-editable rectangle to the map.
function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: { lat: 44.5452, lng: -78.5389 },
      zoom: 9,
    }
  );

  const bounds = {
    north: 44.599,
    south: 44.49,
    east: -78.443,
    west: -78.649,
  };

  // Define a rectangle and set its editable property to true.
  const rectangle = new google.maps.Rectangle({
    bounds: bounds,
    editable: true,
  });
  rectangle.setMap(map);
}
export { initMap };
