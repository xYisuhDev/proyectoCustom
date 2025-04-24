const baseurl = `http://localhost:3000/users`;

async function getUsers() {
  try {
    fetch(baseurl);
    const users = res.json;
    if (users) {
      console.log("Fetched");
    }
  } catch (err) {
    console.error("Failed to fetch");
  }
}
