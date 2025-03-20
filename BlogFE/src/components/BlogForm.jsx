
import React, { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Lisää uusi blogi</h3>
      <div>
        otsikko
        <input
          data-testid="otsikko"
          type="text"
          value={title}
          name="title"
          onChange={({ target }) => setTitle(target.value)}
          placeholder='otsikko'
        />
      </div>
      <div>
        kirjoittaja
        <input
          data-testid="kirjoittaja"
          type="text"
          value={author}
          name="author"
          onChange={({ target }) => setAuthor(target.value)}
          placeholder='kirjoittaja'
        />
      </div>
      <div>
        url
        <input
          data-testid="url"
          type="text"
          value={url}
          name="url"
          onChange={({ target }) => setUrl(target.value)}
          placeholder='nettiosoite'
        />
      </div>
      <button type="submit" style={ addBtn }>lisää</button>
    </form>
  )
}

const addBtn = {
  color: 'lightgreen',
  backgroundColor: 'green',
  borderRadius: 10,
  borderColor: 'lightgreen',
}

export default BlogForm

