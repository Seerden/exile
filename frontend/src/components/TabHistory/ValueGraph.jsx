import React, { useMemo, useEffect, useCallback } from "react";
import './style/ValueGraph.scss';

import { AreaClosed, Line, Bar, LinePath } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { scaleTime, scaleLinear } from '@visx/scale';
import { LinearGradient } from '@visx/gradient';
import { GridRows, GridColumns } from '@visx/grid';
import { AxisBottom, AxisLeft } from '@visx/axis'

import { getTabHistory, getPingTotalValue } from 'helpers/tabHistory';
import { Group } from "@visx/group";
import { localPoint } from "@visx/event";
import { Tooltip, useTooltip, useTooltipInPortal } from "@visx/tooltip";
import { bisector } from 'd3-array';


function makeData(hoursToPlot) {
    let tabHistory = getTabHistory();

    const data = tabHistory
        .map(entry => {
            return {
                date: entry.date,
                value: getPingTotalValue(entry.items)
            }
        })

    let lastDate = new Date(data[data.length - 1].date);

    let filteredData = data.filter(entry => lastDate - new Date(entry.date) < 1000 * 60 * 60 * hoursToPlot)

    return filteredData
}

const ValueGraph = ({ width, height, margin, hoursToPlot, startFromZero }) => {
    const data = makeData(hoursToPlot);

    const getAllX = data => data.map(entry => new Date(entry.date))
    const getAllY = data => data.map(entry => +entry.value.toFixed(1))

    const x = getAllX(data);
    const y = getAllY(data);

    const getX = d => new Date(d.date).valueOf();
    const getY = d => +d.value;

    const timeScale = scaleTime({
        domain: [Math.min(...x), Math.max(...x)],
        range: [margin.x, width - margin.x]
    })

    const yScale = scaleLinear({
        domain: [startFromZero ? 0 : Math.min(...y), Math.max(...y)],
        range: [height - margin.y, margin.y]
    })

    const bisectDate = bisector(d => new Date(d.date)).left;

    const {
        tooltipData,
        tooltipLeft,
        tooltipTop,
        tooltipOpen,
        showTooltip,
        hideTooltip,
    } = useTooltip();

    const handleMouseOver = useCallback((e) => {
        const coords = localPoint(e);

        const x0 = timeScale.invert(coords.x);

        const index = bisectDate(data, x0, 2);
        const d0 = data[index - 1]?.value ?? 0;
        const d1 = data[index]?.value ?? 0;
        let d = d0;
        if (d1 && getX(d1)) {
            d = x0.valueOf() - getX(d0).valueOf() > getX(d1).valueOf() - x0.valueOf() ? d1 : d0;
        }

        showTooltip({
            tooltipLeft: coords.x,
            tooltipTop: coords.y,
            tooltipData: +d.toFixed(0)
        })
    }, [showTooltip, timeScale, yScale])

    useEffect(() => {
        console.log(tooltipData);
    }, [tooltipData])

    const { containerRef, TooltipInPortal } = useTooltipInPortal({
        detectBounds: true,
        scroll: true,
    })

    return (
        <div className="ValueGraph">
            <header className="ValueGraph__header">
                <h3>Tab value over time</h3>
            </header>

            <svg 
                ref={containerRef} 
                width={width} 
                height={height+3*margin.y}
                onMouseMove={e => handleMouseOver(e)}
                onMouseOut={hideTooltip}
            >
                <Group top={0} left={0}>
                    <rect x={0} y={0} width={width} height={height} fill={"#fff"} rx={3} ry={3} />
                    <LinePath
                        data={data}
                        curve={curveMonotoneX}
                        x={d => timeScale(getX(d))}
                        y={d => yScale(getY(d))}
                        yScale={yScale}
                        stroke={"black"}
                        strokeWidth={2}
                        strokeOpacity={1}
                        
                    />
                    {/* <GridRows
                        left={margin.x}
                        scale={timeScale}
                        width={width}
                        strokeDasharray="0"
                        stroke={'deepskyblue'}
                        strokeOpacity={0.4}
                        pointerEvents="none"
                    />
                    <GridColumns
                        top={margin.y}
                        scale={timeScale}
                        height={height}
                        strokeDasharray="1,3"
                        stroke={'deepskyblue'}
                        strokeOpacity={0.2}
                        pointerEvents="none"
                    />
                    <AxisLeft
                        scale={yScale}
                        tickStroke={'#ccc'}
                        stroke={'#ccc'}
                    />
                */}
                <AxisBottom
                    top={height}
                    scale={timeScale}
                    tickStroke={'#ccc'}
                    stroke={'#ccc'}
                />

                    {data &&
                        data.map((d, i) => (
                            <circle
                                key={`circle-${i}`}
                                r={3}
                                cx={timeScale(getX(d))}
                                cy={yScale(getY(d))}
                                stroke={"black"}
                                fill={"white"}
                            />
                        ))
                    }

                    {tooltipOpen &&
                        <g>
                            <Line
                                from={{ x: tooltipLeft, y: margin.y }}
                                to={{ x: tooltipLeft, y: height }}
                                stroke={'#eee'}
                                strokeWidth={2}
                                pointerEvents="none"
                            />
                            <Line
                                from={{ x: margin.left, y: tooltipTop }}
                                to={{ x: width, y: tooltipTop }}
                                stroke={'#eee'}
                                strokeWidth={2}
                                pointerEvents="none"
                            />
                        </g>
                    }

                    {tooltipOpen &&
                        <TooltipInPortal
                            key={Math.random()}
                            top={tooltipTop}
                            left={tooltipLeft}
                        >
                            {tooltipData}<em>c</em>
                        </TooltipInPortal>
                    }
                </Group>
            </svg>
        </div>
    )
}

export default ValueGraph