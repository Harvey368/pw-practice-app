import { test, expect } from '@playwright/test';
import { SSL_OP_NO_TLSv1_1 } from 'constants';

test.beforeEach( async ({ page }) => {
  await page.goto('http://localhost:4200/')
  await page.getByText('Forms').click()
  await page.getByText('Form Layouts').click()
});

test('Locator syntax rules', async ({ page }) => {
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

/* ************** Table of Content **************

Section 1: Preparation

Section 2: JavaScript fundamentals

Section 3: Playwright Hands-On Overview
    17. Playwright Installation        (6min)
    18. Test Execution with CLI        (7min)
    19. Test Execution with UI         (7min)
    20. Trace View and Debug           (7min)
    21. Tests Structure                (10min)
    22. Hooks and Flow Control         (7min)

Section 4: Interaction with Web Elements 
    23. DOM Terminology                (6min)
    24. Locator Syntax Rules           (14min)
    25. User-Facing Locators           (12min)
    26. Child Elements                 (9min)
    27. Parent Elements                (13min)
    28. Reusing Locators               (6min)
    29. Extracting Values              (10min)
    30. Assertions                     (10min)
    31. Auto-Waiting                   (18min)
    32. Timeouts                       (12min)

Section 5: UI Components
    33. Input Fields                   (9min)
    34. Radio Buttons                  (8min)
    35. Checkboxes                     (9min)
    36. Lists and Dropdowns            (16min)
    37. Tooltips                       (7min)
    38. Dialog Boxes                   (7min)
    39. Web Tables (Part 1)            (17min)
    40. Web Tables (Part 2)            (11min)
    41. Date Picker (Part 1)           (8min)
    42. Date Picker (Part 2)           (18min)
    43. Sliders                        (16min)
    44. Drag & Drop with iFrames       (10min)

Section 6: Page Object Model
    45. What Is Page Objects           (7min)
    46. First Page Object              (9min)
    47. Navigation Page Object         (11min)
    48. Locators in Page Objects       (8min)
    49. Parametrized Methods           (14min)
    50. Date Picker Page Object        (13min)
    51. Page Objects Manager           (10min)
    52. Page Objects Helper Base       (7min)

Section 7: Working with APIs
    53. What is API                    (10min)
    54. Setup New Project              (9min)
    55. Mocking API                    (8min)
    56. Modify API Response            (9min)
    57. Perform API Request            (23min)
    58. Intercept Browser API Response (16min)
    59. Sharing Authentication State   (9min)
    60. API Authentication             (9min)

Section 8: Advanced
    61. NPM Scripts and CLI Commands   (6min)
    62. Test Data Generator            (9min)
    63. Test Retries                   (9min)
    64. Parallel Execution             (10min)
    65. Screenshots and Videos         (9min)
    66. Environment Variables          (19min)
    67. Configuration File             (12min)
    68. Fixtures                       (13min)
    69. Project Setup and Teardown     (14min)
    70. Global Setup and Teardown      (13min)
    71. Test Tags                      (4min)
    72. Mobile Device Emulator         (8min)
    73. Reporting                      (7min)
    74. Visual Testing                 (10min)
    75. Playwright with Docker Container (20min)

Section 9: Final Words

*/


//================================= < Section 3  > ===================================//
  
// *** 21. Tests Structure
// page.goto + waitUntil
test('test 01', async ({ page }) => {
    await page.goto('https://example.com', { waitUntil: 'domcontentloaded' });  
    // 在调用 page.goto() 后，页面会导航到指定的 URL，然后脚本会等待直到 'DOMContentLoaded' 事件被触发，然后再继续执行后续的代码。=> 
    //   waitUntil?: "load"|"domcontentloaded"|"networkidle"|"commit"
    // load 事件在整个页面和所有其资源（例如图片、样式表、脚本等）都加载完成后触发。
    // DOMContentLoaded 事件在 HTML 文档加载完成并且解析完成后触发，而不必等待样式表、图像和子框架的加载完成。
    // ** playwright 的function 有些return 的是Promise， 那么前面就必须加 Await。 例如这个page.goto() 

    await page.waitForURL('https://app.stg.openlane.ca/')
    await page.waitForLoadState('load'); 
    //await page.waitForTimeout(10000)
    //await page.reload()
  })

// *** 22. Hooks and Flow Control
//=============================== structure example ==============================================

test.beforeAll( async ({ page }) => {   //在所有test前先运行一次
  await page.goto('https://playwright.dev/');
});

test.beforeEach( async ({ page }) => {    //在所有的test前每次都运行一次
  await page.goto('https://playwright.dev/')
});

test.describe('suite1',()=> {
    test('test 01', async ({ page }) => {
      await page.goto('https://playwright.dev/');
    
      // Expect a title "to contain" a substring.
      await expect(page).toHaveTitle(/Playwright/);
    });
    
    test('test 02', async ({ page }) => {
      await page.goto('https://playwright.dev/');
    
      // Click the get started link.
      await page.getByRole('link', { name: 'Get started' }).click();
    
      // Expects page to have a heading with the name of Installation.
      await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
    });
})       // 注意：在suite里面也可以嵌套 beforeEach

// test.afterAll()
// test.afterEach()
// test.fail()      
// test.skip()
// test.only()
//========================

//============================ < Section 3 - End > ============================// 


//============================ < Section 4 - Interaction with Web elements > ============================// 

/* ***   23. DOM Terminology ***
1. HTML dom consists of HTML tags, HTML attributes and attribute values.
2. Class and ID are also HTML attribute names.
  Class attribute can have a several values and each value is separated by space.
3. HTML tags usually come in pairs of opening and closing tag. Closing tag has the same name and the forward slash.<></>
4. Value in between the angle braces is a plain text or HTML text.
复习随附 DOM 结构说明
Tag -> Attribute -> Value      一个Attribute 可能没有value，也可以有多个value， 例如 class
Class 与 ID 也是attribute的一种，
*/

//*** 24. Locator Syntax Rules ***
test('test 01', async ({ page }) => {
  await page.goto('http://localhost:4200/');

  //by Tag name           Tag 是较为高层的元素
  page.locator('input')
  page.locator('nb-card nb-radio')   //parent_tag + child_tag

  //by ID                   ID 是特殊attribute  
  page.locator('#inputEmail1')

  //by Class Value           Class 是特殊attribute  
  page.locator('.shape-rectangle')

  //by attribute（+value）      通用的 attribute 定位  
  page.locator('[placeholder="Email"]')

  //by Class Value (full)     其实就是attribute 定位
  page.locator('[class="input-full-width size-medium status-basic shape-rectangle"]')

  //combine different selectors    有 并联 与 级联 两种
  page.locator('input[placeholder="email"]')              // TagName + attribute  //PS. No space between them
  page.locator('[placeholder="email"].shape-rectangle')   // Attribute + class   并联模式
  page.locator('input[placeholder="email"][nbinput]')     // TagName + attribute01 + attribute02
  page.locator('nb-card nb-radio :text-is("Option 1")')   // Parent_tag + child_tag + Text exact match
  page.locator('nb-card').locator('nb-radio').locator(':text-is("Using the Grid")')   // locator级联模式 更易读

  //by text match (partial match)
  page.locator(':text("Using")')    //“Using” 就是UI所显示的Text，:text()是语法
  //by text match (exact match)
  page.locator(':text-is("Using the Grid")')

  //by CSS or XPath   (NO recommended)
  page.locator('//input[@id="exampleInputEmail1"]')    //PW会自动判断 XPath: Tag='input' + id="exampleInputEmail1"
  page.locator('xpath=//input[@id="exampleInputEmail1"]')   //normal by_xpath syntax
  page.locator('css=button')                                //normal by_css syntax

  //== PS. it will return all matched results ==
    page.locator('input').first()

  //====================================================

  // *** 25. user facing locator  ===== 最主要目的是从用户角度来测试 ====== 
  // 例如，UI button 上的text消失，对于用户就是无法操作，可是如果使用ID等，测试仍然可以通过，所以需要从用户角度来测试

    page.getByRole('textbox', {name:"Email"}).first().click()
    page.getByRole('button', {name:"Sign in"}).first().click()

    page.getByLabel('Email').first().click()      // 元素有一个 tag 叫 <label>, label里有一个Text 为"Email"

    page.getByPlaceholder('Email').first().click()    //元素有一个 attribute placeholder=“Email”

    await page.getByText('Using').click()                    // contain 
    await page.getByText('Using the Grid', { exact: true })  // exact match
    await page.getByText(/welcome, [A-Za-z]+$/i)             // Regex match

    await page.getByAltText('playwright logo').click();    // locate by alt text

    await page.getByTitle('Email').click()                //元素有一个 attribute title="Dashboard"

    await page.getByTestId('SignIn').click()              // testid must embeded 

    //getByRole 是从 ARIA role 发展而来，共 67 roles. some popular example of getByRole(): 
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('checkbox', { name: 'Remember me' }).check();
    await page.getByRole('link', { name: 'Home' }).click();
    await page.getByRole('textbox', { name: 'Search' }).fill('Playwright');
    await page.getByRole('combobox', { name: 'Country' }).selectOption('USA');
    await page.getByRole('radio', { name: 'Gender', value: 'Male' }).check();
    await page.getByRole('heading', { name: 'Welcome' });
    await page.getByRole('slider', { name: 'Volume' }).click();
    await page.getByRole('menu', { name: 'Options' }).click();
    await page.getByRole('menuitem', { name: 'Settings' }).click();
    await page.getByRole('tab', { name: 'Reviews' }).click();
    await page.getByRole('list', { name: 'To-Do' });
    await page.getByRole('listitem', { name: 'Task 1' }).click();
    await page.getByRole('grid', { name: 'Data Grid' });
    await page.getByRole('row', { name: 'Row 1' });
    await page.getByRole('cell', { name: 'A1' }).click();
    await page.getByRole('banner');
    await page.getByRole('contentinfo');
  // ===========================================

  // *** 26. locate child elements   //  ==== combined locator ===  
  page.locator('nb-card').getByRole('button',{name:"Sign in"}).first()
  page.locator('nb-card').nth(2).getByTestId('SignIn')  //nth是 第n个元素,其返回值仍是一个DOM块,可以继续往下定位
  page.locator('nb-card nb-radio :text-is("Option 2")')  //级联定位 有空格/ 父tag + 子tag + 精确文字匹配 / 等同下一条
  page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")') //更易读，父tag ->子tag ->精确文字匹配
  page.locator('nb-card').getByRole('button',{name:"Sign in"}).first()  //也可以组合user facing locator
  page.locator('nb-card').nth(3).getByRole('button')   //注意，第一个是 0


  // *** 27. locate parent elements == 通过（子元素）辅助定位来找（父元素）+  或者可通过它找到 sibling 的元素
  page.locator('nb-card',{hasText:"Using"})  //locator函数可以传入object参数 + hasTaxt模糊匹配 + 子元素中有 text “Using”
  page.locator('nb-card',{hasText:"Using"}).getByRole('textbox',{name:"Email"})  //继续组合其他定位方式 找sibling 
      //下面展示用 has: 传入一个用匹配的块，即可以用一块的DOM 来辅助定位
  page.locator('nb-card',{has: page.locator('#inputEmail1')}). getByRole('textbox',{name:"Email"}) 
      // 下面进阶用 filter 更易读, 更易理解 其通过（子元素）辅助定位来找（父元素）
  page.locator('nb-card').filter({hasText:"Using"}). getByRole('textbox',{name:"Email"})  // 以上2句的变形，更易读
  page.locator('nb-card').filter({has: page.locator('#inputEmail1')}). getByRole('textbox',{name:"Email"}) 
      // Filter 可以帮助用户在页面有多个相似元素时定位到正确的元素
  page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText:"Sign"})
       //Filter可以并联使用，第一个filter运行后是返回一个‘nb-card’的列表，可以继续filter
  page.locator(':text-is("Using the Grid")').locator('..')  // locator('..') 代表找当前元素的上一级元素

  /* In order to find a web element using a locator method, you can use a text filter or a locator filter, and then chain 
    from this parent element all the child elements that you want to select. 
    Also, you can alternatively use a filter method that will do exactly the same thing, what is the benefit of using a 
    filter method that you can chain multiple filters one by one, narrowing down your output to the unique element until 
    you get the desired result.
  */

  // *** 28. Reusing Locators
    const basicForm= page.locator('nb-card').filter({hasText:"Basic form"});
    await basicForm.fill('test@gmail.com');
    await basicForm.getByRole('button').click();


  // *** 29. Extract value  ***     从 DOM 里面提取所需的值
  // == Extract Single value 
  const buttonText= await page.locator('button').textContent()  //注意它们返回都是promise，都要加 await
  expect (buttonText).toEqual('Sign in')

  // == Extract all values 
  const allRadioButtons = await page.locator('nb-radio').allTextContents()  // 存入一个 Array
  expect(allRadioButtons).toContain("Option 2")

  // == get input value ：
  // 例如在email栏输入emai后tab跳到下一个，这时检查页面代码会发现找不到输入的text，因为它这时被存为一个value，而非页面的一个text
  await basicForm.getByRole('textbox',{name:"Email"}).fill('test@test.com')
  const emailValue = page.getByRole('textbox',{name:"Email"}).inputValue()   //取input里面的value
  
  // .innerText(): Obtains the innerText of an element, which represents the rendered text content.
  // .innerHtml(): Returns the innerHTML of an element, which is the HTML content inside the element.

  // == get element attributes 
  const placeholderValue = await page.getByRole('textbox',{name:"Email"}).getAttribute('placeholder')//获得被定位元素的p属性
  expect(placeholderValue).toEqual('Email')
  // 注意它的返回有可能有多个，变成一个list


  // *** 30. Assertions ***
  // == General assertions  ( 用鼠标hover 就会看到 “GenericAssertions”， 它执行快，无需 await
  const value = page.locator('inputbox').inputValue() //这时value的值不是locator()返回的DOM,而是后面的inputValue()返回的“值”
  expect(value).toEqual(5)
  expect(value).toContain('Email')    

  //= Locator assertions -> 用鼠标hover 会看到 “LocatorAssertions”，是直接对 Locator()返回的 DOM 对象的操作，需加 await
  await expect(page.getByPlaceholder('Click to add notes')).toHaveValue('Add Note'); // 可以用value定位
  await expect(page.locator('inputbox')).toHaveText('Submit')  //更智能，会retry，多了一些对元素的操作
  await expect(page.locator('nb-layout-header')).toHaveCSS('background-color','rgb(50,50,90)') //验证背景颜色是否是指定值
  await expect(page.locator('inputbox')).toBeChecked()  
  await expect(page.locator('inputbox')).toBeVisible() 
  await expect(page.locator('inputbox')).toBeHidden() 
  await expect(page.locator('inputbox')).toBeEmpty() 

    // 其他常用 generic assertion 
    expect(value).toHaveProperty('xxx')
    expect(value).toBe(Object)             // compare to an object.
    expect(value).toBeTruthy()        // - Ensures that a value is true in a boolean context.
    expect(value).toBeFalsy()        // Checks if a value is false in a boolean context.
    expect(value).toBeGreaterThan(100)  // Asserts that a number is greater than a certain value.
    expect(value).toBeLessThan(100)     //Verifies that a number is less than a certain value.
    expect(value).toBeNull()         // Checks if a value is null.
    expect(value).toBeDefined()      // Ensures that a variable is not undefined.
    expect(value).toMatch(/regex/)    // Asserts that a string matches a regular expression pattern.

    // SnapshotAssertions
    expect(value).toMatchSnapshot()   // match snapshot

  // === Soft Assertion / 即使失败也能继续执行下去 
  await expect.soft(page.locator('Submit_button')).toHaveText('Submit')  //加入‘soft’关键词,失败时程序会继续往下执行
  await page.locator('Submit_button').click()


  /* *** 31 Auto-Waiting ***  Playwright 借用了JS的 aync-await编程 来等待页面元素 be available
    1. Playwright performs a range of actionability checks on the elements before making actions to ensure these actions behave as expected. It auto-waits for all the relevant checks to pass and only then performs the requested action. If the required checks do not pass within the given timeout, action fails with the TimeoutError.
      For example, for locator.click(), Playwright will ensure that: locator resolves to an exactly one element is Visible
    2. Playwright has automatic waiting mechanism for the certain conditions to be satisfied, such as attached, visible, stable, receive events, enabled and editable. 
    3. And also playwright has a limited number of the methods that supports this outer waiting. The list of this method you can find here in the playwright documentation. This table provides the method name and what kind of conditions this method will automatically wait on the page to be satisfied. The duration of this wait is defined by the timeout settings. 
    4.If you interacting with the elements that do not support auto waiting, for example 'allTextContents', you can add additional wait to wait for a specific state or you can use alternative waits such as wait for the selector, wait for the response and few others that you can choose that works best for you.
  - https://playwright.dev/docs/actionability 
  */
  // --- Auto waiting ---  Action default timeout 为30秒，在playwright.config.ts中设置,例如click()
                    //--- Expect() default timeout 为5秒
    await page.locator('Submit_button').click()   // click属于会自动等待的功能，它会自动重试，直至超时(30秒)
                                                  // 若该页面加载快，这个button在30秒内出现则pass， 否则就会直接close -> fail 
    await page.locator('.bg-success').textContent()    // textContent()也会自动等待30秒并重试， 小心 allTextContents不会等待
    await page.locator('.bg-success').allTextContents()  // 这个会fail，它会return array 且不会等待
      //- 对于不会自动等待的功能，需要用变通的方法，比如一定要用allTextContents，可在其前面增加可以自动等待的功能 locator.waitFor()
      // attached / detached / visible / hidden
    await page.locator('.bg-success').waitFor({state:"attached"})    //allTextContents不会等待，所以增加一个waitFor在前面
    await page.locator('.bg-success').allTextContents()              //allTextContents不会等待，并且返回为array
      expect(page.locator('.bg-success').allTextContents()).toEqual('Data loaded') // 会failed，因为它是array
      expect(page.locator('.bg-success').allTextContents()).toContain('Data loaded') // 会成功

      await page.locator('successButton').waitFor({ state:"attached"}) // attached / detached / visible / hidden
      await page.locator('#submit-button').waitFor({ state: 'visible' });  // Wait for the button to become visible
      await page.locator('#submit-button').waitFor({ state: 'visible', timeout: 5000 }); //Wait for visible + timeout

    //我们也可以手动在code里修改 auto-wait timeout
    await expect(page.locator('.bg-success')).toHaveText('Data loaded') //会自动等待，但是 expect()只有5秒
    await expect(page.locator('.bg-success')).toHaveText('Data loaded',{timeout:30000})  // 在命令中强制成30秒

  // --- 对于不会自动等待的功能，变通方法 2 -- page.waitForXXX() <--> 对比前面则是locator.waitfor()
    // page.waitForLoadState() / page.waitForResponse / page.waitForSelector / page.waitForTimeout /etc..
      // wait for element
    await page.waitForSelector('.bg-success')
      expect(page.locator('.bg-success').allTextContents()).toContain('Data loaded')
      // wait for particular response
    await page.waitForResponse('http://abc.com')   // 填入 发出request的‘header’中的URL， 系统会等待API call返回
      // wait for network call to be completed
    await page.waitForLoadState('load')     //等待直至load state 状态变成  "load / documentloaded / networkidle"
    await page.waitForLoadState('domcontentloaded')  // wait until DOM contruction to be completed
      // wait for a particular page (when you navigate to a special page)
    await page.click('a.delayed-navigation'); // Clicking the link will indirectly cause a navigation
    await page.waitForURL('**/target.html');  // Waits for the frame to navigate to the given URL.


  /*  *** 32. Time out *** （有层级关系，且下级timeout不能超过上级）
    1. Global timeout is the time limit of the whole test run.    (default: No timeout)
      2. Test timeout is the time limit for a single test execution.  (default: 30秒)
        3-1. Action timeout      (Ex: click(),fill(),textContent(),etc.. --> no default)
        3-2. Navigation timeout  (Ex: page.goto()                      --> no default)
        3-3. Expect timeout      (Ex: expect(locator).toHaveText()   --> default: 5秒)
  */
    test.setTimeout(10000)      //改 test timeout
    test.slow()                 //将当前设置 timeout X 3
    await page.locator('.bg-success').click( {timeout:15000})   //改action timeout

//================================= < Section 4 - End > ===================================//




//============================== < Section 5 - UI components > ==============================//
  
// *** 33. input field  ***/            
  // 参见 uiComponent.spec.ts 文件的 test.describe('Form Layouts page'）下的test('input fields'）
  const gridEmailInput= page.locator('nb-card').getByRole('textbox',{name:"Email"})
  await gridEmailInput.fill('nwqa@adesa.com')
  await gridEmailInput.clear()
  await gridEmailInput.pressSequentially('nwqa@adesa.com',{delay:1000}) //模拟键盘输入，并可设置延迟每1秒输入一个字符
  await gridEmailInput.type('nwqa@adesa.com',{delay:1000})              //另一种延迟方法

  //generic assertion
  const inputValue = await usingTheGridEmailInput.inputValue() ;
  expect(inputValue).toEqual('test2@test.com');
  //locator assertion
  await expect(usingTheGridEmailInput).toHaveValue('test2@test.com');


// *** 34. radio button ***/            
    const usingTheGridForm = page. locator('nb-card', {hasText: "Using the Grid"})  // 先找到整个大模块
    
    await usingTheGridForm.getByLabel('Option 1').check()              //然后 选中checkbox和radiobutton中选项 进行操作
    // await usingTheGridForm.getByLabel('Option 1').check({force: true})
    /* 在这个例子中 DOM有三层 label -> Input -> Span -> "Option 1", 但是在input这一层时 class=“visually-hidden”， 
    如果我们只是 await usingTheGridForm.getByLabel('Option 1').check() 则会失败，无法选中该radio  因为check()有自动等待功能，
    会等待元素可见，我们需要给它加上 {force: true} 来让check()不等待，强行选中 
     --> 所以Playwright 推荐使用getbyRole */
    await usingTheGridForm.getByRole('radio', {name: "Option 1"}).check({force: true})   // 操作 推荐getByRole()

    // assertion 
    const radioStatus = await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked() //返回 true/false
    expect(radioStatus).toBeTruthy()                                                    //检查方法 1 - Generic assertion 

    await expect(usingTheGridForm.getByRole('radio', {name: "Option 1"})).toBeChecked() //检查方法 2 - locator assertion 

    // 下面这个例子是检查 当用户再点击选择 “option 2”时，option_1应该自动 unchecked，而option_2 为 checked 状态
    await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true}) 
    expect (await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()).toBeFalsy() 
    expect (await usingTheGridForm.getByRole('radio', {name: "Option 2"}).isChecked()).toBeTruthy()


  
