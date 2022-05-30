import { messages } from './messages'
import axios from 'axios'

async function main() {
    // I would sort the messages by types in real dev

    for (let i = 0; i < messages.length; i++) {
        const message = messages[i]
        let endpoint = 'shipment'
        if (message.type === 'ORGANIZATION') {
            endpoint = 'organization'
        }

        try {
            const result = await axios.post(`http://localhost:3000/${endpoint}`, message)
            console.log(result.status, result.data)
        } catch (error) {
            console.error(error.message)
        }

    }
}

main()