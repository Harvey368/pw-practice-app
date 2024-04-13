import {test, expect} from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
})

test.describe('Form Layouts page', () => { 
    // Forms 菜单下包含 input field 和 radio button 

    test.beforeEach( async({page}) => {
        await page.getByText('Forms').click() 
        await page.getByText('Form Layouts').click()
    })

    // Section 5 - 33. input fields.
    test('input fields', async({page}) => {
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name:"Email"});
        await usingTheGridEmailInput.fill('test@test.com');
        await usingTheGridEmailInput.clear();
        await usingTheGridEmailInput.pressSequentially('nwqa@adesa.com')             //模拟自然键盘输入
        await usingTheGridEmailInput.pressSequentially('nwqa@adesa.com',{delay:1000}) //并可设置延迟每1秒输入一个字符
        await usingTheGridEmailInput.type('test2@test.com', {delay: 1000});

        //generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue() ;
        expect(inputValue).toEqual('test2@test.com');
        //locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com');
    })

    // Section 5 - 34. Radio buttons
    test('radio buttons', async({page}) => {
        const usingTheGridForm = page. locator('nb-card', {hasText: "Using the Grid"})  // 先找到整个大模块

        await usingTheGridForm.getByRole('radio', {name: "Option 1"}).check({force: true})   // 操作

        const radioStatus = await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked() //返回 true/false
        expect(radioStatus).toBeTruthy()                                                    //检查方法 1 - Generic assertion 

        await expect(usingTheGridForm.getByRole('radio', {name: "Option 1"})).toBeChecked() //检查方法 2 - locator assertion 

        // 下面这个例子是检查 当用户再点击选择 “option 2”时，option_1应该自动 unchecked，而option_2 为 checked状态
        await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true}) 
        expect (await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()).toBeFalsy() 
        expect (await usingTheGridForm.getByRole('radio', {name: "Option 2"}).isChecked()).toBeTruthy()
    })
})



// Modal->Toastr 菜单下包含 checkbox 
test('checkboxes', async({page}) => {
    await page.getByText( 'Modal & Overlays').click()    // 像这种菜单项的定位使用 getByText()非常方便
    await page.getByText('Toastr').click()

    await page.getByRole('checkbox', {name: "Hide on click"}).uncheck({force: true})
    await page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"}).check({force: true})

    const allBoxes = page.getByRole('checkbox')   // 遍历所有checkbox子选项
    for(const box of await allBoxes.all()){
        await box.uncheck({force: true})
        expect(await box.isChecked()).toBeFalsy()
    }
})

// Dropdown list 在 页面header里面
test('lists and dropdowns', async({page}) => {
    const dropDownMenu = page. locator ('ngx-header nb-select') 
    await dropDownMenu.click()

    page.getByRole('list') //when the list has a UL tag -> UL and LI 是标准的HTML list的item 
    page.getByRole('listitem') //when the list has LI tag

    //const optionList = page.getByRole('list').locator('nb-option')
    const optionList = page. locator ('nb-option-list nb-option')
    await expect (optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]) 
    await optionList.filter({hasText: "Cosmic"}).click()
    const header = page. locator('nb-layout-header')
    await expect (header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    const colors = {     // 定义一个 color 的 object 来存储 ， 格式：“键名：键值”
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)", 
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }

    await dropDownMenu.click()
    for(const color in colors) {
        await optionList.filter({hasText: color}).click()
        await expect (header).toHaveCSS('background-color', colors [color]) 
        if (color !="Corporate"){            // 如果不是list 的最后一个，则继续点击展开下拉菜单
            await dropDownMenu.click()
        }
    }
})

//  Modal->Tooltip 菜单下包含 tooltip 
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
