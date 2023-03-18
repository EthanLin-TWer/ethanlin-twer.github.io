const fs = require('fs')

const { Builder, By, until: Until } = require('selenium-webdriver')

// This won't work for now for ES6 imports
const { parse } = require('../src/util/jekyll-parser')

const { config } = require('./config')
;(async function() {
  const driver = await new Builder().forBrowser('chrome').build()
  const {
    juejin: {
      url,
      username,
      password,
      selectors: {
        loginText,
        loginForm,
        usernameInputField,
        passwordInputField,
        loginButton,
      },
    },
  } = config

  try {
    await driver.get(url)

    await driver.wait(Until.elementLocated(By.css(loginText)))
    await driver.findElement(By.css(loginText)).click()

    await driver.wait(Until.elementLocated(By.css(loginForm)))
    await driver.findElement(By.css(usernameInputField)).sendKeys(username)
    await driver.findElement(By.css(passwordInputField)).sendKeys(password)
    await driver.findElement(By.css(loginButton)).click()

    // this will only appear when successfully logged in
    await driver.wait(Until.elementLocated(By.css('li.nav-item.menu')))

    const post = fs.readFileSync(
      './_posts/2018-10-25-readings-understand-ecmascript-6.md',
      'utf-8'
    )
    const {
      frontMatters: { juejinId },
      // content,
    } = parse(post)

    // article hasn't been published
    if (!juejinId) {
      await driver.findElement(By.css('li.nav-item.menu')).click()
      await driver.findElement(By.css('.fw-write')).click()
    }

    await driver.wait(Until.elementLocated(By.css('sdfasdfasdfs')))
  } finally {
    await driver.quit()
  }
})()
