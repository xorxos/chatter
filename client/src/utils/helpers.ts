import { faker } from '@faker-js/faker'
import { MessageModel } from './models'

export const generateFakeMessage = (): MessageModel => {
    return {
        author: {
            rgbColor: faker.internet.color(250, 250, 250),
            userName: faker.internet.userName(),
        },
        content: faker.lorem.sentence(),
    }
}