// *** 35. Check Box***/            
  // 菜单 Modal->子菜单 Toastr 下包含 checkbox 
  await page.getByText( 'Modal & Overlays').click()    // 像这种菜单项的定位使用 getByText()非常方便
  await page.getByText('Toastr').click()

  await usingTheGridForm.getByText('Modal').click({force:true})   //注意check与click的区别,
  await usingTheGridForm.getByText('Modal').check({force:true})   //有时选项会invisible或被blocked,force参数可绕过可用性检查
  // 在这里要注意 check 与 click 的区别。 click是翻转，而check是确保选中。如原先已经选中，则check不会改变现状，而click不同

  // 单个 check box 选中
  await usingTheGridForm.getByRole('checkbox',{name:"Hide on click"}).uncheck()  //推荐使用getByRole
  // 遍历所有checkbox子选项
  const allBox = page.getByRole('checkbox')     // uncheck所有checkbox选项  -> 小心此时allBox 是一个对象合集，但不是Array
  for (const box of await allBox.all()){        // all() 把前面locator所返回的对象转换成 Array
    await box.uncheck({force:true})
  }
  // 也可以改写成：
  //  const allBoxArray = await page.getByRole('checkbox').all();   
  //  for (const box of allBoxArray){


// *** 36. List and Dropdown / listbox ***/            
    const dropDownMenu = page.locator('ngx-header nb-select') //在该实例中code中无dropdown，只能用tag的层叠来定位，先找到menu框,见截图
    await dropDownMenu.click()      //会展开下拉菜单

    page.getByRole('list')          //when the list has a 'ul' tag / ul and li 是标准的HTML list的item, 在本例中有ul 
    page.getByRole('listitem')      //when the list has 'li' tag    /在本例中就没有这个list item，而是用‘nb-obtion'

    const optionList= page.getByRole('list').locator('nb-option')   // 写法 1， return 多个items
    const optionList2= page.locator('nb-option-list nb-option')     // 写法 2， 这两种写法都可以
    await expect(optionList).toHaveText(["Light","Dark","Cosmic"])   //验证列表选项 内含多个items 
    await optionList.filter({hasText:'Dark'}).click()                //选中列表中某选项

    // 如果测试需要验证 颜色color 等等UI 属性，参考下例 -> 重看视频看其如何提取元素的RGB值
    await expect(page.locator('nb-layout-header')).toHaveCSS('background-color','rgb(50,50,90)') 
      //toHaveCSS(name: string, value: string), 验证背景颜色是否是指定值

      const colors = {     // 定义一个 color 的 object 来存储 ， 格式：“键名：键值”
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)", 
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }

    await dropDownMenu.click()       
    for(const color in colors) {      // Colors是 Object，存有 “颜色名：RGB值”，这里遍历的是'颜色名',而非RGB值，这里color是颜色名
        await optionList.filter({hasText: color}).click()
        await expect (page.locator('nb-layout-header')).toHaveCSS('background-color', colors[color]) // 这里用的是RGB值
        await dropDownMenu.click()
    }
    /* For-Loop 有 3种类型
      1. for {var i=1 ; i<=5; i++} ()
      2. for (const element of array) {}  用于遍历可迭代对象的值
      3. for (const color in colors) {}  用于遍历对象的属性, 例如colors是 Object，存有 “颜色名：RGB值”，遍历的是'颜色',而非RGB值

      for...of 循环会按元素的索引顺序遍历元素。
      for...in 循环的遍历顺序“不确定”。它取决于对象的属性定义方式

      const numbers = [10, 20, 30, 40, 50];
        1. 使用 for...of 循环遍历数组  for (const number of numbers) {console.log(number)} // 输出：10 20 30 40 50
        2. 使用 for...in 循环遍历数组  for (const index in numbers) {console.log( numbers[index] )} 输出：10 20 30 40 50
    */ 

