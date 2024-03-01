import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();

    const auth = getAuth();

    try {
      // Criar usuário com e-mail e senha
      await createUserWithEmailAndPassword(auth, email, password);

      // Limpar campos do formulário após o sucesso
      setEmail('');
      setPassword('');

      console.log('Usuário cadastrado com sucesso!');
      // O usuário não é automaticamente logado aqui
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error.message);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <br />
      <button type="submit">Cadastrar</button>
    </form>
  );
};

export default SignUpForm;
