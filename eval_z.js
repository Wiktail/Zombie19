class Life {

  constructor(peopleData) {
    this.peopleData = peopleData;
  }

  static people(people) {
    return new Life(people);
  }

  startInfection(infectionType) {
    const randomIndex = Math.floor(Math.random() * this.peopleData.length);
    const patientZero = this.peopleData[randomIndex];
    console.log(patientZero);

    return this.peopleData !== null && this.peopleData !== undefined 
        ? infectionType(this.peopleData, [patientZero])
        : Life.people(null);

  }

  startVaccination(vaccinationType){
    
    return this.peopleData !== null && this.peopleData !== undefined 
        ? vaccinationType(this.peopleData)
        : Life.people(null);
  }
}

const findPersonByID = (peopleData,id) => peopleData.find((p) => p.id === id);

const doHaveParent = (id) => id !== null;

const isHealthy = (person) => person.statusInfected === "sain";

const isNotA1Immune = (person) => person.immune !== "A1";

const isNotUltimeImmune = (person) => person.immune !== "Ultime";

const isUltimeImmune = (person) => person.imunne === "Ultime";

const isNotDead = (person) => person.died === false;

const isBetweenZeroAndThirty = (person) => person.age >=0 && person.age<=30;

const threat = (person) => person.statusInfected = "sain";

const kill = (person) => person.died = true;

const immune = (person, vaccin) => person.immune = vaccin;

function infect(person, variant){
  if(isNotA1Immune(person)){
    person.statusInfected = variant;
  }
}

function logInfectionOrVaccinType(infectionOrVaccination){
  console.log(`========== ${infectionOrVaccination} ==========`);
}

function friendsToInfect(people, person){

}

function printTree(people,person, depth = 0){
  const indent = "   ".repeat(depth);

  const status = person.died === false ? "Alive" : "Dead";

  console.log(`${indent}\\${person.name} (${person.age} years old, ${person.statusInfected}) : ${status}, immune : ${person.immune}`);

  person.social.forEach((socialId) => {
    const socialPerson = people.find((p) => p.id === socialId);
    printTree(people,socialPerson, depth + 1);
  });

}

function spreadInfection19(people, personToInfect, infected =[]){

  const toInfect = [];

  if(personToInfect.length === 0 || isUltimeImmune(personToInfect[0])){
    logInfectionOrVaccinType("Zombie-19");
    printTree(people, people[0]);
    return Life.people([...people]);
  }

  personToInfect.forEach(person => {
    if(isNotUltimeImmune(person) && isNotDead(person)){
      infect(person, "Zombie-19");
      infected.push(person.id);
  
      person.social.forEach(friend => {
        if(!infected.includes(friend)){
          const socialPerson = findPersonByID(people,friend);
          toInfect.push(socialPerson);
        }
      });
  
      if(person.parent !== null && !infected.includes(person.parent)){
        const parent = findPersonByID(people,person.parent);
        toInfect.push(parent);
      }
    }
  });

  return spreadInfection19(people, toInfect, infected);
}

function spreadInfectionA(people, personToInfect, infected=[]){
  
  const toInfect = [];
  
  if(personToInfect.length === 0 || isUltimeImmune(personToInfect[0])){
    logInfectionOrVaccinType("Zombie-A");
    printTree(people, people[0]);
    return Life.people([...people]);
  }
  
  personToInfect.forEach( person => {
    if(isNotUltimeImmune(person) && isNotDead(person)){

      infect(person, 'Zombie-A');
      infected.push(person.id);

      person.social.forEach(friend => {
        if(!infected.includes(friend)){
          const socialPerson = findPersonByID(people, friend);
          toInfect.push(socialPerson);
        }
      });

    }

  });

  return spreadInfectionA(people, toInfect, infected);
}


function spreadInfectionB(people, personToInfect){

    const toInfect = [];

    if(personToInfect.length === 0 || isUltimeImmune(personToInfect[0])){
      logInfectionOrVaccinType("Zombie-B");
      printTree(people, people[0]);
      return Life.people([...people]);
    }
    
    personToInfect.forEach(person => {
      if(isNotUltimeImmune(person) && isNotDead(person)){
        infect(person, 'Zombie-B');
        if(person.parent !== null){
          const parent = findPersonByID(people, person.parent);
          toInfect.push(parent);
        }
      }
  });

  return spreadInfectionB(people, toInfect)
}

function spreadInfection32(people, personToInfect, infected = []){
  const toInfect = [];

  if(personToInfect.length === 0 || isUltimeImmune(personToInfect[0])){
    logInfectionOrVaccinType("Zombie-32");
    printTree(people, people[0]);
    return Life.people([...people]);
  }

  personToInfect.forEach(person => {
    if(isNotUltimeImmune(person) && isNotDead(person)){
      if(person.age >= 32){
        infect(person, "Zombie-32");
      }
      infected.push(person.id);
  
      person.social.forEach(friend => {
        if(!infected.includes(friend)){
          const socialPerson = findPersonByID(people,friend);
          toInfect.push(socialPerson);
        }
      });
  
      if(person.parent !== null && !infected.includes(person.parent)){
        const parent = findPersonByID(people,person.parent);
        toInfect.push(parent);
      }
    }
  });

  return spreadInfection32(people, toInfect, infected);
}