//*** 37. Tooltip ***/            
    // tooltip 的困难在于当鼠标移开时就会消失，用 inspect 时 DOM 会collapse起来，所以是无法从code里面看到的
    // 方法： 在inspect里打开 Source Tab，鼠标移回button上方，等待tooltip 出现后使用 'command' + '\' 可以冻结窗口，WIN系统是 F8，
    // 此时进入 debug 模式， 再选择回 Element Tab，此时就可以点击展开原来 collapse 的 DOM 了，本例中会发现label <nb-tooltip>
    const toolTip = page.getByRole('tooltip')             //如果code里面有标出tooltip role，则这种方法最好
    page.locator('nb-card',{hasText:"tooltip placement"}) //在本例中code里无tooltip，只好通过tag再加tooltip的内容来定位

    await toolTip.getByRole('button',{name:"Top"}).hover()  //方法 1: 找到 标识有“Top”的button 并 hover()
    page.getByRole('tooltip') //定位方法2 - if you have a role ‘tooltip’ created in code，但本例中不适用

    const tooltip = await page.locator('nb-tooltip').textContent()     // 取得tooltip里弹出文字
    expect(tooltip).toEqual('This is a tooltip')
    

//*** 38. Dialog Boxes ***/            
// Modal->Dialog 菜单下包含 第一种 dialog -> Web dialog box -> part of the DOM, 可以使用 inspect 来定位
// Tables-> Smart table 菜单下包含第二种 -> Browser dialog box -> 无法使用 inspect 来定位

  page.on('dialog', dialog => {            // page.on(event, listener:()=>{}) 添加一个 listener（dialog event）
    expect(dialog.message()).toEqual('Are you sure you want to delete?')        //验证是我操作弹出的对话框
    dialog.accept()     
  })         //如果不加这个，在下面步骤中点击删除按钮后会弹出 browser 的对话框，可惜它会自动取消，因为没有人按 确定键

  await page.getByRole('table').locator('tr', {hasText: "mdo@abc.com"}).locator('.nb-trash').click()//点删除按钮
  await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')  //验证原来那行已经消失


