const data = d3.range(10000).map(d3.randomNormal())

const margin = { top: 10, right: 30, bottom: 30, left: 30 }
const width = 960 - margin.left - margin.right
const height = 700 - margin.top - margin.bottom

const absoluteMax = d3.max(data, d => Math.abs(d))

const x = d3.scaleLinear()
	.rangeRound([0, width])
	.domain([-absoluteMax, absoluteMax])

const bins = d3.histogram()
	.domain(x.domain())
	.thresholds(x.ticks(200))
	(data)

const y = d3.scaleLinear()
	.domain([0, d3.max(bins, d => d.length)])
	.range([height, 0])

const svg = d3.select('body').append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
	.append('g')
		.attr('transform', `translate(${margin.left}, ${margin.top})`)

const bar = svg.selectAll('.bar')
		.data(bins)
	.enter().append('g')
		.attr('class', 'bar')
		.attr('transform', d => `translate(${x(d.x0)}, ${y(d.length)})`)

bar.append('rect')
		.attr('x', 1)
		.attr('width', d=> x(d.x1) - x(d.x0))
		.attr('height', d => height - y(d.length))

svg.append('g')
		.attr('class', 'axis axis--x')
		.attr('transform', 'translate(0,' + height + ')')
		.call(d3.axisBottom(x))
