import {openDB, saveBoatToDB, getBoatsFromDB, getBoatFromDB } from './db.js';
export class Boat {
    static boats = [];
    constructor(name, crew) {
        this.name = name;
        this.crew = crew;
        Boat.boats.push(this);
    }
    static fromJSON(data) {
        let crew = data.crew.map(crewData => Crew.fromJSON(crewData));
        return new Boat(data.name, crew);
    }    
    static findBoatByName(name) {
        return Boat.boats.find(boat => boat.name === name);
    }
    getSpeed(twa, tws) {
        return 0;
    }
}
export class Crew {
    static crews = [];
    constructor(name) {
        this.name = name;
        Crew.crews.push(this);
    }
    static fromJSON(data) {
        return new Crew(data.name);
    }    
    static findCrewByName(name) {
        return Crew.crews.find(crew => crew.name === name);
    }
}
export async function loadBoats() {
    let boatData = await getBoatsFromDB();
    if (!boatData || boatData.length === 0) {
        console.log("No boats found in the database. Creating new boats.");
        boatData = createBoats();
    } else {
        let myBoats = boatData.map(boat => Boat.fromJSON(boat));
        console.table(myBoats);
    }
}
async function createBoats() {
    let crewMember1 = new Crew("John Doe");
    let crewMember2 = new Crew("Jane Smith");
    let crewMember3 = new Crew("Alice Brown");
    let crewMember4 = new Crew("Torsten Borg");
    let crewMember5 = new Crew("Annika Borg");
    let boat1 = new Boat("Sea Explorer", [crewMember1, crewMember2]);
    let boat2 = new Boat("ZZZ", [crewMember3]);
    let boat3 = new Boat("MMM", [crewMember3]);
    let boat4 = new Boat("AAA", [crewMember3]);
    let boat5 = new Boat("Ocean Explorer", [crewMember4, crewMember5]);
    for (const boat of Boat.boats) {
        await saveBoatToDB(boat);
        console.log(`Boat '${boat.name}' saved to database.`);
    }
    let boats = await getBoatsFromDB();
    console.table(boats);
    return Boat.boats;
}


