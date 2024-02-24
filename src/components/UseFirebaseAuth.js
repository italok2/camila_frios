import { useState, useEffect } from 'react';
import { auth } from '../firebase';

// Certifique-se de inicializar o Firebase em seu aplicativo antes de usar este hook

const UseFirebaseAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      console.log("usuário:" + user.email)
    } catch (error) {
      console.error('Erro ao fazer login:', error.message);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error.message);
    }
  };

  // Outras funções úteis podem ser adicionadas conforme necessário

  return { user, loading, signIn, signOut };
};

export default UseFirebaseAuth;
