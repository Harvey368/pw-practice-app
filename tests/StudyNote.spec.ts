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








//================================= < Section 3  > ===================================//
  
// 21. Tests Structure
// page.goto + waitUntil
test('test 01', async ({ page }) => {
    await page.goto('https://example.com', { waitUntil: 'domcontentloaded' });  
    // 在调用 page.goto() 后，页面会导航到指定的 URL，然后脚本会等待直到 'DOMContentLoaded' 事件被触发，然后再继续执行后续的代码。=>  waitUntil?: "load"|"domcontentloaded"|"networkidle"|"commit"
    // load 事件在整个页面和所有其资源（例如图片、样式表、脚本等）都加载完成后触发。
    // DOMContentLoaded 事件在 HTML 文档加载完成并且解析完成后触发，而不必等待样式表、图像和子框架的加载完成。
    // ** playwright 的function 有些return 的是Promise， 那么前面就必须加 Await。 例如这个page.goto() 

    await page.waitForURL('https://app.stg.openlane.ca/')
    await page.waitForLoadState('load'); 
    //await page.waitForTimeout(10000)
    //await page.reload()
  })

// 22. Hooks and Flow Control
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

/*    23. DOM Terminology
1. HTML dom consists of HTML tags, HTML attributes and attribute values.
2. Class and ID are also HTML attribute names.
  Class attribute can have a several values and each value is separated by space.
3. HTML tags usually come in pairs of opening and closing tag. Closing tag has the same name and the forward slash. <> </>
4. Value in between the angle braces is a plain text or HTML text.
复习随附 DOM 结构说明
Tag -> Attribute -> Value      一个Attribute 可能没有value，也可以有多个value， 例如 class
Class 与 ID 也是attribute的一种，
*/

