import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ResponsiveLine } from "@nivo/line";
import { useRecoilState } from "recoil";
import { breadcrumbsState, root } from "../common/SentimentBreadcrumbs";
import Divider from '@material-ui/core/Divider';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import TimelineIcon from '@material-ui/icons/Timeline';

const data2 = [{"id":"GME","data":[{"y":43,"x":"2021-08-04"},{"y":181,"x":"2021-08-03"}]}]

const TickerView = () => {
    const [data, setData] = React.useState([]);

    const [breadcrumbs, setBreadcrumbs] = useRecoilState(breadcrumbsState);

    let params = useParams();

    useEffect(() => {
        axios.get(`/api/ui/mentions/ticker/` + params.ticker).then(
            (res) => {
                const data = [{
                    id: res.data.ticker,
                    data: res.data.tickerMentions.reverse().map(item => {
                        return {
                            y: item.count,
                            x: item.date,
                        }
                    })
                }];

                console.log(JSON.stringify(data))

                setData(data)
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
            <h2><TimelineIcon />{params.ticker}</h2>
            <div className="App" style={{ height: 400 }}>
                <ResponsiveLine
                    data={data}
                    margin={{ top: 40, right: 150, bottom: 50, left: 40, }}
                    yScale={{ type: 'linear', }}
                    xScale={{
                        type: "time",
                        format: "%Y-%m-%d",
                        useUTC: false,
                        precision: 'day',
                    }}
                    xFormat="time:%Y-%m-%d"
                    axisBottom={{
                        tickRotation: 44,
                        format: '%b %d',
                        tickValues: 'every week',
                    }}
                    pointSize={0}
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