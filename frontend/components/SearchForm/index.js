import { Button, makeStyles } from "@material-ui/core";
import CustomInput from "components/CustomInput/CustomInput";
import Search from "@material-ui/icons/Search";
import styles from "assets/jss/nextjs-material-dashboard/components/searchFormStyle";

export default function SearchForm() {
    const classes = makeStyles(styles)();

    return (
        <div className={classes.searchWrapper}>
            <CustomInput
                formControlProps={{
                className: classes.margin + " " + classes.search,
                }}
                inputProps={{
                    placeholder: "Search",
                    inputProps: {
                        "aria-label": "Search",
                    },
                }}
            />
            <Button color="white" aria-label="edit" justIcon round>
                <Search />
            </Button>
        </div>
    );
}