function spreadInfectionC(people, personToInfect){
  if(isNotUltimeImmune(personToInfect[0]) && isNotDead(personToInfect[0])){
    let i = 1;
    infect(personToInfect[0], 'Zombie-C');
    personToInfect[0].social.forEach(friend => {
      if(i%2 === 0 && isNotUltimeImmune(friend) && isNotDead(friend)){
        const socialPerson = findPersonByID(people,friend);
        infect(socialPerson,'Zombie-C');
      }
      i++;
    });
  }
  
  logInfectionOrVaccinType("Zombie-C");
  printTree(people, people[0]);
  return Life.people([...people]);
} 

function spreadInfectionUltime(people, personToInfect){
  const toInfect = [];

  if(personToInfect[0].parent===null){
    if(isNotUltimeImmune(personToInfect[0]) && isNotDead(personToInfect[0])){
      infect(personToInfect[0], 'Zombie-Ultime');
    }
    
    logInfectionOrVaccinType("Zombie-Ultime");
    printTree(people, people[0]);
    return Life.people([...people]);
  }
  
  personToInfect.forEach(person => {
    if(person.parent !== null){
      const parent = findPersonByID(people, person.parent);
      toInfect.push(parent);
    }
  });

  return spreadInfectionUltime(people, toInfect);
}

function vaccinA1(people){
  people.forEach(person => {
    if(isBetweenZeroAndThirty(person) && isNotDead(person)){
      threat(person);
      immune(person, "A1");
    }
  });

  logInfectionOrVaccinType("Vaccin-A1");
  printTree(people, people[0]);
  return Life.people([...people]);
}

function vaccinB1(people){
  let i = 0;
  people.forEach(person => {
    if(i%2 === 0  && isNotDead(person)){
      threat(person);
    }else if(person.statusInfected !== "sain" && isNotDead(person)){
      kill(person);
    }
    i++;
  });

  logInfectionOrVaccinType("Vaccin-B1");
  printTree(people, people[0]);
  return Life.people([...people]);
}

function vaccinUltime(people){
  let isDead = true;

  while(isDead === true) {
    const randomIndex = Math.floor(Math.random() * people.length);
    const patientUltime = people[randomIndex];

    if(patientUltime.died === false){
      immune(patientUltime, "Ultime");
      isDead = false;
    }
  }

  logInfectionOrVaccinType("Vaccin-Ultime");
  printTree(people, people[0]);
  return Life.people([...people]);
}


const peoples = [
  { id: 1, name: 'Lea', age: 32, statusInfected: 'sain', immune: null, died: false, parent: null, social: [2, 3] },
  { id: 2, name: 'Chloe', age: 25, statusInfected: 'sain', immune:null, died: false, parent: 1, social: [10,11] },
  { id: 3, name: 'Theo', age: 40, statusInfected: 'sain', immune:null, died: false, parent: 1, social: [4, 8] },
  { id: 4, name: 'Alexandra', age: 28, statusInfected: 'sain', immune:null, died: false, parent: 3, social: [5] },
  { id: 5, name: 'Hugo', age: 22, statusInfected: 'sain', immune:null, died: false, parent: 4, social: [6, 7] },
  { id: 6, name: 'Clara', age: 35, statusInfected: 'sain', immune:null, died: false, parent: 5, social: [] },
  { id: 7, name: 'Lucas', age: 27, statusInfected: 'sain', immune:null, died: false, parent: 5, social: [] },
  { id: 8, name: 'Emma', age: 30, statusInfected: 'sain', immune:null, died: false, parent: 3, social: [9] },
  { id: 9, name: 'Camille', age: 33, statusInfected: 'sain', immune:null, died: false, parent: 8, social: [] },
  { id: 10, name: 'Antoine', age: 56, statusInfected: 'sain', immune:null, died: false, parent: 2, social: [] },
  { id: 11, name: 'Manon', age: 27, statusInfected: 'sain', immune:null, died: false, parent: 2, social: [12,13] },
  { id: 12, name: 'Pierre', age: 48, statusInfected: 'sain', immune:null, died: false, parent: 11, social: [] },
  { id: 13, name: 'Elise', age: 22, statusInfected: 'sain', immune:null, died: false, parent: 11, social: [] },
];


Life.people(peoples)
  .startInfection(spreadInfectionA)
  .startInfection(spreadInfection32)
  .startVaccination(vaccinA1)
  .startInfection(spreadInfectionB)
  .startInfection(spreadInfectionC)
  .startVaccination(vaccinB1)
  .startInfection(spreadInfectionUltime)
  .startVaccination(vaccinUltime)
  .startInfection(spreadInfection19)


