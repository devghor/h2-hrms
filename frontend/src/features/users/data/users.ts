import { faker } from '@faker-js/faker'

// Set a fixed seed for consistent data generation
faker.seed(67890)

export const users = Array.from({ length: 100 }, (_, index) => {
  const name = faker.person.fullName()
  return {
    id: index + 1,
    name,
    email: faker.internet.email({ firstName: name.split(' ')[0] }).toLowerCase(),
    email_verified_at: faker.helpers.arrayElement([
      null,
      faker.date.past().toISOString(),
    ]),
    tenant_id: faker.helpers.arrayElement([
      '01kdd1pxqjm8qa6trb41a2hkxj',
      '01kdbm9ky9ahe327z4az982hs6',
    ]),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
  }
})
