import React, { useCallback, useMemo, useRef, useState } from "react";
import { AxisBottom } from "@visx/axis";
import { curveMonotoneX } from "@visx/curve";
import { Group } from "@visx/group";
import { scaleLinear, scaleTime } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { localPoint } from '@visx/event';
import { useEffect } from "react";
import { filteredDataState } from "./state";
import { useRecoilValue } from "recoil";

interface ValueGraphBrushProps {
    data: Array<DataPoint>,
    width: number,
    height: number,
    margin: {
        x: number,
        y: number
    },
    startFromZero: boolean
}

function getX(dataPoint: DataPoint) {
    return new Date(dataPoint.date).valueOf();
}

function getY(dataPoint: DataPoint) {
    return dataPoint.value;
}

function getXValues(data: ValueGraphBrushProps['data']) {
    return data.map(dataPoint => new Date(dataPoint.date))
}

function getYValues(data: ValueGraphBrushProps['data']) {
    return data.map(dataPoint => dataPoint.value.toFixed(1))
}

function getFilteredDataDomain(data: DataPoint[]) {
    if (data.length > 1) {
        const firstDate = data[0].date;
        const lastDate = data[data.length-1].date;

        const firstValue = new Date(firstDate).valueOf();
        const lastValue = new Date(lastDate).valueOf();

        return [firstValue, lastValue]
    }
}

const ValuGraphBrush = ({ data, width, height: heightFromProps, margin, startFromZero }: ValueGraphBrushProps) => {
    const height = heightFromProps / 2;  // the brush has to be smaller than the actual graph. height/3 is temporary
    const filteredData = useRecoilValue(filteredDataState);
    const [start, end] = useMemo(() => {return getFilteredDataDomain(filteredData) || []}, [filteredData]);

    // extract dates and date.valueOf()
    const x = useMemo(() => getXValues(data), [data])
    const xValues = useMemo(() => x.map(entry => entry.valueOf()), [x])

    // extract chaos values
    const y = useMemo(() => getYValues(data), [data])
    const yValues = useMemo(() => y.map(entry => Number(entry)), [y])

    // define x- and y-scales
    const timeScale = scaleTime({
        domain: [Math.min(...xValues), Math.max(...xValues)],
        range: [0, width - margin.x]
    });

    const yScale = scaleLinear({
        domain: [startFromZero ? 0 : Math.min(...yValues), Math.max(...yValues)],
        range: [height - margin.y, 0]
    });

    const brushRef = useRef() as React.MutableRefObject<SVGSVGElement>;  // create ref for localPoint to use in handleMousePoint()

    // add a piece of state to store mouse coordinates
    const [mousePoint, setMousePoint] = useState({ x: 0, y: 0 });
    const [brushEndpoints, setBrushEndpoints] = useState({ mouseUp: 0, mouseDown: 0})

    // create mouseMove handler to store mouse location in state
    const handleMousePoint = useCallback((e: React.MouseEvent) => {
        const point = localPoint(brushRef.current, e) || { x: 0, y: 0};

        const x0 = timeScale.invert(point.x - margin.x/2)
        const y0 = yScale.invert(point.y - margin.y/2);

        setMousePoint({ x: x0.valueOf(), y: y0 })
        
    }, [brushRef.current, data]);

    const handleMouseEvent = useCallback((e: React.MouseEvent, action: { type: 'mouseUp' | 'mouseDown' }) => {
        const point = localPoint(brushRef.current, e) || { x: 0, y: 0};
        setBrushEndpoints(cur => ({...cur, [action.type]: point.x}))

        switch (action.type) {
            case 'mouseDown': 
                setBrushEndpoints({ mouseDown: point.x, mouseUp: 0})
                break;
            case 'mouseUp':
                setBrushEndpoints(cur => ({...cur, 'mouseUp': point.x}))
                break;
            default:
                break;
        }
    }, [setBrushEndpoints, brushRef.current, data])


    useEffect(() => {
        console.log(brushEndpoints);
    }, [brushEndpoints])

    // useEffect(() => {
    //     if (filteredData && end) {
    //         console.log(getFilteredDataDomain(filteredData));
    //         console.log(timeScale(start));
    //         console.log(timeScale(mousePoint.x));
    //     }
    // }, [filteredData, mousePoint])

    return (
        <>
            {data?.length > 1 &&
                <svg
                    key={Math.random()}
                    width={width}
                    height={height}
                    ref={brushRef}
                    onMouseMove={e => handleMousePoint(e)}
                    onMouseDown={(e) => handleMouseEvent(e, {type: 'mouseDown'})}
                    onMouseUp={(e) => handleMouseEvent(e, {type: 'mouseUp'})}
                >
                    <Group top={margin.y / 2} left={margin.x / 2}>
                        <LinePath
                            data={data}
                            curve={curveMonotoneX}
                            x={d => timeScale(getX(d))}
                            y={d => yScale(getY(d))}
                            stroke={"black"}
                            strokeWidth={2}
                            strokeOpacity={1}
                        />

                        <AxisBottom
                            top={height - margin.y}
                            scale={timeScale}
                            numTicks={7}
                        />

                        { mousePoint.x && mousePoint.y && 
                            <circle 
                                cx={timeScale(mousePoint.x)}
                                cy={yScale(mousePoint.y)}
                                r={3}
                                stroke="red"
                                fill="white"
                            />
                        }

                        { brushEndpoints.mouseUp && brushEndpoints.mouseDown &&
                            <rect 
                                width={Math.abs(brushEndpoints.mouseDown-brushEndpoints.mouseUp)}
                                fill="transparent"
                                stroke="deepskyblue"
                                strokeWidth={3}
                                strokeOpacity={0.8}
                                height={height-0.8*margin.y}
                                y={-margin.y/3}
                                x={Math.min(brushEndpoints.mouseDown, brushEndpoints.mouseUp) - margin.x/2}
                            />
                        }
                    </Group>
                </svg>
            }
        </>
    )
}

export default ValuGraphBrush