// Case #2  -->  Modify API response --> 页面访问article API，PW 接收返回值并加以修改
import { test, expect } from '@playwright/test';
import tags from '../test-data/tags.json';

test.beforeEach( async({page}) => {
    await page.route('*/**/api/tags', async route => { 
        //上面的是 RegEx, 是从 page.route('https://conduit-api.bondaracademy.com/api/tags'抽取出来
        await route.fulfill({ 
            body: JSON.stringify(tags)
        })
    })
    await page.goto('https://conduit.bondaracademy.com');
})


test('has title', async ({ page }) => {
    await page.route('*/**/api/articles*', async route => {
        const response = await route.fetch()
        const responseBody = await response.json()  
        responseBody.articles[0].title = "This is my MOCK title"
        responseBody.articles[0].description = "This is MOCK description"

        await route.fulfill({ 
            body: JSON.stringify(responseBody)
        })
    })

    await page.getByText('Global Feed').click()
    await expect(page.locator('.navbar-brand')).toHaveText('conduit');
    await expect(page.locator('app-article-list h1').first()).toContainText('MOCK title');
    await expect(page.locator('app-article-list p').first()).toContainText('MOCK description');
});

test('Post artice', async({page, request}) => {
    const response = await request.post('https://api.realworld.io/api/users/login', { 
        data: {
            "user":{
                "email":"pwtest@test.com",
                "password": "Welcome1"
            } } 
    })            // 向 Login API 送登录信息       
    const responseBody= await response.json()    // 取得 JSON格式的返回信息
    const accessToken = responseBody.user.token  // 获取 user token

    const articleData = {  //创建article 的数据
        "article":{
                    "tagList":['Test'],
                    "title":"This is a test title",
                    "description": "This is a test description", 
                    "body":"This is a test body"
                }
    }

    //下面向 article API发'POST'请求, 并获取网络返回结果代码
    const articleResponse = await request.post('https://api.realworld.io/api/articles/', { 
        data: articleData,
        headers: { Authorization: `Token ${accessToken}` }
    })
    expect(articleResponse.status()).toEqual(201)  // POST 成功
});


test('delete article', async({page, request}) => {
    await page.getByText('New Article').click()
    await page.getByRole('textbox', {name: 'Article Title'}).fill('Playwright is awesome')
    await page.getByRole('textbox', {name: 'What\'s this article about?'}).fill('About the Playwright')
    await page.getByRole('textbox', {name: 'Write your article (in markdown)'}).fill('We like Playwright') 
    await page.getByRole('button', {name: 'Publish Article'}).click()  //完成新article的创建

    const articleResponse = await page.waitForResponse('https://api.realworld.io/api/articles/')
    const articleResponseBody = await articleResponse.json()
    const slugId= articleResponseBody.article.slug   // slugID是article 的unique ID

    await page.getByText('Home').click()     
    await page.getByText('Global Feed').click()  //回到页面，准备进行删除

    const response = await request.post('https://api.realworld.io/api/users/login', {
        data: { "user":{"email":"pwtest@test.com",
                        "password": "Welcome1"
                        } 
        }
    })
    const responseBody = await response.json()
    const accessToken = responseBody.user.token
    const deleteArticleResponse = await request.delete(`https://api.realworld.io/api/articles/${slugId}`, {
        headers: {                                             // 用前面获取的 slugID 来生成 delete 的URL
            Authorization: `Token ${accessToken}` 
        }
    })   
    expect (deleteArticleResponse.status()).toEqual(204)  // 204 是删除成功的代码
})




/*  Case #1  --> Mocking API   -->PW 拦截对 tags API 的访问，返回一个预先设定的tag值，让它显示在页面上
import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
    await page.route('https://conduit-api.bondaracademy.com/api/tags', async route => { 
        const tags = {
            "tags":[ "automation",
                    "playwright",
                ]   
        }
        await route.fulfill({ 
            body: JSON.stringify(tags)
        })
    })

    await page.goto('https://conduit.bondaracademy.com');
})


test('has title', async ({ page }) => {
    await expect(page.locator('.navbar-brand')).toHaveText('conduit');
});
*/ 

