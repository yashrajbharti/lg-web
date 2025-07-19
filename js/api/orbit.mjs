const ENDPOINT_BUILD_ORBIT = "/api/lg-connection/build-orbit";
const ENDPOINT_START_ORBIT = "/api/lg-connection/start-orbit";
const ENDPOINT_STOP_ORBIT = "/api/lg-connection/stop-orbit";
const ENDPOINT_CLEAN_ORBIT = "/api/lg-connection/clean-orbit";

export const buildOrbit = async (
  latitude,
  longitude,
  zoom,
  tilt = 0,
  bearing = 0
) => {
  try {
    const configs = JSON.parse(localStorage.getItem("lgconfigs"));
    const { server, username, ip, port, password, screens } = configs;

    const elevation = 591657550.5 / Math.pow(2, zoom) / screens;

    const response = await fetch(server + ENDPOINT_BUILD_ORBIT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        ip,
        port,
        password,
        latitude,
        longitude,
        elevation,
        tilt,
        bearing,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Success:", result.message, result.data);
    } else {
      console.error("Error:", result.message, result.stack);
    }
  } catch (error) {
    console.error("Unexpected Error:", error);
  }
};

export const startOrbit = async () => {
  try {
    const configs = JSON.parse(localStorage.getItem("lgconfigs"));
    const { server, username, ip, port, password } = configs;

    const response = await fetch(server + ENDPOINT_START_ORBIT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, ip, port, password }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Success:", result.message, result.data);
    } else {
      console.error("Error:", result.message, result.stack);
    }
  } catch (error) {
    console.error("Unexpected Error:", error);
  }
};

export const stopOrbit = async () => {
  try {
    const configs = JSON.parse(localStorage.getItem("lgconfigs"));
    const { server, username, ip, port, password } = configs;

    const response = await fetch(server + ENDPOINT_STOP_ORBIT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, ip, port, password }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Success:", result.message, result.data);
    } else {
      console.error("Error:", result.message, result.stack);
    }
  } catch (error) {
    console.error("Unexpected Error:", error);
  }
};

export const cleanOrbit = async () => {
  try {
    const configs = JSON.parse(localStorage.getItem("lgconfigs"));
    const { server, username, ip, port, password } = configs;

    const response = await fetch(server + ENDPOINT_CLEAN_ORBIT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, ip, port, password }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Success:", result.message, result.data);
    } else {
      console.error("Error:", result.message, result.stack);
    }
  } catch (error) {
    console.error("Unexpected Error:", error);
  }
};
