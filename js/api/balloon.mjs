const ENDPOINT_CLEAN_BALLOON = "/lg-connection/clean-balloon";
const ENDPOINT_SHOW_BALLOON = "/lg-connection/show-balloon";
let kml = "";

const getBalloonKML = async () => {
  const res = await fetch("../../assets/Balloon.kml");
  return await res.text();
};

export const cleanballoon = async () => {
  try {
    const configs = JSON.parse(localStorage.getItem("lgconfigs"));
    const { server, username, ip, port, password, rigs } = configs;

    const response = await fetch(server + ENDPOINT_CLEAN_BALLOON, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, ip, port, password, rigs }),
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

export const showballoon = async () => {
  try {
    const configs = JSON.parse(localStorage.getItem("lgconfigs"));
    const { server, username, ip, port, password, rigs } = configs;
    kml = await getBalloonKML();
    const response = await fetch(server + ENDPOINT_SHOW_BALLOON, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, ip, port, password, rigs, kml }),
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
