function resize() {}

async function init() {

  // 1. Access data

  const countryShapes = await d3.json("assets/data/mada.json")
  const dataset = await d3.csv("assets/data/burden_2010.csv")

  const countryIdAccessor = d => d.properties["ISO_A3"]

  const metric = "deaths_per_100k"

  let metricDataByCountry = {}
  dataset.forEach(d => {
    metricDataByCountry[d["iso"]] = +d["deaths_per_100k"] || 0
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
    .center([-5, 47])                // GPS of location to zoom on
    .scale(980)                       // This is like the zoom

  const pathGenerator = d3.geoPath(projection)
  const [[x0, y0], [x1, y1]] = pathGenerator.bounds(sphere)

  dimensions.boundedHeight = y1
  dimensions.height = dimensions.boundedHeight
    + dimensions.margin.top
    + dimensions.margin.bottom

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

  // 4. Create scales

  const metricValues = Object.values(metricDataByCountry)
  const metricValueExtent = d3.extent(metricValues)
  const maxChange = d3.max([metricValueExtent[0], metricValueExtent[1]])
  const colorScale = d3.scaleLinear()
      .domain([0, maxChange])
      .range(["#EEEEEE", "darkred"])
    
  // 5. Draw data
  const countries = bounds.selectAll(".country")
    .data(countryShapes.features)
    .enter().append("path")
      .attr("class", "country")
      .attr("d", pathGenerator)
      .attr("stroke-width", 0.1)
      .attr("fill", d => {
        const metricValue = metricDataByCountry[countryIdAccessor(d)]
        
        if (typeof metricValue == "undefined") return "#e2e6e9"
        return colorScale(metricValue)
      })
  
}

export default {resize, init };