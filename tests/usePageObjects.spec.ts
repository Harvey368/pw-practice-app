import {test, expect} from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'
import {faker} from '@faker-js/faker'


test.beforeEach(async({page}) => {
    await page.goto('/')
})

test('navigate to form page @smoke @regression', async({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test('parametrized methods @smoke', async({page}) => {
    const pm = new PageManager(page)
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`

    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGrigdFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, 'Option 2')
    // await page.screenshot({path: 'screenshots/formsLayoutsPage.png'})
    // const buffer = await page.screenshot()
    // console.log(buffer.toString('base64'))
    await pm.onFormLayoutsPage().sumbitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, false)
    // await page.locator('nb-card', {hasText: "Inline form"}).screenshot({path: 'screenshots/inlineForm.png'})
    await pm.navigateTo().datepickerPage()
    await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(10)
    await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(6, 10)
})





/*
import {test, expect} from '@playwright/test'
import {NavigationPage} from '../page-objects/navigationPage'
import { FormLayoutsPage } from '../page-objects/formLayoutsPage'

test.beforeEach(async({page}) => { await page.goto('http://localhost:4200/') })

test ('navigate to form page', async({page}) => { 
    const navigateTo= new NavigationPage(page)
    await navigateTo.formLayoutsPage()
    await page.getByRole('textbox', {name:"Email"}).first().pressSequentially('abc@gmail.com',{delay:500})
        await page.waitForTimeout(3000)
    await navigateTo.datepickerPage()
    //await navigateTo. smartTablePage()
})

test('parametrized methods', async({page}) => {
    const navigateTo= new NavigationPage(page)
    const onFormLayoutsPage = new FormLayoutsPage(page)
    await navigateTo.formLayoutsPage()
    await onFormLayoutsPage.submitUsingTheGrigdFormWithCredentialsAndSelectOption('tesdt@test.com', 'Welcomel', 'Option 1')
    await onFormLayoutsPage.sumbitInlineFormWithNameEmailAndCheckbox('John','John@test.com',false)
    // Also we can see the parameter prompt message from tooltip when hover on the method
})   
*/