import {test, expect} from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
})

test.describe('Form Layouts page', () => { 

    test.beforeEach( async({page}) => {
        await page.getByText('Forms').click() 
        await page.getByText('Form Layouts').click()
    })

    test('input fields', async({page}) => {
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name:"Email"})
        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.type('test2@test.com', {delay: 500})
        //generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue() 
        expect(inputValue).toEqual('test2@test.com')
        //locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')

    })

    test('radio buttons', async({page}) => {
        //
    })
})


test('checkboxes', async({page}) => {
    await page.getByText( 'Modal & Overlays').click()
    await page.getByText('Toastr').click()

    await page.getByRole('checkbox', {name: "Hide on click"}).uncheck({force: true})
    await page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"}).check({force: true})

    const allBoxes = page.getByRole('checkbox')
    for(const box of await allBoxes.all()){
        await box.uncheck({force: true})
        expect(await box.isChecked()).toBeFalsy()
    }
})

test('lists and dropdowns', async({page}) => {
    const dropDownMenu = page.locator ('ngx-header nb-select')
    page.on
    await dropDownMenu.click()
})

test('datepicker', async({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker') 
    await calendarInputField.click()
    
    let date = new Date()
    date.setDate(date.getDate() + 7)
    const expectedDate = date.getDate().toString()
    const expectedMonthShot = date.toLocaleString('En-US', {month: 'short'}) 
    const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
    const expectedYear = date.getFullYear()
    const dateToAssert = `${expectedMonthShot} ${expectedDate}, ${expectedYear}`
    
    let calendarMonthAndYear = await page.locator ('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`
    while(!calendarMonthAndYear.includes (expectedMonthAndYear)){
        await page. locator ('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await page. locator('nb-calendar-view-mode').textContent()
    }
    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()

    await expect (calendarInputField).toHaveValue(dateToAssert)
})


test('tooltips', async({page}) => {
    await page.getByText ('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    const tooltipCard = page.locator('nb-card', {hasText: "Tooltip Placements"}) 
    await tooltipCard.getByRole('button', {name: "Top"}).hover()

    page.getByRole('tooltip') //if you have a role tooltip created
    const tooltip = await page.locator('nb-tooltip').textContent() 
    expect(tooltip).toEqual('This is a tooltip')
})

test('dialog box', async({page}) => {
    await page.getByText('Tables & Data').click() 
    await page.getByText('Smart Table').click()

    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })

    await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click()
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
})