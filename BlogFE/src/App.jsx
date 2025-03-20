
import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)

    } catch (exception) {
      setErrorMessage('tuntematon käyttäjä')
      setTimeout(() => setErrorMessage(null), 2000)
    }
    setUsername('')
    setPassword('')
  }

  const logout = () => {
    window.localStorage.clear()
    window.location.reload()
  }

  const createBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      newBlog.user = user
      setBlogs(blogs.concat(newBlog))
      blogFormRef.current.toggleVisibility()
      setSuccessMessage(`Uusi blogi "${newBlog.title}" kirjoittajalta ${newBlog.author} lisätty`)
      setTimeout(() => setSuccessMessage(null), 2000)
    } catch (exception) {
      setErrorMessage('virhe blogia luotaessa')
      setTimeout(() => setErrorMessage(null), 2000)
    }
  }

  const deleteBlog = async (id) => {
    const blogToDelete = blogs.find(b => b.id === id)
    if (blogToDelete) {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter(b => b.id !== id))
        setSuccessMessage(`Blogi "${blogToDelete.title}" poistettu`)
        setTimeout(() => setSuccessMessage(null), 2000)
      } catch (error) {
        setErrorMessage('Ei oikeutta blogin poistoon.')
        setTimeout(() => setErrorMessage(null), 2000)
      }
    }
  }

  const handleLike = async (blog) => {
    try {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1
      }
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setBlogs(blogs.map(b => b.id === blog.id ? returnedBlog : b))
    } catch (error) {
      setErrorMessage('Tykkäyksen päivittäminen epäonnistui')
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)
    }
  }

  const loginForm = () => {
    return (
      <div>
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </div>
    )
  }

  const sortedBlogs = blogs.slice().sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <div style={message}>{errorMessage} {successMessage}</div>
      {!user && loginForm()}
      {user &&
        <div>
          <h2>blogit</h2>
          <span>{user.username} on kirjautunut sisään </span>
          <button onClick={logout} style={logoutBtn}>Kirjaudu ulos</button>
          <br /><br />
          {sortedBlogs.map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              handleLike={handleLike}
              handleDelete={deleteBlog}
            />
          )}
          <Togglable buttonLabel="Lisää blogi" ref={blogFormRef}>
            <BlogForm createBlog={createBlog} />
          </Togglable>
        </div>
      }
    </div>
  )
}

const logoutBtn = {
  color: 'red',
  backgroundColor: 'yellow',
  borderRadius: 10,
  borderColor: 'red',
}
const loginBtn = {
  color: 'green',
  backgroundColor: 'yellow',
  borderRadius: 10,
  borderColor: 'green',
}
const message = {
  fontSize: 30,
  backgroundColor: 'lightgray',
}

export default App
