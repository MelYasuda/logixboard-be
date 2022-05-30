const express = require('express')
const bodyParser = require("body-parser")
const organizations = require("./services/organizations")
const shipments = require("./services/shipments")
const transportPacks = require("./services/transport_packs")

const app = express()
app.use(bodyParser.json());
const port = 3000;

app.post('/shipment', async (req: any, res: any) => {
  try {
    const result = await shipments.createShipment(req.body);
    if(!result) {
      return res.status(400)
    }

    if (result.action === 'create') {
      return res.status(201).json(result); // created
    } else if(result.action === 'update') {
      return res.status(200).json(result);
    }
  } catch(err) {
    // would log the error in real dev

    return res.status(500).json({ message: err })
  }

})

app.post('/organization', async (req: any, res: any) => {
  try {
    const result = await organizations.createOrganization(req.body);

    if(!result) {
      return res.status(400)
    }

    if (result.action === 'create') {
      return res.status(201).json(result) // created
    } else if (result.action === 'update') {
      return res.status(200).json(result) // updated
    }
  } catch(err) {
    // would log the error in real dev
    
    return res.status(500).json({ message: err })
  }
})

app.get('/shipments/:shipmentId', async (req: any, res: any) => {
  try {
    const shipmentId = req.params.shipmentId
    const result = await shipments.findShipmentById(shipmentId);
    if (result) {
      return res.status(200).json(result); // created
    } else {
      return res.status(404).json(result); // not found
    }
  } catch(err) {
    // would log the error in real dev

    return res.status(500).json({ message: err })
  }
})

app.get('/organizations/:organizationId', async (req: any, res: any) => {
  try {
    const organizationId = req.params.organizationId
    const result = await organizations.findOrganizationById(organizationId);
    if (result) {
      return res.status(200).json(result); // found
    } else {
      return res.status(404).json({message: 'Organization dose not exist'}); // not found
    }
  } catch(err) {
    // would log the error in real dev

    return res.status(500).json({ message: err })
  }
})

app.get('/transport-packs/total-weight', async (req:any, res: any) => {
  try {
    const { unit } = req.query
    const result = await transportPacks.getTotalWeightAllShipment(unit);

    if(!result) {
      return res.status(400)
    }

    if (result) {
      return res.status(200).json(result);
    }
  } catch(err) {
    return res.status(500).json({message: err})
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
