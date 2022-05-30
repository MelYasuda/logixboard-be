const tp_db = require('./db');
const { convertToGrams, convertGramsToDesiredUnit } = require('../helper');
const { UNIT_CONVERSIONS } = require('../constants')

   /**
 * @name getTotalWeightAllShipment
 * @description calculate total weight of all shipments on database
 * @param {string} unit
 * 
 * @returns {object} result
 */
const getTotalWeightAllShipment = async (unit: string) => {
  try {
    const getShipmentWeight = await tp_db.query(
      `SELECT weight, unit FROM transport_packs;`
    )
    let totalWeightInGrams = 0;

    for (let i=0; i<getShipmentWeight.length; i++) {
    totalWeightInGrams =  totalWeightInGrams + convertToGrams(getShipmentWeight[i].weight, getShipmentWeight[i].unit) // convert to grams and add all
    }

    const weight = convertGramsToDesiredUnit(totalWeightInGrams, unit) // convert grams to the unit specified in req query

    const result = {
      weight: weight,
      unit: unit
    }

    return result
  } catch(err) {
    console.log(err)
    throw(err)
  }

}

module.exports = {
  getTotalWeightAllShipment,
}