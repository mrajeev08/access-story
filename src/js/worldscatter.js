function resize() {}

async function init() {

  // 1. Access data
  const dataset = await d3.csv("assets/data/burden_2010.csv", function(d){
    return {
      deaths: +d.deaths_per_100k,
      dogvax: parseFloat(d.dog_vax_usd),
      pep: parseFloat(d.pep_costs_usd)
    }
  })

  const xAccessor = d => d.pep
  const yAccessor = d => d.deaths
  const colorAccessor = d => d.dogvax

  // 2. Create chart dimensions

  const width = d3.min([
    window.innerWidth * 0.75,
    window.innerHeight * 0.75,
  ])
  let dimensions = {
    width: width,
    height: width,
    margin: {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    },
  }
  dimensions.boundedWidth = dimensions.width
    - dimensions.margin.left
    - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height
    - dimensions.margin.top
    - dimensions.margin.bottom

  // 3. Draw canvas

  const wrapscatt = d3.select("#wrapscatt")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const bounds = wrapscatt.append("g")
      .style("transform", `translate(${
        dimensions.margin.left
      }px, ${
        dimensions.margin.top
      }px)`)

  // 4. Create scales

  const xScale = d3.scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()

  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()

  const colorScale = d3.scaleLinear()
    .domain(d3.extent(dataset, colorAccessor))
    .range(["skyblue", "darkslategrey"])

  // 5. Draw data

  const dots = bounds.selectAll("circle")
    .data(dataset)
    .enter().append("circle")
      .attr("cx", d => xScale(xAccessor(d)))
      .attr("cy", d => yScale(yAccessor(d)))
      .attr("r", 4)
      .attr("fill", d => colorScale(colorAccessor(d)))
      .attr("tabindex", "0")

  // 6. Draw peripherals

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)

  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)

  const xAxisLabel = xAxis.append("text")
      .attr("x", dimensions.boundedWidth / 2)
      .attr("y", dimensions.margin.bottom - 10)
      .attr("class", "axis-title")
      .html("Annual spending on PEP (USD)")

  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    .ticks(4)

  const yAxis = bounds.append("g")
      .call(yAxisGenerator)

  const yAxisLabel = yAxis.append("text")
      .attr("x", -dimensions.boundedHeight / 2)
      .attr("y", -dimensions.margin.left + 10)
      .attr("class", "axis-title")
      .text("Deaths per 100,000 persons")
      .style("transform", "rotate(-90deg)")
}

export default {resize, init};