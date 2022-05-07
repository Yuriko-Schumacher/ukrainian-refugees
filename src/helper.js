import { timeParse, timeFormat, format, scaleLinear } from "d3";

const pctMargin = 0.01;
// const pctCubeWidth = (1 - pctMargin * 4) / 3;
const pctCubeWidth = 0.2;

export function projectPoint(map, lon, lat) {
  let point = map.getMap().project(new mapboxgl.LngLat(lon, lat));
  return point;
}

export function projectPointNormalized(map, lon, lat, w, h) {
  let point = map.getMap().project(new mapboxgl.LngLat(lon, lat));
  point.x = point.x / w - 0.5;
  point.y = (-(point.y / h - 0.5) * h) / w;
  return point;
}

const countries = [
  { origName: "Ukraine", cleanName: "ukraine", destPos: [0, 0] },
  { origName: "Poland", cleanName: "poland", destPos: [-1, 1] },
  { origName: "Slovakia", cleanName: "slovakia", destPos: [-1, 0] },
  { origName: "Hungary", cleanName: "hungary", destPos: [-1, -1] },
  { origName: "Romania", cleanName: "romania", destPos: [0, -1] },
  { origName: "Moldova", cleanName: "moldova", destPos: [1, -1] },
  { origName: "Russian Federation", cleanName: "russia", destPos: [1, 0] },
  { origName: "Belarus", cleanName: "belarus", destPos: [1, 1] },
];

export function parseCountryName(origCountry) {
  let country = origCountry.trim();
  let index = countries.findIndex((el) => el.origName == country);
  return countries[index].cleanName;
}

export function getCountryIndex(country) {
  let index =
    country == "ukraine"
      ? 0
      : countries.findIndex((el) => el.cleanName == country);
  return index;
}

export function getCountryDestPos(countryIndex) {
  let destPos = {
    x: countries[countryIndex].destPos[0],
    y: countries[countryIndex].destPos[1],
  };
  return destPos;
}

export function getFinalPos(countryIndex) {
  let finalPos = {};
  if (countryIndex == 0) {
    finalPos = { x: 0.5, y: 0 };
  } else {
    finalPos = { x: -0.5, y: 0 };
  }
  return finalPos;
}

export function getCubeWidth(width, height) {
  let shorterSide = width > height ? height : width;
  let cubeWidth = shorterSide * pctCubeWidth;
  return cubeWidth;
}

export function getCubePosition(width, height, country) {
  let countryName = country.toLowerCase();
  let countryIndex = countries.findIndex((el) => el.cleanName == countryName);
  let position;
  let shorterSide = width > height ? height : width;
  if (countryIndex == 0) {
    position = {
      x: width / 2,
      y: height / 2,
    };
  } else {
    position = {
      x: width / 2 + getCountryDestPos(countryIndex).x * shorterSide * 0.3,
      y: height / 2 + -getCountryDestPos(countryIndex).y * shorterSide * 0.3,
    };
  }
  return position;
}

export function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function formatCountry(index) {
  let countryName = toTitleCase(countries[index].cleanName);
  return countryName;
}

export const parseTime = timeParse("%Y-%m-%d");
export const formatTime = timeFormat("%b %d");
export const formatDate = timeFormat("%Y-%m-%d");
export const formatNumber = format(",");

export function random(min, max) {
  return Math.random() * (max - min) + min;
}

export function getDateFromDay(day) {
  let date = new Date("2022-02-25");
  date.setDate(date.getDate() + day);
  return formatTime(date);
}
