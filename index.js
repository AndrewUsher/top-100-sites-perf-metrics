import React from 'react'
import { render } from 'react-dom'
import {
  VictoryChart,
  VictoryTheme,
  VictoryLine,
  VictoryZoomContainer,
  VictoryTooltip,
  VictoryVoronoiContainer
} from 'victory'
import stats from './stats'
import COLORS from './colors'

const Charts = () => (
  <>
    <VictoryChart
      padding={80}
      domainPadding={{ x: 10, y: 10 }}
      domain={{ x: [1, 4] }}
      height={window.innerHeight / 2.7}
      width={window.innerWidth / 3}
      theme={VictoryTheme.material}
      containerComponent={<VictoryVoronoiContainer />}
    >
      {stats.slice(0, 9).map(stat => (
        <VictoryLine
          labelComponent={
            <VictoryTooltip
              cornerRadius={0}
              theme={VictoryTheme.material}
              pointerWidth={10}
              flyoutStyle={{
                stroke: 'none'
              }}
              text={d => `${d.label}: ${d.y}s`}
              style={{
                fontSize: '7px',
                fontFamily: 'Open Sans',
                letterSpacing: '0.3px'
              }}
            />
          }
          data={stat}
          style={{
            data: {
              stroke: COLORS[Math.floor(Math.random() * COLORS.length)],
              strokeWidth: 1.5
            }
          }}
        />
      ))}
    </VictoryChart>
  </>
)

render(<Charts />, document.getElementById('root'))