//*** 39.  Web tables - 1 ***/            
  /* table 大致有以下几层 <table> / <thead> / <tbody> / <tr> / <td>
      即：table / table head / table body / table row / table data cell
      定位通常是根据某一个unique value来找到该数据row，在横向去寻找需要操作的element，比如 删除，添加等等操作
      很多时候难点在于无法取得 竖向的元素值，因为<td>都是包裹在<tr>里面 
  */
  //getByRole()是一个很好用的定位表格元素的方法，下面就是用该行拥有的email值来定位该行
    const targetRow = page.getByRole('row', {name: "twitter@outlook.com"}) 
    await targetRow.locator('.nb-edit').click()      //在该 row 中定位并点击 编辑按钮

  //本例中还有一个难点，用户的email原来是表中一个text，然后在点击编辑按钮后，表格进入编辑模式，此时再去定位时会发现text不见了
  //此时email 变成了一个property，变成了一个value  本例中变成了 ng-reflect-model="twitter@outlook.com"
  //例如我需要修改用户的年龄，可是在编辑模式下，年龄变成了一个input value，所以我可以改用placeholder 来定位
  await page.locator('input-editor').getByPlaceholder('Age').clear() 
  await page.locator('input-editor').getByPlaceholder('Age').fill('35') 
  await page.locator('.nb-checkmark').click()

  //另外一难点是 不同的row可以有相同的值，哪怕是unique ID,例如A用户ID# 就可以与B用户年龄值一样，这样在getbyrole('row')出问题
  //以下例子就是添加filter -> page.locator('td').nth(1).getByText('11') 即根据表格的第二个元素有text“11”来筛选
  page.getByRole('row', {name: "11"}).filter({has: page.locator('td').nth(1).getByText('11')}) 
  
