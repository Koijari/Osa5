
const loginWith = async (page, username, password)  => {
    await page.getByTestId('käyttäjä').fill(username)
    await page.getByTestId('salasana').fill(password)
    await page.getByRole('button', { name: 'kirjaudu' }).click()
  }
  
  export { loginWith }