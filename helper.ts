import internal from "stream"

const { UNIT_CONVERSIONS } = require('./constants')

// compare previous and next array and return what's been added or deleted
const diffData = (prevArray: any, nextArray: any) => {
  let added = []
  
  for(let i=0; i < nextArray.length; i++) {
    const indexInPrev = prevArray.findIndex((e: any) => e === nextArray[i]) // try to find elements in nextArray in prevArray

    if (indexInPrev == -1) {
      added.push(nextArray[i]) // did not exist before, added element
    } else {
      prevArray.splice(indexInPrev, 1) // remove matched elements
    }
  }
  let deleted = prevArray; // left ones are deleted elements

  return {added: added, deleted: deleted}
}

// convert other units to grams
const convertToGrams = (weight: number, unit: string) => {
  let inGrams: number = 0
  if(unit === 'POUNDS') {
    inGrams = weight * UNIT_CONVERSIONS.poundsToGrams
  } else if(unit === 'OUNCES') {
    inGrams = weight * UNIT_CONVERSIONS.ouncesToGrams
  } else if (unit === 'KILOGRAMS') {
    inGrams = weight * UNIT_CONVERSIONS.kilogramsToGrams
  }

  return Number(inGrams.toFixed(UNIT_CONVERSIONS.roundTo))
}

// convert grams to desired unit
const convertGramsToDesiredUnit = (weightInGrams: number, unit: string) => {
  let inUnit : number = 0
  if(unit === 'pounds') {
    inUnit = weightInGrams / UNIT_CONVERSIONS.poundsToGrams
  } else if(unit === 'ounces') {
    inUnit = weightInGrams / UNIT_CONVERSIONS.ouncesToGrams
  } else if (unit === 'kilograms') {
    inUnit = weightInGrams / UNIT_CONVERSIONS.kilogramsToGrams
  }

  return Number(inUnit.toFixed(UNIT_CONVERSIONS.roundTo))
}

// define EAT for database appropriate format
const eatFormat = (shipment: any) => {
  if(shipment.hasOwnProperty('estimatedTimeArrival') && shipment.estimatedTimeArrival) {
    return `'${shipment.estimatedTimeArrival}'`;
  } else {
    return null;
  } 
}

module.exports = {
  diffData,
  convertToGrams,
  convertGramsToDesiredUnit,
  eatFormat
};