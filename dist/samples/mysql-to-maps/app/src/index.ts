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

const customLabel = {
  restaurant: {
    label: "R",
  },
  bar: {
    label: "B",
  },
};

function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: new google.maps.LatLng(-33.863276, 151.207977),
      zoom: 12,
    }
  );
  const infoWindow = new google.maps.InfoWindow();

  // Change this depending on the name of your PHP or XML file
  downloadUrl(
    "https://storage.googleapis.com/mapsdevsite/json/mapmarkers2.xml",
    (data) => {
      const xml = data.responseXML;
      const markers = xml.documentElement.getElementsByTagName("marker");
      Array.prototype.forEach.call(markers, (markerElem) => {
        const id = markerElem.getAttribute("id");
        const name = markerElem.getAttribute("name");
        const address = markerElem.getAttribute("address");
        const type = markerElem.getAttribute("type");
        const point = new google.maps.LatLng(
          parseFloat(markerElem.getAttribute("lat")),
          parseFloat(markerElem.getAttribute("lng"))
        );

        const infowincontent = document.createElement("div");
        const strong = document.createElement("strong");
        strong.textContent = name;
        infowincontent.appendChild(strong);
        infowincontent.appendChild(document.createElement("br"));

        const text = document.createElement("text");
        text.textContent = address;
        infowincontent.appendChild(text);
        const icon = customLabel[type] || {};
        const marker = new google.maps.Marker({
          map,
          position: point,
          label: icon.label,
        });
        marker.addListener("click", () => {
          infoWindow.setContent(infowincontent);
          infoWindow.open(map, marker);
        });
      });
    }
  );
}

function downloadUrl(url: string, callback: (data: any) => void) {
  // @ts-ignore
  const request = window.ActiveXObject
    ? // @ts-ignore
      new ActiveXObject("Microsoft.XMLHTTP")
    : new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      request.onreadystatechange = doNothing;
      callback(request);
    }
  };

  request.open("GET", url, true);
  request.send(null);
}

function doNothing() {}
export { initMap };
