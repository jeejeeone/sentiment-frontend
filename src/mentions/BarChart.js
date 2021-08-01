import { useHistory } from "react-router-dom";

const barConfig = {
    height: 25,
    padding: 3,
    barPadding: 5,
    barMinWidthPercentage: 0.3,
    // Approximation
    charWidth: 10,
    markerLength: 5,
};

const Bar = (props) => {
    const barSize = barConfig.height + barConfig.padding;

    const textY = ((props.index + 1) * barSize) / 2 + (props.index * barSize) / 2;
    const markerY = textY - 1;

    const percentage = (percentage) => percentage + "%";
    const barY = props.index * barSize;
    const barXWithPadding = props.maxTickerCharacters * barConfig.charWidth + barConfig.barPadding;
    const barWidth =
        percentage(
        props.widthPercentage < barConfig.barMinWidthPercentage ?
            barConfig.barMinWidthPercentage : props.widthPercentage
        );

    const countY = textY;
    const countX = barXWithPadding + 5;

    return (
        <g className="barItem">
            <text className="ticker" y={textY} dy=".35em" onClick={() => props.onClick(props.text)}>{props.text}</text>
            <line x1={barXWithPadding - barConfig.markerLength} y1={markerY} x2={barXWithPadding} y2={markerY}></line>
            <g>
                <rect
                    className="bar"
                    width={barWidth}
                    height={barConfig.height}
                    y={barY}
                    x={barXWithPadding}
                    onClick={() => props.onClick(props.text)}
                />
                <text className="count" y={countY} x={countX} dy=".35em">{props.count}</text>
            </g>
        </g>
    );
};

const BarChart = (props) => {
    const maxTickerCharacters = Math.max(...props.tickers.map(item => item.ticker.length));
    const maxCount = Math.max(...props.tickers.map(item => item.count));

    const history = useHistory();

    const goToTicker = (ticker) => {
        history.push("/ticker/" + ticker);
    }

    return (
        <div className="barChartWrapper">
            <svg width="100%" height={props.tickers.length * (barConfig.height + barConfig.padding)}>
                {
                    props.tickers.map((item,index) => {
                        const width = (item.count / maxCount * 100);

                        return <Bar
                            key={item.ticker}
                            widthPercentage={width}
                            text={item.ticker}
                            count={item.count}
                            index={index}
                            maxTickerCharacters={maxTickerCharacters}
                            onClick={goToTicker}
                        />
                    })
                }
            </svg>
        </div>
    );
};

export default BarChart;