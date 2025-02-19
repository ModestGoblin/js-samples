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
const events = [
  "bounds_changed",
  "center_changed",
  "click",
  "contextmenu",
  "dblclick",
  "drag",
  "dragend",
  "dragstart",
  "heading_changed",
  "idle",
  "maptypeid_changed",
  "mousemove",
  "mouseout",
  "mouseover",
  "projection_changed",
  "resize",
  "rightclick", // use contextmenu
  "tilesloaded",
  "tilt_changed",
  "zoom_changed",
];

function setupListener(map: google.maps.Map, name: string) {
  const eventRow = document.getElementById(name) as HTMLElement;
  google.maps.event.addListener(map, name, () => {
    eventRow.className = "event active";
    const timeout = setTimeout(() => {
      eventRow.className = "event inactive";
    }, 1000);
  });
}

function initMap(): void {
  populateTable();
  const mapDiv = document.getElementById("map") as HTMLElement;
  const map = new google.maps.Map(mapDiv, {
    center: new google.maps.LatLng(37.4419, -122.1419),
    zoom: 13,
    mapTypeId: "roadmap",
  });

  for (let i = 0; i < events.length; i++) {
    setupListener(map, events[i]);
  }
}

// Dynamically create the table of events from the defined hashmap
function populateTable() {
  const eventsTable = document.getElementById("events") as HTMLElement;
  let content = "";

  for (let i = 0; i < events.length; i++) {
    content +=
      '<div class="event" id="' + events[i] + '">' + events[i] + "</div>";
  }
  eventsTable.innerHTML = content;
}
export { initMap };
