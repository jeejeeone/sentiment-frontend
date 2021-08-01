import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import HomeIcon from "@material-ui/icons/Home";
import { atom, useRecoilState } from "recoil";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    link: {
        display: "flex",
    },
    icon: {
        marginRight: theme.spacing(0.5),
        width: 20,
        height: 20,
    },
}));

// TODO: Maybe improve? Fairly messy, each view has to know full path

export const root = {
    label: "Mentions",
    path: "/"
};

export const breadcrumbsState = atom({
    key: "breadcrumbsState",
    default: [root]
});

const SentimentBreadcrumbs = () => {
    const classes = useStyles();
    const [breadcrumbs, setBreadcrumbs] = useRecoilState(breadcrumbsState);
    const history = useHistory();

    const goTo = (path) => {
        history.push(path);
    };

    return (
        <Breadcrumbs aria-label="breadcrumb" className="sentimentBreadcrumbs">
            {
                breadcrumbs.map((item, index) => {
                    if (index + 1 != breadcrumbs.length || item.path == "/") {
                        return <Link
                            color="inherit"
                            href={item.path}
                            onClick={() => goTo(item.path)}
                            className={classes.link}
                            key={item.path}
                        >
                            {item.path == "/" ? <HomeIcon className={classes.icon} /> : null }
                            {item.label}
                        </Link>
                    } else {
                        return <Typography
                            key={item.path}
                            color="textPrimary"
                            className={classes.link}
                        >
                            {item.label}
                        </Typography>
                    }
                })
            }
        </Breadcrumbs>
    );
}

export default SentimentBreadcrumbs;