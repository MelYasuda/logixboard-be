/**
 * shipments service communicates with the shipments and organizations_shipments table in the database
 */
 const dbShipments = require('./db');
 const helper = require('../helper');

 /**
  * @name create
  * @description create a shipment in the database 
  * @param {object} shipment 
  * 
  * @returns {object}  {'type', 'message'}
  */
 const createShipment = async (shipment: any) => {
    try {
      // find a shipment with the same referenceId already exists
      const foundShipment = await findShipmentById(shipment.referenceId)

      if (foundShipment) { // already exists
        return await updateShipment(foundShipment, shipment) // update shipment
      } else {

        const estimatedTimeArrival = helper.eatFormat(shipment) // format eat

        // create shipment
        const createShipment = await dbShipments.query(
          `INSERT INTO shipments VALUES (
              0, '${shipment.referenceId}', ${estimatedTimeArrival});`
        )
        if (createShipment.affectedRows) { // shipment saved
          if (shipment.organizations.length) { // associated organizarions exists
            for(let i=0; i < shipment.organizations.length; i++) {
                try {
                  // save organizations with shipment association
                  await saveAssocOrgsanizations(shipment.organizations[i], createShipment.insertId);
                } catch(err) {
                  throw(err)
                }
              }
            }

            const transportPacksNodes = shipment.transportPacks.nodes; // assign nodes

          if(transportPacksNodes.length) {
            // save transport_packages association
            await saveTransportPacks(transportPacksNodes, createShipment.insertId)
          }

          return  {type: 'shipment', action: 'create', message: `${shipment.referenceId}: created successfully`}
        }
      }

    } catch(err) {
    throw(err)
    }
 };

 /**
 * @name updateShipment
 * @description update shipment by by comparing prev and next input
 * @param {object} prevShipment
 * @param {object} nextShipment
 * 
 * @returns {object} result
 */
 const updateShipment = async (prevShipment: any, nextShipment: any) => {
  try {

    const estimatedTimeArrival = helper.eatFormat(nextShipment) // format eat

    const updateShipment = await dbShipments.query(
      `UPDATE shipments SET estimated_time_arrival = ${estimatedTimeArrival} WHERE id LIKE ${prevShipment.id}`
    )
    if (updateShipment.affectedRows) { // shipment saved
        const organizationUpdateMap = helper.diffData(prevShipment.organizations, nextShipment.organizations) // find deleted/added orgs
        
        if (organizationUpdateMap.added.length){
          for(let i=0; i<organizationUpdateMap.added.length; i++) {
            await saveAssocOrgsanizations(organizationUpdateMap.added[i], prevShipment.id) // save added orgs
          } 
        }
        
        if (organizationUpdateMap.deleted.length){
          for(let i=0; i<organizationUpdateMap.deleted.length; i++) {
            await deleteAssocOrgsanizations(organizationUpdateMap.deleted[i], prevShipment.id) // delete orgs
          }
        }

        // delete transport_packs with shipment associations (do not know which transport packs so delete)
        await dbShipments.query(
          `DELETE FROM transport_packs WHERE shipment_id LIKE ${prevShipment.id};` 
        );

        // save transport_packs with shipment associations
        const transportPacksNodes = nextShipment.transportPacks.nodes; // assign nodes
        if(transportPacksNodes.length) {
          await saveTransportPacks(transportPacksNodes, prevShipment.id)
        }

        return  {type: 'shipment', action: 'update', message: `${nextShipment.referenceId}: updated successfully`}
    }
  } catch(err) {

  }
 }

 /**
 * @name saveTransportPacks
 * @description save transport_packs with shipment associations
 * @param {object} transportPacksNodes
 * @param {string} shipmentId
 * 
 * @returns {object} result
 */
 const saveTransportPacks = async (transportPacksNodes: any, shipmentId: string) => {
  for(let i=0; i < transportPacksNodes.length; i++) {
    try {
      const totalWeight = transportPacksNodes[i].totalWeight

      await dbShipments.query(
        `INSERT INTO transport_packs VALUES (0, ${totalWeight.weight}, '${totalWeight.unit}', ${shipmentId})`
      )
    } catch(err) {
      throw(err)
    }
  }
 }

 /**
 * @name saveAssocOrgsanizations
 * @description save organization associations with shipment
 * @param {string} organizationCode
 * @param {string} insertedId
 * 
 * @returns {object} result
 */
 const saveAssocOrgsanizations = async (organizationCode: string, insertedId: string) => {
    // find associated organization
      const associatedOrganization = await dbShipments.query(
      `SELECT id FROM organizations WHERE code LIKE '${organizationCode}'`
    )

    // I would throw 400 error in real development if associted orgs do not exist

    // save organizations associations
    await dbShipments.query(
      `INSERT INTO shipments_organizations VALUES (
        0, ${insertedId}, ${associatedOrganization[0].id});`
    )
 }

  /**
 * @name deleteAssocOrgsanizations
 * @description delete organization associations with shipment
 * @param {string} organizationCode
 * @param {string} insertedId
 * 
 * @returns {void}
 */
 const deleteAssocOrgsanizations = async (organizationCode: string, insertedId: string) => {
   await dbShipments.query(
     `delete shipments_organizations FROM shipments_organizations INNER JOIN organizations ON organizations.id=shipments_organizations.organization_id INNER JOIN shipments ON shipments.id=shipments_organizations.shipment_id WHERE shipments.id LIKE ${insertedId} and organizations.code LIKE '${organizationCode}';`
   )
 }

   /**
 * @name findShipmentById
 * @description find shipment by reference id
 * @param {string} id
 * 
 * @returns {object} resultShipment
 */
 const findShipmentById = async (id: string) => {
  try {

    // find shipments and associated data
    const shipment = await dbShipments.query(
      `SELECT 
        shipments.id as shipment_id,
        ref_id as shipment_ref_id, 
        estimated_time_arrival,
        shipments.id as shipment_id, 
        code as org_code, 
        weight, 
        unit
      FROM shipments 
      LEFT JOIN shipments_organizations ON shipments.id = shipments_organizations.shipment_id 
      LEFT JOIN organizations ON shipments_organizations.organization_id = organizations.id
      LEFT JOIN transport_packs ON shipments.id = transport_packs.shipment_id
      WHERE shipments.ref_id LIKE '${id}'`
      )

      if (shipment.length) { // shipment exists
        let organizations = new Array<any>();
        if(shipment[0].org_code) {
          for(let i=0; i < shipment.length; i++) {
            organizations.push(shipment[i].org_code) // create org code list
          }
        }

        // create transport pack list
        let nodes = new Array<any>();
        if (shipment[0].weight && shipment[0].unit) {
          const node = {
            totalWeight: {
              weight: shipment[0].weight,
              unit: shipment[0].unit
            }
          }
          nodes.push(node)
        }

        const resultShipment = {
          id: shipment[0].shipment_id,
          referenceId: shipment[0].shipment_ref_id,
          organizations: organizations,
          estimatedTimeArrival: shipment[0].estimated_time_arrival,
          transportPacks: {
            nodes: nodes,
          }
        }
        return resultShipment
      } else {
        return null
      }
  } catch (err) {
    throw(err)
  }
 } 
 
 module.exports = {
  createShipment,
  findShipmentById
 }