//*** 40.  Web tables - 2 ***/            
  // 本例是测试table 的filter 功能，即用户在页面上设定筛选条件，例如用户年龄为20岁
  await page.locator('input-filter').getByPlaceholder('Age').clear() 
  await page.locator ('input-filter').getByPlaceholder('Age').fill('20') 

  const ageRows = await page.locator('tbody tr').all()  
  for(let row of ageRows ){}   //locator 后取回的是DOM 对象，用all()可以转成Array，然后就可以用 loop 等功能



//*** 41. Date picker 1 ***/                   
  // 普通日期选择器结构为 <nb-calendar-picker> / <nb-calendar-picker-row> / <nb-calendar-day-cell> / 日期值
  // 难点在于本月中会有上月尾与下月初同时出现，比如7月的1号与8月的1号会同时出现在7月的picker中，需要限定仅当月的被选中
  // 在本例中我们可以 看到在<day-cell>中class 含多个的属性会，其中以“bounding-month"来代表其不是当月的日期
  // 例如 当月的是[class="day-cell ng-star-inserted"]，非当月的是[class="bounding-month day-cell ng-star-inserted"]
  // page.locator('[class="day-cell ng-star-inserted"]').getByText(‘15’).click() 即可点击15号日期
  // 另外的问题是 如果getByText(‘1’)，它会返回 1,11,12,13...,19,21,31, 所以需要加 {exact: true}来限定
  await page.locator('[class="day-cell ng-star-inserted"]').getByText('1', {exact: true}).click()
  await expect(page.getByPlaceholder('Form Picker')).toHaveValue('Jun 1,2024')  //最后textbox中的值


