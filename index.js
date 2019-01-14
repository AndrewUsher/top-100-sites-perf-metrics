import React from 'react'
import { render } from 'react-dom'
import { VictoryChart, VictoryTheme, VictoryLine } from 'victory'

const googleData = [
  { x: 1, y: 1.7 },
  { x: 2, y: 1.7 },
  { x: 3, y: 3.7 },
  { x: 4, y: 4.1 }
]

const youtubeData = [
  { x: 1, y: 3.2 },
  { x: 2, y: 3.2 },
  { x: 3, y: 4.2 },
  { x: 4, y: 5.6 }
]

const facebookData = [
  { x: 1, y: 5.9 },
  { x: 2, y: 6.3 },
  { x: 3, y: 8.5 },
  { x: 4, y: 10.2 }
]

const wikipediaData = [
  { x: 1, y: 0.9 },
  { x: 2, y: 1 },
  { x: 3, y: 1.2 },
  { x: 4, y: 1.2 }
]

VictoryChart.defaultProps = {
  ...VictoryChart.defaultProps,
  animate: true
}

const Charts = () => (
  <>
    <h1>Top 100 Websites Performance</h1>
    <VictoryChart domain={{ x: [0, 5], y: [0, 15] }}>
      <VictoryLine
        // labels={labels => console.log(labels) || labels.y}
        data={googleData}
        style={{ data: { stroke: '#4285f4' } }}
        animate
      />
      <VictoryLine
        data={youtubeData}
        style={{ data: { stroke: '#ff0000' } }}
        animate
      />
      <VictoryLine
        data={facebookData}
        style={{ data: { stroke: '#3b5998' } }}
      />
      <VictoryLine
        data={wikipediaData}
        style={{ data: { stroke: '#636466' } }}
      />
    </VictoryChart>
  </>
)

render(<Charts />, document.getElementById('root'))
