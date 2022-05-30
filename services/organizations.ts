/**
 * organizations service communicates with the organizations_shipments table in the database
 */

const dbOrganizations = require('./db');

/**
 * @name create
 * @description create a organization in the database
 * @param {object} organization 
 * 
 * @returns {object} {type: string, created: bool, messsage: string}}
 */
const createOrganization = async (organization: any) => {

  try {
    // search if the organization id exists
    const findOrganization = await findOrganizationById(organization.id)

    // create new if not found
    if (!findOrganization) {
      const result = await dbOrganizations.query(
        `INSERT INTO organizations VALUES (0, '${organization.code}', '${organization.id}');`
      );
    
      // organization created successfully
      if (result.affectedRows) {
        return  {type: 'organization', action: 'create', message: `${organization.code}: ${organization.id} created successfully`}
      }
    } else {
      // already exists, update with new code
      await updateOrganization(findOrganization, organization)

      let go = {type: 'organization', action: 'update', message: `${organization.code}: ${organization.id} updated successfully`}
      return go
    }

  } catch (err) {
    throw err;
  }
}

/**
 * @name findOrganizationById
 * @description find organization by input organization id
 * @param {string} id 
 * 
 * @returns {object} resultOrganization
 */
const findOrganizationById = async (id:string) => {
  try {
    const organization = await dbOrganizations.query(
      `SELECT * FROM organizations WHERE org_id LIKE '${id}';`
    )
    if(organization.length) { // organization found
      const resultOrganization = {
        id: organization[0].id,
        org_id: organization[0].org_id,
        code: organization[0].code
      }

      return resultOrganization
    } else {
      return null
    }
  } catch(err) {
    throw(err)
  }

}

/**
 * @name updateOrganization
 * @description organization update
 * @param {object} organization 
 * 
 * @returns {boolean}
 */
 const updateOrganization = async (prevOrganization:any, nextOrganization: any) => {
   try {
    await dbOrganizations.query(
      `UPDATE organizations SET code='${nextOrganization.code}' WHERE id LIKE ${prevOrganization.id};`
    )
    
    return true
   } catch(err) {
     console.log(err)
     throw(err)
   }

 }

module.exports = {
  createOrganization,
  findOrganizationById,
}