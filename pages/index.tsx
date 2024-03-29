import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  TextField,
} from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { Box, Stack } from "@mui/system";
import React, { useState } from "react";
import _ from "lodash";
import { cosDeg, sinDeg } from "../utils";
import { Car } from "../components/Car";
import {
  DELTA_L,
  DELTA_THETA,
  OF_init,
  LENGTH,
  LENGTH_AC,
  LENGTH_BD,
  NB_ITERATIONS,
  THETA_INIT,
  THETA_WHEELS_INIT,
} from "../utils/parameters";
import { Vector } from "../utils/vector";
import { Rectangle } from "../components/Rectangle";

export default function Home() {
  const [thetaWheels, setThetaWheels] = useState(THETA_WHEELS_INIT);

  const [OF, setOF] = useState<Vector>(OF_init);

  const lengthFE = LENGTH - LENGTH_AC - LENGTH_BD;

  const FE_init = new Vector(
    lengthFE * cosDeg(THETA_INIT),
    lengthFE * sinDeg(THETA_INIT)
  );

  const OE_init = OF_init.add(FE_init);

  const [OE, setOE] = useState<Vector>(OE_init);

  const FE = OE.add(OF.times(-1));
  const theta = (Math.atan2(FE.y, FE.x) * 180) / Math.PI;

  const move = (backwards: boolean): void => {
    const sign = backwards ? -1 : 1;

    const dOE = new Vector(
      cosDeg(theta + thetaWheels),
      sinDeg(theta + thetaWheels)
    ).times(sign * DELTA_L);

    setOE((OE) => OE.add(dOE));

    const dOF = new Vector(cosDeg(theta), sinDeg(theta)).times(
      sign * DELTA_L * cosDeg(thetaWheels)
    );

    setOF((OF) => OF.add(dOF));
  };

  const resetParams = () => {
    setOF(OF_init);
    setOE(OE_init);
    setThetaWheels(THETA_WHEELS_INIT);
  };

  return (
    <Stack direction="row" alignItems="center" spacing={6}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width="1200"
        height="800"
        viewBox="0 0 2000 1500"
        transform="scale(1, -1)"
      >
        <Car OF={OF} OE={OE} thetaWheels={thetaWheels} theta={theta} />

        {/* Border */}
        <rect
          x="0"
          y="0"
          width="2000"
          height="1500"
          stroke="black"
          fillOpacity="0"
        />

        {/* Portal */}
        <rect x="1800" y="1200" width="10" height="300" fill="green" />
        <rect x="1450" y="1200" width="10" height="300" fill="green" />

        {/* Neighbor's car */}
        <Rectangle point={new Vector(1400, 700)} l1={400} l2={180} />
      </svg>

      <Box width="250px">
        <Card raised>
          <CardHeader
            title="Paramètres"
            action={
              <IconButton onClick={resetParams}>
                <Refresh />
              </IconButton>
            }
          />
          <CardContent>
            <Stack spacing={3}>
              <TextField value={theta.toFixed(2)} label="Theta" disabled />
              <TextField
                value={thetaWheels}
                label="Theta Wheels"
                onChange={(e) => setThetaWheels(parseInt(e.target.value))}
                onKeyDown={(e) => {
                  switch (e.code) {
                    case "ArrowUp":
                      for (let i = 0; i < NB_ITERATIONS; i++) move(false);
                      break;
                    case "ArrowDown":
                      for (let i = 0; i < NB_ITERATIONS; i++) move(true);
                      break;
                    case "ArrowLeft":
                      setThetaWheels((t) => t + DELTA_THETA);
                      break;
                    case "ArrowRight":
                      setThetaWheels((t) => t - DELTA_THETA);
                      break;
                  }
                }}
              />
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
}
