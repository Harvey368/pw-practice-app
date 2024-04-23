import { test as setup } from '@playwright/test'; 
                        //注意这里引入 test 但同时进行改名，所以后面的test case 就是以 setup()来使用了
import user from '../.auth/user.json';
import fs from 'fs' ;                    //fs= ‘file sync’，是Javascipt 内建的library 用于文件处理

const authFile = '.auth/user.json'

setup('authentication', async({request}) => {      //此处的setup = test

    // 新方法，直接call login API，获得user info后通过文件操作来保存到user.json中
    const response = await request.post('https://api.realworld.io/api/users/login', { 
        data: {
            "user":{
                "email":"pwtest@test.com",
                "password": "Welcome1"
            } } 
    })                                           // 向 Login API 送登录信息       
    const responseBody= await response.json()    // 取得 JSON格式的返回信息
    const accessToken = responseBody.user.token  // 获取 user token

    user.origins[0].localStorage[0].value = accessToken  
    const userJson = JSON.stringify(user) 
    fs.writeFileSync(authFile , userJson)      //写入文件（文件名，写入内容-JSON ） 

    process.env['ACCESS_TOKEN']= accessToken  //将我们保存的token写入当前系统中的环境变量'ACCESS_TOKEN'

    // 旧方法 - 使用 UI 登录来获取并保存 user token
    // await page.goto('https://angular.realworld.io/');
    // await page.getByText('Sign in').click()
    // await page.getByRole('textbox', {name: "Email"}).fill('pwtest@test.com') 
    // await page.getByRole('textbox', {name: 'Password'}).fill('Welcome1')
    // await page.getByRole('button').click()
    // await page.waitForResponse('https://api.realworld.io/api/tags') // 确认用户已经login

    // await page.context().storageState({path: authFile}) 

})