//*** 42. Date picker 2 ***/        
  // 本例子是介绍 单日期选择， 日期的范围选择则参考 50. date paicker page object
  //-> 自动选择日期 /JS日期函数 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date 
  // const expectDate = new Date('July 19, 2024 20:00:00')   -> create a Date 
  let date = new Date()                              // JS feature
  date.setDate(date.getDate() + 7)                   // getdate 返回“日”，类型为数字,再用setdate创建 +7天
  const expectedDate = date.getDate().toString()
  const expectedMonthShot = date.toLocaleString('En-US', {month: 'short'}) //本例中textbox用short格式(3位长)
  const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})  //date picker的header中年月为long格式
  const expectedYear = date.getFullYear()
  const dateToAssert = `${expectedMonthShot} ${expectedDate}, ${expectedYear}`

  await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()
  await expect(page.getByPlaceholder('Form Picker')).toHaveValue(dateToAssert)

  // 如果需要增加超过一个月，则上面的code会failed，需先计算是否需要点击下一页后才可以定位日期值
  // 所以需要先确定 data picker 的header里面的 月+年 是否是期待值，如果不是则点击下一页，直至到达期待月份 expectedMonthAndYear
  let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
  const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`   // 创建 期待年月 的字符串
  while(!calendarMonthAndYear.includes(expectedMonthAndYear)){          // string.include() 是否包含子字符串
      await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
      calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
  }
  await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()
  await expect(page.getByPlaceholder('Form Picker')).toHaveValue(dateToAssert)


//*** 43. Slider ***/
    // method 1: Update attribute 直接修改slider控制块的 位置属性
    const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    await tempGauge.evaluate( node => {
        node.setAttribute('cx', '232.630')
        node.setAttribute('cy', '232.630')
    })                        
    // evaluate()方法是 JS中用于在特定 DOM节点的上下文中执行JS代码的方法。即直接修改当前的DOM。
    // 在本例中，控制滑块为 <ngx-temperature-dragger> / <circle>（参见上面locator）里面有属性 cx=“232.630” cy=“232.630” 
    // 其代表控制块的 XY坐标，所以我们将locator获取的'circle'传入evaluate()里面定义的函数，通过修改DOM里面XY值来控制滑块移动
    await tempGauge.click() //因为前面是直接修改属性值，UI缺失event的触发故不会发生改变，补上该步让页面确认前面XY位置的改动

    //method 2: Mouse movement  模拟鼠标移动
      // 需要先确认 slider 的 area (box)
      // * dragger 本身有一个属性'ng-reflect-set-value' 代表了当前控制滑块 所代表的值，而非上面cx/cy 代表的位置信息
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger') //先找到整个slider (dragger)
    await tempBox.scrollIntoViewIfNeeded()               // 常用，让 PW 来自动上下滚屏

    const box = await tempBox.boundingBox() 
    //在PW中，Page/ElementHandle 对象的 boundingBox属性表示包含元素可见内容的矩形区域。它是用于视觉测试和与网页元素交互的工具
    //PW的 boundingBox()会给从DOM 返回的对象创建一个可以交互的视觉属性: (以左上角为原点的) x坐标/ y坐标/ width /height
    // **视觉测试网页元素：**您可以使用边界框坐标直观检查页面上元素的位置和大小。
    // **与网页元素交互：**您可以使用边界框坐标执行诸如单击元素或滚动使其可见之类的操作。
    // **截取屏幕截图：**您可以使用边界框坐标截取页面的特定区域的屏幕截图。
    const x = box.x + box.width / 2     
    const y = box.y + box.height / 2
    // 上面这个操作目的是将鼠标移动到整个滑块区域的中心位置，并以其为起始点，好控制“增加”与“减少”的操作
    // box.x 与 box.y 是要取得整个滑动块相对于当前整个页面的位置，加上 width/2 就可以定位到滑动块的中心点，好方便鼠标操作
    await page.mouse.move(x, y)        //注意PW 的mouse 控制的方法， 这个是移动到指定位置
    await page.mouse.down()            // 这个是鼠标左键按压不放
    await page.mouse.move(x +100, y)    // 鼠标按住的同时移动鼠标，先向右移动
    await page.mouse.move(x+100, y+100)   // 再向下移动，即 “增加”的操作
    await page.mouse.up()                 // 左键释放
    await expect(tempBox).toContainText('30')

//*** 44. Drag & Drop with iFrames ***/  
  // iFrame，全称 Inline Frame，即内联框架，是 HTML 中的一种元素，用于在当前页面中嵌入另一个完整的网页。它就像一个窗口，可以显示
  // 来自另一个源的 HTML 文档，主要作用是将来自不同来源的内容嵌入到同一个页面中，而无需重新加载整个页面
  // <iframe src="https://example.com/page.html" width="600" height="400"></iframe>
  // iFrame 之内，有自己单独一套 的html架构,需要引入frameLocator来定位，见下例
  await page.goto('https://www.globalsqa.com/demo-site/draganddrop/')
  const frame = page.frameLocator('[rel-title="Photo Manager"] iframe')
  await frame.locator('li', {hasText:"High Tatras 2"}).click() 

  // Drag and drop     -> 注意 dragTo(target：locator) 的用法 
  await frame.locator('li', {hasText:"High Tatras 2"}).dragTo(frame.locator('#trash'))  

  // 方法2： more presice control，即不使用 dragTo()，只用鼠标控制
  await frame.locator('li', {hasText:"High Tatras 4"}).hover()
  await page.mouse.down()
  await frame.locator('#trash').hover()
  await page.mouse.up()

  await expect(frame.locator('#trash li h5')).toHaveText(["High Tatras 2", "High Tatras 4"])

//============================== < Secion 5 - End > ==============================
//*** 45. What Is Page Objects  ***/  
  /* The page object model is a design pattern used in the test automation to organize source code, improve
  maintainability and reusability of the code.
  DRY - Don't repeat yourself
  KISS - Keep it simple stupid 
  */

//*** 46. First Page Object   ***/  
  // create a page TS file, 里面有一个class NavigationPage
  // 在navigationPage.ts 中： 
  import { Page } from "@playwright/test";
  export class NavigationPage {
    readonly page: Page

    constructor(page: Page) {   // constructor 等待 test 传入一个object(page)，其实是一个 fixture
        this.page = page        // 左右两边的page 是不同的，左边的this.page是local的，即上面readonly的page
    }                           // 右边的page 是上面constructor 的参数传入的page 

    async formLayoutsPage() {
        await this.page.getByText('Forms').click()         // 小心这里需要加 this.，操作的是local的page
        await this.page.getByText('Form Layouts').click()  // 如果没有this则会报错说找不到 name ‘page’ 
        //另外注意 在这个class中，page是本身的属性之一，写async函数时无需传入参数(page)，内部直接 this.page
    }
  }    
  // 在 test 中
  import { NavigationPage} from '../page-objects/navigationPage'

  test.beforeEach(async({page}) => { await page.goto('http://localhost:4200/') })

  test ('navigate to form page', async({page}) => { 
      const navigateTo= new NavigationPage(page)    // 创建一个新的 Navigation page的实例
      await navigateTo.formLayoutsPage()
  })


//*** 47. Navigation Page Object   ***/  
  // 本质就是将要测试的功能进行划片，由Navigation page object来导向到每一个小片
  // 例如 导向到 datepicker ， 导向到 smart table 等等
  // 小注意点：分解后可能会出现互相冲突的现象。比如一个小片要求点击菜单来展开，另外一个小片也要，这时可能产生冲突
  // 即运行了A 以后再运行B时 可能因为点击了2次反而造成菜单关闭，故经常需要增加判断来避免


//*** 48. Locators in Page Objects   ***/  
  // Playwright 推荐要把locator 与 method 分离开
  import { Locator, Page } from "@playwright/test"; //注意这里import了2个fixture，Locator 与 Page

  export class newNavigationPage {
    readonly page: Page
    readonly fromLayoutsManuItem: Locator 
    readonly datepickerMenuItem: Locator 
    
    constructor(page: Page) { 
      this.page = page
      this.fromLayoutsManuItem = page.getByText('Form Layouts') //把所有的locator都集中到constructor来
      this.datepickerMenuItem = page.getByText('Datepicker') 
    }

    async formLayoutsPage() { await this.fromLayoutsManuItem.click()} //把 method 也集中到一起来
    async datepickerPage() { await this.datepickerMenuItem.click() }



//*** 49. Parametrized Methods    ***/  
  /**     输入 “/**” 系统会自动建立一个参数说明块
       *    -->输入函数代码说明 
       * @param name       - XXXXXXXX     在VS中用鼠标悬浮在调用代码时会浮现出此处的说明，以帮助使用
       * @param email      - XXXXXXXX
       * @param rememberMe - XXXXXXXX
       */
    async sumbitInlineFormWithNameEmailAndCheckbox (name: string, email: string, rememberMe: boolean){
      const inlineForm = this.page. locator ('nb-card', {hasText: "Inline form"})
      await inlineForm.getByRole('textbox', {name: "Jane Doe"}).fill(name)
      await inlineForm.getByRole('textbox', {name: "Email"}).fill(email)
      if (rememberMe)
          await inlineForm.getByRole('checkbox').check({force: true}) 
      await inlineForm.getByRole('button').click()
    }

//*** 50. Date Picker Page Object   ***/  
  // 本例子是用与 date picker 的 range selection的case, 单个日期参考 41.42. date picker 章节
  // 思路：将选择具体日期变成一个private的method(selectDateInCalendar)，用于选择 从今天起 n天后的日期
  async selectDatepickerWithRangeFromToday(startDayFromToday: number, endDayFromToday: number){
    const calendarInputField = this.page.getByPlaceholder('Range Picker')
    await calendarInputField.click()
    const dateToAssertStart = await this.selectDateInTheCalendar(startDayFromToday)
    const dateToAssertEnd = await this.selectDateInTheCalendar(endDayFromToday)
    const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`
    await expect(calendarInputField).toHaveValue(dateToAssert)
  }
  // 注意 在 single picker 与 range picker 代码不同，故locator也需升级成可以同时兼容二者的 
  //class="day-cell ng-star-inserted"             -> locator('[class="day-cell ng-star-inserted"]')
  //class="range-cell day-cell ng-star-inserted"  -> locator('day-cell.ng-star-inserted')  兼容2者
}

