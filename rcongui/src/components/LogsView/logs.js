import React from "react";
import { toast } from "react-toastify";
import { postData, showResponse, get, handle_http_errors } from "../../utils/fetchUtils";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import { Button } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import _ from "lodash";
import TextField from "@material-ui/core/TextField";
import RefreshIcon from "@material-ui/icons/Refresh";
import Paper from "@material-ui/core/Paper";
import moment from "moment";
import withWidth from "@material-ui/core/withWidth";

const Selector = ({
  classes,
  defaultValue,
  defaultText,
  values,
  currentValue,
  onChange,
  kind
}) => (
    <FormControl className={classes.logsControl}>
      <InputLabel shrink>{kind}</InputLabel>
      <Select
        value={currentValue}
        onChange={e => onChange(e.target.value)}
        displayEmpty
      >
        {defaultValue !== undefined ? (
          <MenuItem value={defaultValue}>
            <em>{defaultText}</em>
          </MenuItem>
        ) : (
            ""
          )}
        {values.map(a => (
          <MenuItem key={a} value={a}>{a}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );

class Logs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: [],
      actions: [],
      players: [],
      playersFilter: "",
      actionsFilter: localStorage.getItem("logs_actions") ? localStorage.getItem("logs_actions") : "",
      minutes: localStorage.getItem("logs_minutes") ? localStorage.getItem("logs_minutes") : 30,
      minutesOptions: [15, 30, 60, 90, 120, 180]
    };

    this.loadLogs = this.loadLogs.bind(this);
    this.setActionFilter = this.setActionFilter.bind(this)
    this.setMinutes = this.setMinutes.bind(this)
  }
  componentDidMount() {
    setTimeout(() => {
      this.loadLogs();
    }, 1000);
  }

  loadLogs() {
    const { actionsFilter, playersFilter, minutes } = this.state;
    let qs = `?since_min_ago=${minutes}`;
    if (actionsFilter !== "") {
      qs += `&filter_action=${actionsFilter}`;
    }
    if (playersFilter !== "") {
      qs += `&filter_player=${playersFilter}`;
    }

    return get(`get_structured_logs${qs}`)
      .then(response => showResponse(response, "get_logs"))
      .then(data => {
        this.setState({
          logs: data.result.logs,
          actions: data.result.actions,
          players: !data.result.players ? [] : data.result.players
        });
      })
      .catch(handle_http_errors);
  }

  setActionFilter(actionsFilter) {
    this.setState({ actionsFilter }, this.loadLogs)
    localStorage.setItem("logs_actions", actionsFilter)
  }

  setMinutes(minutes) {
    this.setState({ minutes }, this.loadLogs)
    localStorage.setItem("logs_minutes", minutes)
  } 

  render() {
    const { classes, width } = this.props;
    const {
      logs,
      players,
      actions,
      actionsFilter,
      minutes,
      minutesOptions
    } = this.state;

    const now = moment();
    return (
      <React.Fragment>
        <Grid container justify="flex-start">
          <Grid item xs={12} className={classes.textLeft}>
            <h1>Logs view</h1>
          </Grid>
        </Grid>
        <Grid container justify="space-around" className={classes.marginBottom}>
          <Grid className={classes.padding} item xs={12} sm={12} md={12} lg={3}>
            <Selector
              classes={classes}
              values={minutesOptions}
              onChange={this.setMinutes}
              currentValue={minutes}
              kind="Show last N minutes"
            />
          </Grid>
          <Grid className={classes.padding} item xs={12} sm={12} md={12} lg={3}>
            <Selector
              classes={classes}
              values={actions}
              onChange={this.setActionFilter}
              currentValue={actionsFilter}
              kind="Filter by type"
              defaultValue=""
              defaultText="ALL"
            />
          </Grid>
          <Grid className={classes.padding} item xs={12} sm={12} md={12} lg={4}>
            <Autocomplete
              id="tags-outlined"
              options={players.sort()}
              getOptionLabel={option => option}
              filterSelectedOptions
              onChange={(e, value) =>
                this.setState(
                  { playersFilter: value ? value : "" },
                  this.loadLogs
                )
              }
              renderInput={params => (
                <TextField
                  className={classes.logsControl}
                  {...params}
                  variant="outlined"
                  label="Filter by player"
                />
              )}
            />
          </Grid>
          <Grid className={classes.padding} item xs={12} sm={12} md={12} lg={2}>
            <Button
              className={classes.logsControl}
              disableElevation
              size="large"
              variant="outlined"
              onClick={this.loadLogs}
            >
              Refresh <RefreshIcon />
            </Button>
          </Grid>
        </Grid>
        <Grid container justify="center" alignItems="center">
          <Grid xs={12}>
            <Paper className={classes.paperLogs}>
              {logs.map(l => (
                <pre key={l.raw} className={classes.logs}>{moment(new Date(l.timestamp_ms)).format("HH:mm:ss - ddd, MMM D") + '\t' + l.action.padEnd(20) + l.message}</pre>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default withWidth()(Logs);

