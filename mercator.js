const pi = Math.PI, tan = Math.tan, log = Math.log;
const exp = Math.exp, atan = Math.atan, abs = Math.abs;
const rpd = pi / 180;
export let projectY = lat => log(tan(pi / 4 + (lat * rpd) / 2));
let px0 = projectY(1e-9) / 1e-9; // with equator = 40075 km ~ 40 mm
let latS = -60, latN = 85
let lonW = -180, lonE = 180;
let coordsNW = { x: 0, y: 0 }, coordsSE = { x: 0, y: 0 }
let grid = { w: 0, h: 0 };
let fx = 0, fy = 0;
export function prepareGrid() {
    let w = window.innerWidth, h = window.innerHeight;
    const Δlon = lonE - lonW; //Δlat = latN - latS, 
    fx = 0.95 * w / Δlon; // at least 2.5% margin left and right
    fy = fx / px0; // lets fx define fy with px0
    coordsNW = project(lonW, latN), coordsSE = project(lonE, latS);
    grid = { w: coordsSE.x - coordsNW.x, h: coordsSE.y - coordsNW.y };
    if (grid.h > h) {
        const fitFactor = .95 * h / grid.h;
        fx *= fitFactor, fy = fx / px0;
        coordsNW = project(lonW, latN), coordsSE = project(lonE, latS);
        grid = { w: coordsSE.x - coordsNW.x, h: coordsSE.y - coordsNW.y };
    }
}
export function project(lon, lat) {
    let y = fy * log(tan(pi / 4 + (lat * rpd) / 2));
    y = abs(y) < 1e-10 ? 0 : y;
    return { x: lon * fx, y: -y };
}
export function unproject(x, y) {
    let lat = 2 * (atan(exp(y / fy)) - pi / 4) / rpd;
    return { lon: x / fx, lat: -lat };
}
