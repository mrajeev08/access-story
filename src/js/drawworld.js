function resize() {}

async function init() {

  // 1. Access data

  const countryShapes  = await d3.json("assets/data/countries.json")
  const countryIdAccessor = d => d.properties["adm0_a3"]

  const dataset = await d3.json("assets/data/garc_data.json")
  
  let metricDataByCountry = {}
  dataset.forEach(d => {
    metricDataByCountry[d["iso"]] = +d["deaths"] || 0
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
  const projection = d3.geoEckert3()
    .fitWidth(dimensions.boundedWidth, sphere)

  const pathGenerator = d3.geoPath(projection)
  const [[x0, y0], [x1, y1]] = pathGenerator.bounds(sphere)

  dimensions.boundedHeight = y1
  dimensions.height = dimensions.boundedHeight
    + dimensions.margin.top
    + dimensions.margin.bottom

  // 3. Draw canvas

  const worldmap = d3.select("#worldmap")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const bounds = worldmap.append("g")
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
        const metricValue = metricDataByCountry[countryIdAccessor(d)];
        if (typeof metricValue == "undefined") return "#e2e6e9"
        return colorScale(metricValue)
      })

  // 6. Draw peripherals

  const legendGroup = worldmap.append("g")
      .attr("transform", `translate(${
        120
      },${
        dimensions.width < 800
        ? dimensions.boundedHeight - 30
        : dimensions.boundedHeight * 0.5
      })`)

  const legendTitle = legendGroup.append("text")
      .attr("y", -23)
      .attr("class", "legend-title")
      .text("Burden of human rabies")

  const legendByline = legendGroup.append("text")
      .attr("y", -9)
      .attr("class", "legend-byline")
      .text("Deaths per 100,000 persons in 2010")

  const defs = worldmap.append("defs")
  const legendGradientId = "legend-gradient"
  const gradient = defs.append("linearGradient")
      .attr("id", legendGradientId)
      .selectAll("stop")
      .data(colorScale.range())
      .enter().append("stop")
      .attr("stop-color", d => d)
      .attr("offset", (d, i) => `${
        i * 100 / 2 // 2 is one less than our array's length
      }`)

  const legendWidth = 120
  const legendHeight = 16
  const legendGradient = legendGroup.append("rect")
      .attr("x", -legendWidth / 2)
      .attr("height", legendHeight)
      .attr("width", legendWidth)
      .style("fill", `url(#${legendGradientId})`)

  const legendValueRight = legendGroup.append("text")
      .attr("class", "legend-value")
      .attr("x", legendWidth / 2 + 10)
      .attr("y", legendHeight / 2)
      .text(`${d3.format(".1f")(maxChange)}`)

  const legendValueLeft = legendGroup.append("text")
      .attr("class", "legend-value")
      .attr("x", -legendWidth / 2 - 10)
      .attr("y", legendHeight / 2)
      .text(`${d3.format(".1f")(0)}`)
      .style("text-anchor", "end")
 /*  
  const listenerRect = worldmap.append('rect')
    .attr('class', 'listener-rect')
    .attr('x', 0)
    .attr('y', -dimensions.margin.top)
    .attr('width', dimensions.width)
    .attr('height', dimensions.height)
    .style('opacity', 0);
  
  const zoom = d3.zoom()
    .on('zoom', zoomed);
  
  listenerRect.call(zoom);

  function zoomed() { 
    var transform = d3.event.transform; 
    worldmap.attr('transform', transform.toString()); 
  } */
  
}

export default {resize, init};