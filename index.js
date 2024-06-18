require("dotenv").config();
const Mustache = require("mustache");
const fetch = require("node-fetch");
const fs = require("fs");
const MUSTACHE_MAIN_DIR = "./main.mustache";
let DATA = {
  name: "CreativeZoller",
  posts: false,
  refresh_date: new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
    timeZone: "Europe/Vienna",
  }),
};

async function setWeatherInformation() {
  await fetch(
    `https://api.openweathermap.org/data/2.5/find?q=Graz&appid=${process.env.OPEN_WEATHER_MAP_KEY}&units=metric`
  )
    .then((r) => r.json())
    .then((r) => {
      DATA.temperature = Math.round(r.list[0].main.temp);
      DATA.weather = r.list[0].weather[0].description;     
      DATA.sunset = new Date(r.list[0].sys.sunset).toLocaleTimeString("en-US");
      DATA.weatherIconUrl = `http://openweathermap.org/img/wn/${r.list[0].weather[0].icon}@2x.png`;
    });
}

async function generateReadMe() {
  await fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync("README.md", output);
  });
}

async function action() {
  await setWeatherInformation();
  await generateReadMe();
}

action();
