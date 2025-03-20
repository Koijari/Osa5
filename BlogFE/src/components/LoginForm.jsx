
import PropTypes from 'prop-types'

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  return (
    <div>
      <h2>Kirjaudu sisään</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Käyttäjä
          <input
            data-testid='käyttäjä'
            type='text'
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          Salasana
          <input
            data-testid='salasana'
            type='password'
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type='submit' style={loginBtn}> kirjaudu </button>
      </form>
    </div>
  )}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

const loginBtn = {
  color: 'green',
  backgroundColor: 'yellow',
  borderRadius: 10,
  borderColor: 'green',
}

export default LoginForm