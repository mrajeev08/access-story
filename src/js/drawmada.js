function resize() {}

async function init() {

  // 1. Access data

  const countryShapes = await d3.json("assets/data/mada.json")

  const dataset = await d3.csv("assets/data/ctar_metadata.csv", function(d){
    return {
      long: parseFloat(d.long),
      lat: parseFloat(d.lat)
    }
  })
  
  // 2. Create chart dimensions
  let dimensions = {
    width: window.innerWidth * 0.9,
    margin: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    },
  }
  dimensions.boundedWidth = dimensions.width
    - dimensions.margin.left
    - dimensions.margin.right

  const sphere = ({type: "Sphere"})
  
  const projection = d3.geoMercator()
    .center([42, -17])                 // GPS of location to zoom on [lat, long]
    .scale(100)                      // This is like the zoom

  const pathGenerator = d3.geoPath(projection)
  const [[x0, y0], [x1, y1]] = pathGenerator.bounds(sphere)

  dimensions.boundedHeight = y1
  dimensions.height = dimensions.boundedHeight
    + dimensions.margin.top
    + dimensions.margin.bottom

  projection.fitSize([dimensions.boundedWidth, dimensions.boundedHeight], countryShapes)

  // 3. Draw canvas

  const madamap = d3.select("#madamap")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const bounds = madamap.append("g")
      .style("transform", `translate(${
        dimensions.margin.left
      }px, ${
        dimensions.margin.top
      }px)`)
    
  // 4. Draw data
  const countries = bounds.selectAll(".country")
    .data(countryShapes.features)
    .enter().append("path")
      .attr("class", "country")
      .attr("d", pathGenerator)
      .attr("stroke-width", 0.1)
      .attr("fill", "grey")
  

    // add points to mada
    madamap.selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .each(function(d){
        d.p1 = projection([d.long, d.lat]);
      })
      .attr("cx", function (d) { return d.p1[0]; })
		  .attr("cy",  function (d) { return d.p1[1]; })
      .attr("r", "2px")
      .attr("fill", "darkred")
  
}

export default {resize, init };