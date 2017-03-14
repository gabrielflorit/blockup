const margin = { top: 10, right: 30, bottom: 30, left: 30 }
const width = 960 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

const svg = d3.select('body').append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)

const g = svg.append('g')
	.attr('transform', `translate(${margin.left}, ${margin.top})`)
