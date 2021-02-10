function resize() {}

async function init() {

  // 1. Create chart dimensions

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

  // Make up some data
  const packdata = Array.from({length: 100}, d3.randomBernoulli(0.5))
  const flatNodeHeirarchy =  d3.hierarchy(packdata);
  const packed = d3.pack(flatNodeHeirarchy)
  console.log(flatNodeHeirarchy)
  // 3. Draw canvas

  const packex = d3.select("#packex")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const leaf = packex.selectAll("g")
    .data(packed.leaves())
    .enter()
    .append("g")
    .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

  const circle = leaf.append("circle")
    .attr("r", d => d.r)
    .attr("fill", d => "#bbccff");

  // 4. Create scales


  // 5. Draw data
  // 6. Draw peripherals

}

export default {resize, init};