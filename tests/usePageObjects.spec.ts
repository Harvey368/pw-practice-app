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