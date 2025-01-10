const ENDPOINT = "/lg-connection/reboot-lg";

export const reboot = async () => {
  try {
    const configs = JSON.parse(localStorage.getItem("lgconfigs"));
    const { server, username, ip, port, password, rigs } = configs;

    const response = await fetch(server + ENDPOINT, {
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
