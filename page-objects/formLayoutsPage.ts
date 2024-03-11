import { Page } from "@playwright/test";

export class FormLayoutsPage {

    private readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async submitUsingTheGrigdFormWithCredentialsAndSelectOption(email: string, password: string, optionText: string) { 
        const usingTheGridForm = this.page.locator('nb-card', {hasText: "Using the Grid"}) 
        await usingTheGridForm.getByRole('textbox', {name: "Email"}).fill(email) 
        await usingTheGridForm.getByRole('textbox', {name: "Password"}).fill(password) 
        await usingTheGridForm.getByRole('radio', {name: optionText}).check({force: true}) 
        await usingTheGridForm.getByRole('button').click()
    }

    /**     输入 “/**” 系统会自动建立一个参数说明块
     *    -->输入函数代码说明 
     * @param name       - XXXXXXXX     在VS中用鼠标悬浮在调用代码时会浮现出此处的说明，以帮助使用
     * @param email      - XXXXXXXX
     * @param rememberMe - XXXXXXXX
     */
    async sumbitInlineFormWithNameEmailAndCheckbox (name: string, email: string, rememberMe: boolean) {
        const inlineForm = this.page. locator ('nb-card', {hasText: "Inline form"})
        await inlineForm.getByRole('textbox', {name: "Jane Doe"}).fill(name)
        await inlineForm.getByRole('textbox', {name: "Email"}).fill(email)
        if (rememberMe)
            await inlineForm.getByRole('checkbox').check({force: true}) 
        await inlineForm.getByRole('button').click()
    }


}