import { BeforeStep, When, Given } from '@cucumber/cucumber'

let _testServerAddress = ''

BeforeStep(function() {
  _testServerAddress = this.testServerAddress
})

When('I create a young user with the following details:', async function (dataTable) {
  console.log(dataTable)
})