//===== 24. Locator Syntax Rules ========= 
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

  // === 25. user facing locator  ===== 最主要目的是从用户角度来测试 ====== 
  // 例如，UI button 上的text消失，对于用户就是无法操作，可是如果使用ID等，测试仍然可以通过，所以需要从用户角度来测试

    page.getByRole('textbox', {name:"Email"}).first().click()
    page.getByRole('button', {name:"Sign in"}).first().click()

    page.getByLabel('Email').first().click()      // 元素有一个 tag <label>

    page.getByPlaceholder('Jane Doe').first().click()    //元素有一个 attribute placeholder=“Email”

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

  // === 26. locate child elements   //  ==== combined locator ===  
  page.locator('nb-card').getByRole('button',{name:"Sign in"}).first()
  page.locator('nb-card').nth(2).getByTestId('SignIn')  //nth是 第n个元素,其返回值仍是一个DOM块,可以继续往下定位
  page.locator('nb-card nb-radio :text-is("Option 2")')  //级联定位 有空格/ 父tag + 子tag + 精确文字匹配 / 等同下一条
  page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")') //更易读，父tag ->子tag ->精确文字匹配
  page.locator('nb-card').getByRole('button',{name:"Sign in"}).first()  //也可以组合user facing locator
  page.locator('nb-card').nth(3).getByRole('button')   //注意，第一个是 0


  // === 27. locate parent elements == 通过（子元素）辅助定位来找（父元素）+  或者可通过它找到 sibling 的元素
  page.locator('nb-card',{hasText:"Using"})  //locator函数可以传入object参数 + hasTaxt模糊匹配 + 子元素中有 text “Using”
  page.locator('nb-card',{hasText:"Using"}).getByRole('textbox',{name:"Email"})  //继续组合其他定位方式 找sibling 
      //下面展示用 has: 传入一个用ID匹配的块，即可以用一块的DOM 来辅助定位
  page.locator('nb-card',{has: page.locator('#inputEmail1')}). getByRole('textbox',{name:"Email"}) 
      // 下面进阶用 filter 更易读, 更易理解 其通过（子元素）辅助定位来找（父元素）
  page.locator('nb-card').filter({hasText:"Using"}). getByRole('textbox',{name:"Email"})  // 以上2句的变形，更易读
  page.locator('nb-card').filter({has: page.locator('#inputEmail1')}). getByRole('textbox',{name:"Email"}) 
      // Filter 可以帮助用户在页面有多个相似元素时定位到正确的元素
  page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText:"Sign"})
       //Filter可以并联使用，第一个filter运行后是返回一个‘nb-card’的列表，可以继续filter
  page.locator(':text-is("Using the Grid")').locator('..')  // locator('..') 代表找当前元素的上一级元素

  //In order to find a web element using a locator method, you can use a text filter or a locator filter, and then chain from this parent element all the child elements that you want to select. 
  //Also, you can alternatively use a filter method that will do exactly the same thing, what is the benefit of using a filter method that you can chain multiple filters one by one, narrowing down your output to the unique element until you get the desired result.
  //==========================================


  // ==== 29. Extract value  ======
  // == Extract Single value 
  const buttonText= await page.locator('button').textContent()
  expect (buttonText).toEqual('Sign in')
  // == Extract all values 
  const allRadioButtons = await page.locator('nb-radio').allTextContents()   // 存入一个 Array
  expect(allRadioButtons).toContain("Option 2")
  // == get input value 
  const emailValue = page.getByRole('textbox',{name:"Email"}).inputValue()
  // == get element attributes 
  const placeholderList = await page.getByRole('textbox',{name:"Email"}).getAttribute('placeholder') //获得被定位元素的p属性


  // ===== General assertions =====
  const X = page.locator('inputbox').inputValue()
  expect(X).toEqual(5)

  //===== Locator assertions =====
  await expect(page.locator('inputbox')).toHaveText('Submit')  //更智能，会retry，多了一些对元素的操作
  await expect(page.locator('nb-layout-header')).toHaveCSS('background-color','rgb(50,50,90)') //验证背景颜色是否是指定值

  // ===== Soft Assertion / 即使失败也能继续执行下去 ======
  await expect.soft(page.locator('Submit_button')).toHaveText('Submit')  //加入‘soft’关键词,失败时程序会继续往下执行
  await page.locator('Submit_button').click()


    // ===== waiting =====   
  await page.waitForLoadState("load")                             // load / documentloaded / networkidle
  await page.locator('successButton').waitFor({ state:"attached"}) // attached / detached / visible / hidden
  await page.locator('#submit-button').waitFor({ state: 'visible' });  // Wait for the button to become visible
  await page.locator('#submit-button').waitFor({ state: 'visible', timeout: 5000 }); //Wait for visible + timeout
  /*
    1. Playwright performs a range of actionability checks on the elements before making actions to ensure these actions behave as expected. It auto-waits for all the relevant checks to pass and only then performs the requested action. If the required checks do not pass within the given timeout, action fails with the TimeoutError.
      For example, for locator.click(), Playwright will ensure that: locator resolves to an exactly one element is Visible
    2. Playwright has automatic waiting mechanism for the certain conditions to be satisfied, such as attached, visible, stable, receive events, enabled and editable. 
    3. And also playwright has a limited number of the methods that supports this outer waiting. The list of this method you can find here in the playwright documentation. This table provides the method name and what kind of conditions this method will automatically wait on the page to be satisfied. The duration of this wait is defined by the timeout settings. 
    4.If you interacting with the elements that do not support auto waiting, for example 'allTextContents', you can add additional wait to wait for a specific state or you can use alternative waits such as wait for the selector, wait for the response and few others that you can choose that works best for you.
  - https://playwright.dev/docs/actionability 
  */
  // --- Auto waiting ---  Action default timeout 为30秒，在playwright.config.ts中设置,例如click()
                    //--- Expect() default timeout 为5秒
    await page.locator('Submit_button').click()     // click属于会自动等待的功能，它会自动重试，直至超时(30秒)
    await page.locator('.bg-success').textContent()  // textContent()也会自动等待并重试， 小心 allTextContents不会等待

    await expect(page.locator('.bg-success')).toHaveText('Data loaded') //会自动等待，但是 expect()只有5秒
    await expect(page.locator('.bg-success')).toHaveText('Data loaded',{timeout:30000})  // 在命令中强制成30秒

  // --- 对于不会自动等待的功能，需要用变通的方法，在其前面增加可以自动等待的功能 locator.waitFor()
        // attached / detached / visible / hidden
    await page.locator('.bg-success').waitFor({state:"attached"})    //allTextContents不会等待，所以增加一个waitFor在前面
    await page.locator('.bg-success').allTextContents()              //allTextContents不会等待，并且返回为array
                expect(page.locator('.bg-success').allTextContents()).toEqual('Data loaded') // 会failed，因为它是array
                expect(page.locator('.bg-success').allTextContents()).toContain('Data loaded') // 会成功
  // --- 对于不会自动等待的功能，变通方法 2 -- page.waitForXXX()
    // page.waitForLoadState() / page.waitForResponse / page.waitForSelector / page.waitForTimeout /etc..
      // wait for element
    await page.waitForSelector('.bg-success')
      expect(page.locator('.bg-success').allTextContents()).toContain('Data loaded')
      // wait for particular response
    await page.waitForResponse('http://abc.com')   // 填入 发出request的‘header’中的URL， 系统会等待API call返回
      // wait for network call to be completed
    await page.waitForLoadState('load')  // wait until load event to be fired
    await page.waitForLoadState('domcontentloaded')  // wait until DOM contruction to be completed
      // wait for a particular page (when you navigate to a special page)
    await page.waitForURL('http://abc.com') 


  /*  --- Time out --- （有层级关系，且下级timeout不能超过上级）
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
  // input field
    const gridEmailInput= page.locator('nb-card').getByRole('textbox',{name:"Email"})
    await gridEmailInput.fill('nwqa@adesa.com')
    await gridEmailInput.clear()
    await gridEmailInput.pressSequentially('nwqa@adesa.com',{delay:1000}) //模拟键盘输入，并可设置延迟每1秒输入一个字符
    await gridEmailInput.type('nwqa@adesa.com',{delay:1000})              //另一种延迟方法

  // Input assertion
    await expect(gridEmailInput).toHaveValue('nwqa@adesa.com') 
    // or
    const inputValue = await gridEmailInput.inputValue()
    expect(inputValue).toEqual('nwqa@adesa.com')

  // radio button
    const gridForm = page.locator('nb-card',{hasTex:"Using the Grid"});
    await gridForm.getByLabel('Option 1').check()              //选中checkbox和radiobutton中选项
    await gridForm.getByLabel('Option 1').check({force:true})  //有时选项会invisible或被blocked,force参数可绕过可用性检查
    await gridForm.getByRole('radio',{name:"Option 1"}).check();  // 推荐使用getByRole
     // assertion 
    await gridForm.getByLabel('Option 1').isChecked()              //返回布尔值，判断是否已经选中   
    await expect(gridForm.getByLabel('Option 1')).toBeChecked()    // assertion
    expect(await gridForm.getByLabel('Option 1').isChecked()).toBeTruthy()
    expect(await gridForm.getByLabel('Option 2').isChecked()).toBeFalsy()

  // Check Box
    await gridForm.getByText('Modal').click({force:true})   //注意check与click的区别,
    await gridForm.getByText('Modal').check({force:true})   //有时选项会invisible或被blocked,force参数可绕过可用性检查
    await gridForm.getByRole('checkbox',{name:"Hide on click"}).uncheck()  //推荐使用getByRole
    // 遍历所有checkbox子选项
    const allBox = page.getByRole('checkbox')     // uncheck所有checkbox选项
    for (const box of await allBox.all()){
      await box.uncheck({force:true})
    }

  // Dropdown list / listbox
    const dropDownMenu = page.locator('ngx-header nb-select') //在该实例中code中无dropdown，只能用tag的层叠来定位，先找到menu框,见截图
    await dropDownMenu.click()      //会展开下拉菜单

    page.getByRole('list')          //when the list has a 'ul' tag  /在本例中有
    page.getByRole('listitem')      //when the list has 'li' tag    /在本例中就没有，而是‘nb-obtion'

    const optionList= page.getByRole('list').locator('nb-option')   // return array
    const optionList2= page.locator('nb-option-list nb-option')     //这两种写法都可以
    await expect(optionList).toHaveText(["Light","Dark","Cosmic"])    //验证列表选项
    await optionList.filter({hasText:'Dark'}).click()               //选中列表中某选项

    await expect(page.locator('nb-layout-header')).toHaveCSS('background-color','rgb(50,50,90)') //验证背景颜色是否是指定值

  // Tooltip
    const toolTip = page.getByRole('tooltip')             //如果code里面有标出tooltip role，则这种方法最好
    page.locator('nb-card',{hasText:"tooltip placement"}) //在本例中code里无tooltip，只好通过tag再加tooltip的内容来定位
    await toolTip.getByRole('button',{name:"Top"}).hover()
    await page.locator('nb-tooltip').textContent()         //取得tooltip里弹出文字


  // Dialog Boxes

  // Web tables


  // page.locator().all()  // locator 后取回的是DOM 对象，用all可以转成Array，然后就可以用 loop 等功能

//============================== < Secion 5 - End > ==============================



//============================== < Secion 6 - Page Object Model > ==============================
/*
 1. Page object model is a design pattern used in the test automation to organize source code, improve maintainability and reusability of the code.
 2. 把对象页面的元素定位工作都集中到一个页面对象中并封装独立出来，其中定义constructor来构建页面，定位元素，同时定义method，
    以后在测试代码中只留下要做的操作，即(调用method)。 如果页面上的元素有修改，则只需要到那个页面对象的文件中修改就好，无需改动测试代码




*/
//============================== < Secion 6 - End > ==============================



//============================== < Secion 7 - Page Object Model > ==============================
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