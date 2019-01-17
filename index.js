import React from 'react'
import { render } from 'react-dom'
import { VictoryChart, VictoryTheme, VictoryLine } from 'victory'
import stats from './stats'
import COLORS from './colors'

const Charts = () => (
  <>
    <h1>Top 100 Websites Performance</h1>
    <VictoryChart
      padding={80}
      domainPadding={{ x: 0, y: 30 }}
      domain={{ x: [1, 4] }}
      height={window.innerHeight / 4}
      width={window.innerWidth / 3}
      theme={VictoryTheme.material}
    >
      {stats.map(
        stat =>
          console.log(stat) || (
            <VictoryLine
              data={stat}
              style={{
                data: {
                  stroke: COLORS[Math.floor(Math.random() * COLORS.length)]
                }
              }}
            />
          )
      )}
    </VictoryChart>
  </>
)

render(<Charts />, document.getElementById('root'))
