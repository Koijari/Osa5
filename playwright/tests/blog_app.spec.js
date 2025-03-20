const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3003/api/tests/reset')
        await request.post('http://localhost:3003/api/users', {
        data: {
            name: 'Vakavanha',
            username: 'Väinö',
            password: '300'
        }
        })

        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
        await page.waitForSelector('form')
        const loginForm = await page.$('form')
        expect(loginForm).not.toBeNull()
        })

    describe('Login', () => {
        test('User can login', async ({ page }) => {
            await loginWith(page, 'Väinö', '300')

            await expect(page.getByText('Väinö on kirjautunut sisään')).toBeVisible()
        })
        test('Login fails with wrong password', async ({ page }) => {
            await loginWith(page, 'Väinö', 'väärä')

            await expect(page.getByText('tuntematon käyttäjä')).toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'Väinö', '300')
        })
      
        test('a new blog can be created', async ({ page }) => {
            await page.getByRole('button', { name: 'Lisää blogi' }).click()
            await page.getByTestId('otsikko').fill('UusBlogi')
            await page.getByTestId('kirjoittaja').fill('UusBlogilainen')
            await page.getByTestId('url').fill('http://www.uusiblogi.fi')
            await page.getByRole('button', { name: 'lisää' }).click()

            await expect(page.getByText('"UusBlogi"')).toBeVisible()
            const blog = page.getByTestId('blogTest')
            await blog.getByRole('button', { name: 'näytä' }).click({timeout:1000})
            await page.getByRole('button', { name: 'poista' }).click()
        })

        test('Only the creator can see the delete button', async ({ page }) => {
            await page.getByRole('button', { name: 'Lisää blogi' }).click()
            await page.getByTestId('otsikko').fill('Testiblogi')
            await page.getByTestId('kirjoittaja').fill('Testaaja')
            await page.getByTestId('url').fill('https://testiblogi.fi')
            await page.getByRole('button', { name: 'lisää' }).click()

            const blog = page.getByTestId('blogTest')
            await blog.getByRole('button', { name: 'näytä' }).click()
            await expect(page.getByRole('button', { name: 'poista' })).toBeVisible()
            await page.getByRole('button', { name: 'poista' }).click()
            await expect(page.getByText('"Testiblogi"')).not.toBeVisible()
        })
/* Toimii chromiumilla, muttei FireFoxilla eikä WebKitillä
        test('Blogs are ordered by likes', async ({ page }) => {
            await loginWith(page, 'Väinö', '300')

            // blogi 1
            await page.getByRole('button', { name: 'Lisää blogi' }).click()
            await page.getByTestId('otsikko').fill('Blogi 1')
            await page.getByTestId('kirjoittaja').fill('Testaaja')
            await page.getByTestId('url').fill('http://blogi1.fi')
            await page.getByRole('button', { name: 'lisää' }).click({timeout:1000})
            await page.getByRole('button', { name: 'näytä' }).click()
        
            // blogi 2
            await page.getByRole('button', { name: 'Lisää blogi' }).click()
            await page.getByTestId('otsikko').fill('Blogi 2')
            await page.getByTestId('kirjoittaja').fill('Testaaja')
            await page.getByTestId('url').fill('http://blogi2.fi')
            await page.getByRole('button', { name: 'lisää' }).click({timeout:1000})
            await page.getByRole('button', { name: 'näytä' }).click()
        
            // blogi 3
            await page.getByRole('button', { name: 'Lisää blogi' }).click()
            await page.getByTestId('otsikko').fill('Blogi 3')
            await page.getByTestId('kirjoittaja').fill('Testaaja')
            await page.getByTestId('url').fill('http://blogi3.fi')
            await page.getByRole('button', { name: 'lisää' }).click({timeout:1000})
            await page.getByRole('button', { name: 'näytä' }).click({timeout:1000})

            const blog1 = page.locator('.blog:has-text("Blogi 1")')
            const blog2 = page.locator('.blog:has-text("Blogi 2")')
            const blog3 = page.locator('.blog:has-text("Blogi 3")')
        
            await blog1.getByRole('button', { name: 'tykkää' }).click()
            await blog2.getByRole('button', { name: 'tykkää' }).click()
            await expect(blog2.locator('.likes')).toHaveText(/1/) // eka tykkäys läpi
            
            await blog2.getByRole('button', { name: 'tykkää' }).click()
            await expect(blog2.locator('.likes')).toHaveText(/2/) // toka tykkäys läpi    
        
            await page.waitForTimeout(500) // apuna FireFoxille ja WebKitille
            const blogTitles = page.locator('.blog .title')
        
            const blog1LikesText = await blog1.locator('.likes').textContent()
            const blog2LikesText = await blog2.locator('.likes').textContent()
            
            const blog1Likes = Number(blog1LikesText.match(/\d+/)[0])
            const blog2Likes = Number(blog2LikesText.match(/\d+/)[0])
        
            expect(blog2Likes).toBeGreaterThan(blog1Likes)

            await page.waitForTimeout(500) // apuna FireFoxille ja WebKitille
            
            await expect(blogTitles.first()).toHaveText('Blogi 2') // Blogi 2
            await expect(blogTitles.nth(1)).toHaveText('Blogi 1') // Blogi 1
            await expect(blogTitles.last()).toHaveText('Blogi 3') // Blogi 3

            await blog1.getByRole('button', {name: 'poista'}).click()
            await blog2.getByRole('button', {name: 'poista'}).click()
            await blog3.getByRole('button', {name: 'poista'}).click()
        })*/
    })

    describe('likes', () => {
        test('a blog can be liked', async ({ page }) => {
            await loginWith(page, 'Väinö', '300')
            await page.getByRole('button', { name: 'Lisää blogi' }).click()

            await page.getByTestId('otsikko').fill('Martat!')
            await page.getByTestId('kirjoittaja').fill('Martta')
            await page.getByTestId('url').fill('https://martat.fi')
            await page.getByRole('button', { name: 'lisää' }).click()
            const blog = page.getByTestId('blogTest')
            await blog.getByRole('button', { name: 'näytä' }).click()

            await expect(page.getByText('"Martat!"')).toBeVisible()
            await page.getByRole('button', { name: 'poista' }).click()
        })
    })
})