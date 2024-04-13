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

    const tooltipCard = page.locator('nb-card', {hasText: "Tooltip Placements"})   // 方法 1 
    await tooltipCard.getByRole('button', {name: "Top"}).hover()

    page.getByRole('tooltip') //方法2 - if you have a role ‘tooltip’ created in code
    const tooltip = await page.locator('nb-tooltip').textContent() 
    expect(tooltip).toEqual('This is a tooltip')
})


// Tables-> Smart table 菜单
test('dialog box', async({page}) => {
    await page.getByText('Tables & Data').click() 
    await page.getByText('Smart Table').click()

    page.on('dialog', dialog => {  // page.on(event, listener:()=>{}) 加一个 listener（dialog event）
        expect(dialog.message()).toEqual('Are you sure you want to delete?')  //验证是我操作弹出的对话框
        dialog.accept()     
    })  //如果不加这个，在下面步骤中点击删除按钮后会弹出 browser 的对话框，可惜它会自动取消，因为没有人按 确定键

    await page.getByRole('table').locator('tr', {hasText: "mdo@gml.com"}).locator('.nb-trash').click()//点删除按钮
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
        // Modal->Dialog 菜单下包含 第一种 dialog -> Web dialog box -> part of the DOM, 可使用 inspect 来定位  
        // Tables-> Smart table 菜单下包含第二种 -> Browser dialog box -> 无法使用 inspect 来定位，本例是type 2
        // 页面有一个表格，我们需要根据某行中的email来定位该行，并点击delete button，在页面的对话框中选中 确定 来删除该行
})

// Tables-> Smart table 菜单
test('web tables', async({page}) => {
    await page.getByText('Tables & Data').click() 
    await page.getByText('Smart Table').click()

    //1 get the row by any test in this row
    const targetRow = page.getByRole('row', {name: "twitter@outlook.com"}) 
    await targetRow.locator('.nb-edit').click()       //enter edit mode
    await page.locator('input-editor').getByPlaceholder('Age').clear() 
    await page.locator('input-editor').getByPlaceholder('Age').fill('35') 
    await page.locator('.nb-checkmark').click()

    //2 get the row based on the value in the specific column
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    const targetRowById = page.getByRole('row', {name: "11"}).filter({has: page.locator('td').nth(1).getByText('11')}) 
    await targetRowById.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
    await page.locator('.nb-checkmark').click()
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

    //3 test filter of the table   - loop through the table rows
    const ages = ["20", "30", "40", "200"]
    for ( let age of ages){
        await page.locator('input-filter').getByPlaceholder('Age').clear() 
        await page.locator ('input-filter').getByPlaceholder ('Age').fill(age) 
        await page.waitForTimeout(500)

        const ageRows = await page.locator('tbody tr').all()
        for(let row of ageRows ){
            const cellValue = await row.locator('td').last().textContent() //定位最后一列，即“年龄”列
                if (age="200") {
                    expect(await page.getByRole('table').textContent()).toContain ('No data found') 
                } else {
                    expect(cellValue).toEqual(age) 
                }
        }
    }
})

// Forms -> Datepicker  日期选择器
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

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}`
    while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }
    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()
    
    await expect(calendarInputField).toHaveValue(dateToAssert)
})


test('sliders', async({page}) => {
    // Update attribute
    const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    await tempGauge.evaluate( node => {
        node.setAttribute('cx', '232.630')
        node.setAttribute('cy', '232.630')
    })
    await tempGauge.click()

    //Mouse movement
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()

    const box = await tempBox.boundingBox()
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2
    await page.mouse.move(x, y)
    await page.mouse.down()
    await page.mouse.move(x +100, y)
    await page.mouse.move(x+100, y+100)
    await page.mouse.up()
    await expect(tempBox).toContainText('30')
})


