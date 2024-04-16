import { Page } from "@playwright/test";

export class NavigationPage {

    readonly page: Page

    constructor(page: Page) {   // constructor 需要传入一个object(page)
        this.page = page        // 左右两边的page 是不同的，左边的this.page是local的，即上面readonly的page
    }                           // 右边的page 是上面constructor 的参数传入的page 

    async formLayoutsPage() {
        await this.page.getByText('Forms').click()         // 小心这里需要加 this.，操作的是local的page
        await this.page.getByText('Form Layouts').click()  // 如果没有this则会报错说找不到 name ‘page’ 
    }

    async datepickerPage() {
        await this.selectGroupItem('Forms')
        //await this.page.getByText('Forms').click()
        //await this.page.waitForTimeout(1000)
        await this.page.getByText('Datepicker').click()
    }

    async smartTablePage() {
        await this.page.getByText( 'Tables & Data').click() 
        await this.page.getByText('Smart Table').click()
    }

    async toastrPage(){
        await this.page.getByText('Modal & Overlays').click() 
        await this.page.getByText('Toastr').click()
    }

    async tooltipPage() {
        await this.page.getByText('Modal & Overlays').click() 
        await this.page.getByText('Tooltip').click()
    }
        
    private async selectGroupItem(groupItemTitle: string) {   //避免互相冲突，增加判断来进行smart expand
        const groupMenuItem = this.page.getByTitle(groupItemTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if(expandedState=='false') 
            await groupMenuItem.click()
    }



}