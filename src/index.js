import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Fuse from "fuse.js";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Toolbar from "@material-ui/core/Toolbar";

const nbrFormat = new Intl.NumberFormat();

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  table: {
    minWidth: 650
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  }
}));

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },

  spacer: {
    flex: "1 1 10%"
  },
  actions: {},
  title: {
    marginTop: "10px",
    flex: "0 0 auto"
  }
}));

const lowPrice = x =>
  Math.floor(x * 0.75) + Math.ceil(Math.floor(x * 0.75) * 0.1);

const neutralPrice = x => x;

const highPrice = x => x + Math.ceil(x * 0.35);

const mirrorPrice = x => [Math.floor(x * 0.25), Math.ceil(x * 0.35)];

const Gold = ({ cost }) => (
  <TableCell>
    {nbrFormat.format(cost)}
    &nbsp;
    <img
      alt="Gold.png"
      src="https://gamepedia.cursecdn.com/moonlighter_gamepedia_en/thumb/1/10/Gold.png/20px-Gold.png?version=c02662f643e96dc752bbac9f59ef0739"
      width="20"
      height="20"
      srcset="https://gamepedia.cursecdn.com/moonlighter_gamepedia_en/thumb/1/10/Gold.png/30px-Gold.png?version=c02662f643e96dc752bbac9f59ef0739 1.5x, https://gamepedia.cursecdn.com/moonlighter_gamepedia_en/1/10/Gold.png?version=c02662f643e96dc752bbac9f59ef0739 2x"
    />
  </TableCell>
);

function App() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  const classes = useStyles();
  const toolbarClasses = useToolbarStyles();

  const fuse = new Fuse(items, {
    threshold: 0.1,
    keys: ["name"]
  });

  useEffect(() => {
    (async () => {
      const result = await fetch(
        //"https://uploads.codesandbox.io/uploads/user/d6a598aa-2a6e-4c71-8dc5-bf85b19a9389/05vW-Moonlighter%20Items%20[Updated%205_31_2019][v1.9.19]%20-%20All.csv"
        "https://moonlighter.gamepedia.com/index.php?title=Special:CargoExport&format=json&tables=Item&fields=_pageName%3DPage%2CName%3DName%2CImage%3DImage%2CCulture%3DCulture%2CStack%3DStack%2CDescription%3DDescription%2CGold%3DGold%2CMat1%3DMat1%2CCount1%3DCount1%2CMat2%3DMat2%2CCount2%3DCount2%2CMat3%3DMat3%2CCount3%3DCount3%2CRival%3DRival%2CPotion%3DPotion%2CPerfectN%3DPerfectN&order_by%5B0%5D=%60_pageName%60&order_by%5B1%5D=%60Name%60&order_by%5B2%5D=%60Image%60"
      );

      const rawItems = await result.json();
      // const [, ...rawItems] = body.split("\n");
      setItems(
        rawItems
        //.map(item => item.split(","))
        // .map(([name, normal, high]) => ({ name, normal, high }))
      );
    })();
  });

  return (
    <Container maxWidth="md">
      <Paper className={classes.root}>
        <Toolbar className={toolbarClasses.root}>
          <div className={toolbarClasses.title}>
            <Typography variant="h6">Price Finder</Typography>
          </div>
          <div className={toolbarClasses.spacer} />
          <TextField
            label="Filter"
            placeholder="Thermo Magnetic Engine"
            fullWidth
            value={search}
            onChange={evt => setSearch(evt.target.value)}
          />
        </Toolbar>

        <Table className={classes.table}>
          <TableHead>
            <TableCell>Item</TableCell>
            <TableCell>
              <img
                alt="Neutral Demand"
                src="https://gamepedia.cursecdn.com/moonlighter_gamepedia_en/thumb/5/5f/Neutral_Popularity.png/140px-Neutral_Popularity.png"
              />
            </TableCell>

            <TableCell>
              <img
                alt="High Demand"
                src="https://gamepedia.cursecdn.com/moonlighter_gamepedia_en/thumb/6/6f/High_Popularity.png/140px-High_Popularity.png"
              />
            </TableCell>
          </TableHead>
          <TableBody>
            {(search ? fuse.search(search) : items).map(
              ({ name, normal, high }) => (
                <TableRow>
                  <TableCell>{name}</TableCell>
                  <Gold cost={normal} />
                  <Gold cost={high} />
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
