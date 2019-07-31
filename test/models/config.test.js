const utils = require('../utils.js')

describe('Config model test', () => {
  let Page
  let Config
  let User
  let conn

  beforeAll(done => {
    Page = crowi.model('Page')
    Config = crowi.model('Config')
    User = crowi.model('User')
    conn = crowi.getMongo().connection

    const fixture = [
      { ns: 'crowi', key: 'test:test', value: JSON.stringify('crowi test value') },
      { ns: 'crowi', key: 'test:test2', value: JSON.stringify(11111) },
      { ns: 'crowi', key: 'test:test3', value: JSON.stringify([1, 2, 3, 4, 5]) },
      { ns: 'plugin', key: 'other:config', value: JSON.stringify('this is data') },
    ]

    testDBUtil
      .generateFixture(conn, 'Config', fixture)
      .then(function(configs) {
        done()
      })
      .catch(function() {
        done(new Error('Skip this test.'))
      })
  })

  describe('.CONSTANTS', () => {
    test('Config has constants', () => {
      expect(Config.SECURITY_REGISTRATION_MODE_OPEN).toBe('Open')
      expect(Config.SECURITY_REGISTRATION_MODE_RESTRICTED).toBe('Resricted')
      expect(Config.SECURITY_REGISTRATION_MODE_CLOSED).toBe('Closed')
    })
  })

  describe('.loadAllConfig', () => {
    test('Get config array', async function() {
      const config = await Config.loadAllConfig()
      expect(config.crowi).toHaveProperty('test:test', 'crowi test value')
      expect(config.crowi).toHaveProperty('test:test2', 11111)
      expect(config.crowi).toHaveProperty('test:test3', [1, 2, 3, 4, 5])

      expect(config.plugin).toHaveProperty('other:config', 'this is data')
    })
  })
})
