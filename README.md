# iiif-layout-functions

Iiif-layout-functions takes a set of IIIF Presentation Canvases and calculates a number of useful layouts for displaying them in a normalised coordinate system. Layouts are contingent upon parameters such as the viewing-hint, viewing-direction, and other UX considerations. The normalised x,y, width, and height coordinates can be consumed by any rendering context, providing separation of concerns for representing IIIF canvases to the end user. There are no events, DOM elements, or other runtime APIs foisted on the user for interacting with canvases. A list of canvases goes in, and raw numbers come out.

## Getting Started
To run the example locally, clone this repository and run 
`npm install`
`webpack`
`webpack-dev-server --content-base example/`

Then visit `localhost:8080` in the browser, and you should see some useful examples of how these layouts can be rendered in a variety of contexts.
