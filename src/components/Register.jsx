import { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registering:', formData);
  };

  return (
    <div className='register-container'>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className='register-form'>
        <input 
          type="text" 
          name="username"
          placeholder="Username" 
          value={formData.username} 
          onChange={handleChange} 
          required 
        />
        <br />
        <input 
          type="email" 
          name="email"
          placeholder="Email" 
          value={formData.email} 
          onChange={handleChange} 
          required 
        />
        <br />
        <input 
          type="password" 
          name="password"
          placeholder="Password" 
          value={formData.password} 
          onChange={handleChange} 
          required 
        />
        <br />
        <button type="submit">Register</button>
      </form>
      <p>Have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Register;