//*** 51. Page Objects Manager   ***/  
  /*在实际项目中会有很多的page objcet对象，你需要import 几十个 page instances, 造成test case 复杂且难读
  解决思路就是建立一个 page manager，在测试中就是call这个manager，由它来返回我需要的page instance
  在这个manager里面有多个属性，当我们的test call 这个manager的某属性时它就会返回一个page instance 

  在 pageManager.ts 里面：
  constructor(page: Page){
    this.page = page
    this.navigationPage = new NavigationPage(this.page)
    this.formLayoutsPage = new FormLayoutsPage(this.page)
  }
  navigateTo(){ return this.navigationPage }
  onFormLayoutsPage(){ return this.formLayoutsPage} 

  在 test 里面： 
    const newPage = new PageManager(page)
    await newPage.navigateTo().formLayoutsPage()
  */


//*** 52. Page Objects Helper Base  ***/  
  // 建立一个通用的更底层的 method 库, 例如建一个通用的 delay 的功能
  // 在其他 class 就可以使用这个功能， 例如 export class NavigationPage extends HelperBase {}
  // 注意在原来的class 的constructor 里面要使用 super() 来 inherit 



//============================== < Secion 6 - Page Object Model > ==============================
/*
  1. Page object model is a design pattern used in the test automation to organize source code, improve maintainability and reusability of the code.
  2. 把对象页面的元素定位工作都集中到一个页面对象中并封装独立出来，其中定义constructor来构建页面，定位元素，同时定义method，
    以后在测试代码中只留下要做的操作，即(调用method)。 如果页面上的元素有修改，则只需要到那个页面对象的文件中修改就好，无需改动测试代码








*/
//============================== < Secion 6 - End > ==============================

//============================ < Secion 7 - Working with API > ============================
/*
*/
//============================== < Secion 7 - End > ================================



//============================== < Secion 8 - Advanced > ==============================
/*
  1. npm run
      在package.json 文件里定义run的具体参数，然后用npm run 来调用
      在“script"下面可以加： ”runPageOjbect“: "npx playwright test usePageObjects.spec.ts --project=chromium"
      然后调用为： npm run runPageObject 
      = npx playwright test usePageObjects.spec.ts --project=chromium

  2. Test Data generator
      install faker library

  3. Test retry
    * 在"playwright.config.ts" 文件中可以找到 retries: process.env.CI ? 2:0  代表在CI环境中try 2次，local不retry
    * 也可以在code 里面直接改动:  test.describe.configure({retries:2})
    * 如果需要在retry时加以特殊控制，则需要在参数中传入'testInfo', 然后在代码中加入如下代码
        test('Locator syntax rules', async ({ page }, testInfo) => {
          if(testInfo.retry){
            // do something
          }
        });

  4. Run in parallel

  5. Screenshots and Videos
    * 自动创建文件夹并将screenshot 保存其下
        await page.screenshot({path:'screenshots/xxx.png')                    // whole page
        await page.locator('nb-card').screenshot({path:'screenshots/xxx.png') // only take screenshot on located area 
    * 也可以将其存入变量待后期处理
        const bufferImage = await page.screenshot()
    
    * record a video
      需要在playwright.config.ts 里面‘use’ 下面打开 video: 'on' /其他选项:‘on-first-retry','retain-on-failre', etc..
      如需高分辨率可以  video:{ mode:'on',
                            size:{width:1920, height:1080} }
        注意 在plugin里触发测试不会record video，需要用CLI 来
        然后到 test-results 文件夹下可以在对应的测试下看到 webm 文件
        另外运行 npx playwright show-report 也可在网页版report下找到视频

  6. Environment Variables
    * 加 baseURL: 'http://localhost:4200/' 到 playwright.config文件中‘use’ 下面
        随后在code中就不需要在打前面的URL了，可以调用如下： 
          await page.goto('/form')    // = 'http://localhost:4200/form' 

    * 注意上面的‘use’ 下面的各种设定是可以改到各个project 下面单独设定的

    * 如果需要在一个测试中使用不同的base URL，例如 stage 与 test 使用不同的URL，请具体看视频

  7. Configuration file
    * Example:
        expect: { timeout: 2000 },
        retries: 1,
        reporter: 'html',
        use: {
          globalURL: 'https://www.globalsqa.com/demo-site/draganddrop/', 
          baseURL: process.env.DEV === '1' ? 'http://localhost:4201/'
                  : process.env.STAGING == '1' ? 'http://localhost:4202/'
                  : 'http://localhost:4200/',
          trace: 'on-first-retry',
          actionTimeout: 20000,
          navigationTimeout: 25000,
          video: {mode: 'off',
                  size: {width: 1920, height: 1080}
                }
        },

     *  https://playwright.dev/docs/test-configuration  
        https://playwright.dev/docs/test-use-options








*/
//============================== < Secion 8 - End > ================================

