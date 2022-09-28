// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

// core components
import { infoColor, title } from "assets/jss/nextjs-material-dashboard";
import Image from "next/image";

const styles = {
    progress: {
      color: infoColor[3],
      width: "350px !important",
      height: "350px !important",
    },
    wrapperDiv: {
      margin: "100px auto",
      padding: "0px",
      maxWidth: "360px",
      textAlign: "center",
      position: "relative",
      zIndex: "9999",
      top: "0",
    },
    progressWrapper: {
      position: "relative"
    },
    iconWrapper: {
      top: 75,
      left: 81,
      position: "absolute"
    },
    title: {
      ...title,
      textAlign: 'center',
      color: "black",
    },
}

export default function CustomLoader({...props}) {
    const useStyles = makeStyles(styles);
    const classes = useStyles();
    return (
        <div>
            <div className={classes.wrapperDiv}>
                <div className={classes.progressWrapper}>
                  <CircularProgress className={classes.progress} />
                  <div className={classes.iconWrapper}>
                    <Image src="/scanner.gif" height={200} width={200} />
                  </div>
                </div>
            </div>
            <h3 className={classes.title}>
                {props.message}...
            </h3>
        </div>
    );
}