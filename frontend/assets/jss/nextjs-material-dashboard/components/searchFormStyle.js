import {
    whiteColor,
} from "assets/jss/nextjs-material-dashboard.js";

const headerLinksStyle = (theme) => ({
    searchButton: {
      [theme.breakpoints.down("sm")]: {
        top: "-50px !important",
        marginRight: "22px",
        float: "right",
      },
    },
    searchIcon: {
      width: "17px",
      zIndex: "4",
    },
    search: {
        "& > div": {
          marginTop: "0",
        },
        [theme.breakpoints.down("sm")]: {
          margin: "10px 15px !important",
          float: "none !important",
          paddingTop: "1px",
          paddingBottom: "1px",
          padding: "0!important",
          width: "60%",
          marginTop: "40px",
          "& input": {
            color: whiteColor,
          },
        },
    },
    searchWrapper: {
      [theme.breakpoints.down("sm")]: {
        width: "-webkit-fill-available",
        margin: "10px 15px 0",
      },
      display: "inline-block",
    },
    margin: {
      zIndex: "4",
      margin: "0",
    },
});
  
  export default headerLinksStyle;
  