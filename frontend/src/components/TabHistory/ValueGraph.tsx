import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useRecoilState, useRecoilValue } from 'recoil';
import { tabContentState, accountInfoState } from 'state/stateAtoms';
import { useRequest } from 'helpers/hooks/requestHooks';

import './style/ValueGraph.scss';

import { LinePath } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { scaleTime, scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis'
import { Group } from "@visx/group";
import { localPoint } from "@visx/event";
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip";
import { bisector } from 'd3-array';

import ValueGraphBrush from './ValuGraphBrush';
import { filteredDataState } from "./state";

function makeData(hoursToPlot: number, response) {
    if (response) {
        const data = response
            .map(entry => {
                return {
                    date: entry.date,
                    value: entry.totalValue
                }
            })

        let lastDate = new Date(data[data.length - 1].date);
        let filteredData = hoursToPlot > 0 ? data.filter(entry => lastDate.valueOf() - new Date(entry.date).valueOf() < 1000 * 60 * 60 * hoursToPlot) : data;

        return filteredData
    }
}

function ValueGraph({ width, height, margin, hoursToPlot, startFromZero }) {
    const [makeRequest, response] = useRequest({ url: '/db/stashvalue' });
    const tabContentAtom = useRecoilValue(tabContentState);
    const accountInfoAtom = useRecoilValue(accountInfoState);
    const [data, setData] = useState<DataPoint[]>([] as DataPoint[]);
    const [filteredData, setFilteredData] = useRecoilState(filteredDataState);
    const [timeRange, setTimeRange] = useState(hoursToPlot)

    useEffect(() => {  // fetch stashvalue from db on load, or when accountInfo or tabContent changes
        if (accountInfoAtom) {
            makeRequest({
                method: 'GET',
                params: {
                    accountName: accountInfoAtom.accountName,
                    league: accountInfoAtom.league
                }
            });
        }
    }, [accountInfoAtom, tabContentAtom]);

    useEffect(() => {
        if (response) {
            const __data = makeData(timeRange, response);
            const initialData = makeData(hoursToPlot, response);
            setData(initialData);
            setFilteredData(__data);

        }
    }, [response])

    useEffect(() => {
        if (response) {
            setFilteredData(makeData(timeRange, response))
        }
    }, [timeRange])

    const getAllX = filteredData => filteredData.map(entry => new Date(entry.date))
    const getAllY = filteredData => filteredData.map(entry => +entry.value?.toFixed(1))

    const x = useMemo(() => getAllX(filteredData) || [0], [filteredData]);
    const y = useMemo(() => getAllY(filteredData) || [0], [filteredData]);

    const getX = d => new Date(d?.date).valueOf();
    const getY = d => +d?.value ?? 0;

    const timeScale = scaleTime({
        domain: [Math.min(...x), Math.max(...x)],
        range: [0, width - margin.x]
    })

    const yScale = scaleLinear({
        domain: [startFromZero ? 0 : Math.min(...y), Math.max(...y)],
        range: [height - margin.y, 0]
    })

    const bisectDate = bisector(d => new Date(d.date)).left;

    const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip();

    const handleMouseOver = useCallback((e) => {
        if (!filteredData) { return }
        const coords = localPoint(e);
        if (coords) {
            const x0 = timeScale.invert(coords.x - margin.x / 2);
            const index = bisectDate(filteredData, x0, 2);
            const d0 = filteredData[index - 1] ?? 0
            const d1 = filteredData[index] ?? 0
            let d = d0;
            if (d1.value && getX(d1.value)) {
                d = x0.valueOf() - getX(d0.value).valueOf() > getX(d1.value).valueOf() - x0.valueOf() ? d1 : d0;
            }
    
            let tooltipDataY = d.value.toFixed(0);
    
            if (data.length > 1) {
                showTooltip({
                    tooltipLeft: timeScale(getX(d)),
                    tooltipTop: yScale(d.value),
                    tooltipData: tooltipDataY
                })
            }

        }
    }, [showTooltip, timeScale, yScale, filteredData])

    const { containerRef, TooltipInPortal } = useTooltipInPortal({ detectBounds: false, scroll: true })

    return (
        <div className="ValueGraph">
            <header className="ValueGraph__header">
                <h3>Tab value over time</h3>
            </header>

            <div>
                <label
                    htmlFor="timeRange"
                >
                    Time range:
                </label>

                <input
                    name="timeRange"
                    type="number"
                    onChange={(e) => Number(e.target.value) > 0 && setTimeRange(e.target.value)}
                    value={timeRange}
                />
            </div>

            {data.length > 1 &&

                <svg
                    key={Math.random()}
                    ref={containerRef}
                    width={width}
                    height={height}

                    onMouseMove={e => handleMouseOver(e)}
                    onMouseOut={hideTooltip}
                >
                    <Group top={margin.y / 2} left={margin.x / 2}>
                        <LinePath
                            data={filteredData}
                            curve={curveMonotoneX}
                            x={d => timeScale(getX(d))}
                            y={d => yScale(getY(d))}
                            stroke={"black"}
                            strokeWidth={2}
                            strokeOpacity={1}
                        />

                        <AxisLeft
                            scale={yScale}
                            numTicks={7}
                        />
                        <AxisBottom
                            top={height - margin.y}
                            scale={timeScale}
                            numTicks={7}
                        />

                        {filteredData &&
                            filteredData.map((d, i) => (
                                <circle
                                    key={`circle-${i}`}
                                    r={2}
                                    cx={timeScale(getX(d))}
                                    cy={yScale(getY(d))}
                                    stroke={"black"}
                                    fill={"white"}
                                />
                            ))
                        }

                        {tooltipOpen && tooltipTop && tooltipLeft &&
                            <g>
                                <TooltipInPortal
                                    key={Math.random()}
                                    top={margin.y / 2 + tooltipTop}
                                    left={margin.x / 2 + tooltipLeft}
                                    style={{
                                        ...defaultStyles,
                                        transform: 'translateX(-50%) translateY(-200%)',
                                        transition: 'all 100ms linear'
                                    }}
                                >
                                    {tooltipData}<em>c</em>
                                </TooltipInPortal>
                            </g>
                        }
                    </Group>
                </svg>
            }
            <ValueGraphBrush {...{data, width, height, margin, startFromZero}} />
        </div>
    )
}

export default ValueGraph