//== Project setup ==
/* Configure projects for major browsers */ 
import { defineConfig, devices } from '@playwright/test';
projects:[
  { // A
    name: 'setup', 
    testMatch: 'auth.setup.ts'
  },
  { // B
    name: 'articleSetup',
    testMatch: 'newArticle.setup.ts',
    dependencies: ['setup'],          // “articleSetup”有dependancy 在“setup” 上， 即 B -> A 
    teardown:'articleCleanUp'         // 运行结束后调用 article cleanup 来清理
  },
  { // C
    name: 'likeCounter',                    // project名字。 在npx命令中 -- project=likeCounter
    testMatch: 'likesCounter.spec.ts',      // 会运行匹配的test，在此处为唯一的文件名
    use: { ...devices['Desktop Chrome'], storageState: '.auth/user.json'},   // 指定use的细节
    dependencies: ['articleSetup']         // 指定dependancy，即需先调用的项目，即 C -> B -> A 
  },
  { // D
    name: 'regression',                   // 小心，没有testMatch，所以默认会运行目录下所有spec.ts
    testIgnore: 'likesCounter.spec.ts',   // 排除 指定的test
    use: {...devices['Desktop Chrome'], storageState: '.auth/user.json' }, 
    dependencies: ['setup'],           // D -> A
  },
  { // E
    name:'articlCleanUp',
    testMatch:'articleCleanUp.setup.ts'     // 
  }
]




// 8-9 project setup and teardown (teardown 摧毁，即最后清理还原)
/* You can create a global setup and teardown using a project level.

1. create a separate project that will match a certain setup test that will create a setup for you and match an additional project that will make a teardown. 

In our example, it's Article Cleanup project, and then you just create a dependency inside of your test on the project that you want to run to depend on the project that controls your setup and your teardown.
*/


// 8-10 global setup and teardown   这里的setup其实是“项目初始化”，teardown是“项目结束后清理”




// 8-11 Test tag       在测试代码中设置tag，然后调用时用tag 名字来调用
    test('test 01 @ABC', async ({ page }) => { XXX }    // 设定测试名称时加 @ABC 
    调用时： 
    npx playwright test --grep @ABC    // --grep @ABC 即定位该测试  ‘grep’是Unix中字符串查找工具
                                       // 可以使用同一个tag 定位多个 test， 运行时会将同样tag 的测试同时运行







   /**     输入 “/**” 系统会自动建立一个参数说明块
     *    -->输入函数代码说明 
     * @param name       - XXXXXXXX     在VS中用鼠标悬浮在调用代码时会浮现出此处的说明，以帮助使用
     * @param email      - XXXXXXXX
     * @param rememberMe - XXXXXXXX
     */


});


/* GetByRole(): 
|--------------------------|---------------------------|
| alert                    | 警告                       |
| alertdialog              | 对话框警告                 |
| application              | 应用                       |
| article                  | 文章                       |
| banner                   | 横幅                       |
| blockquote               | 引用块                     |
| button                   | 按钮                       |
| caption                  | 标题                       |
| cell                     | 单元格                     |
| checkbox                 | 复选框                     |
| code                     | 代码                       |
| columnheader             | 列标题                     |
| combobox                 | 组合框                     |
| complementary            | 补充                       |
| contentinfo              | 内容信息                   |
| definition               | 定义                       |
| deletion                 | 删除                       |
| dialog                   | 对话框                     |
| directory                | 目录                       |
| document                 | 文档                       |
| emphasis                 | 强调                       |
| feed                     | 源                         |
| figure                   | 图片                       |
| form                     | 表单                       |
| generic                  | 通用                       |
| grid                     | 网格                       |
| gridcell                 | 网格单元格                 |
| group                    | 组                         |
| heading                  | 标题                       |
| img                      | 图像                       |
| insertion                | 插入                       |
| link                     | 链接                       |
| list                     | 列表                       |
| listbox                  | 列表框                     |
| listitem                 | 列表项                     |
| log                      | 日志                       |
| main                     | 主要                       |
| marquee                  | 跑马灯                     |
| math                     | 数学                       |
| meter                    | 测量仪                     |
| menu                     | 菜单                       |
| menubar                  | 菜单栏                     |
| menuitem                 | 菜单项                     |
| menuitemcheckbox         | 复选框菜单项               |
| menuitemradio            | 单选框菜单项               |
| navigation               | 导航                       |
| none                     | 无                         |
| note                     | 注释                       |
| option                   | 选项                       |
| paragraph                | 段落                       |
| presentation             | 演示                       |
| progressbar              | 进度条                     |
| radio                    | 单选框                     |
| radiogroup               | 单选框组                   |
| region                   | 区域                       |
| row                      | 行                         |
| rowgroup                 | 行组                       |
| rowheader                | 行标题                     |
| scrollbar                | 滚动条                     |
| search                   | 搜索                       |
| searchbox                | 搜索框                     |
| separator                | 分隔符                     |
| slider                   | 滑块                       |
| spinbutton               | 旋转按钮                   |
| status                   | 状态                       |
| strong                   | 粗体                       |
| subscript                | 下标                       |
| superscript              | 上标                       |
| switch                   | 开关                       |
| tab                      | 选项卡                     |
| table                    | 表格                       |
| tablist                  | 选项卡列表                 |
| tabpanel                 | 选项卡面板                 |
| term                     | 术语                       |
| textbox                  | 文本框                     |
| time                     | 时间                       |
| timer                    | 计时器                     |
| toolbar                  | 工具栏                     |
| tooltip                  | 提示                       |
| tree                     | 树                         |
| treegrid                 | 树状网格                   |
| treeitem                 | 树节点                     |
*/