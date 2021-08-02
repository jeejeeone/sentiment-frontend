import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ResponsiveLine } from "@nivo/line";
import { useRecoilState } from "recoil";
import { breadcrumbsState, root } from "../common/SentimentBreadcrumbs";

const data1 = [
    {
        id: "hours",
        data: [
            { y: "123", x: "2019-05-29" },
            { y: "123", x: "2019-05-30" },
            { y: "12", x: "2019-05-31" },
        ],
    },
];

const TickerView = () => {
    const [data, setData] = React.useState([]);

    const [breadcrumbs, setBreadcrumbs] = useRecoilState(breadcrumbsState);

    let params = useParams();

    useEffect(() => {
        axios.get(`/api/ui/mentions/ticker/` + params.ticker).then(
            (res) => {
                const data = [{
                    id: res.data.ticker,
                    data: res.data.tickerMentions.map(item => {
                        return {
                            y: item.count,
                            x: item.date + " 00:00"
                        }
                    })
                }];

                console.log(data);
            })

        setBreadcrumbs([
            root,
            {
                label: params.ticker,
                path: "/ticker/" + params.ticker,
            }
        ]);
    }, []);

    return (
        <Container maxWidth="md" className="tickerViewContainer">
            aa
            <div className="App" style={{ height: 400 }}>

                <ResponsiveLine
                    data={data1}
                    margin={{ top: 40, right: 150, bottom: 50, left: 40, }}
                    yScale={{ type: "point", }}
                    xScale={{
                        type: "time",
                        format: "%Y-%m-%d",
                        precision: "day",
                    }}
                    xFormat="time:%Y-%m-%d"
                    axisBottom={{
                        tickRotation: 44,
                        format: "%Y-%m-%d",
                        legendPosition: "middle",
                        tickValues: "every day",
                    }}
                    pointSize={10}
                    pointColor="white"
                    pointBorderWidth={2}
                    pointBorderColor={{ from: "serieColor", }}
                    useMesh={true}
                />
            </div>
        </Container>
    );
}

export default TickerView;