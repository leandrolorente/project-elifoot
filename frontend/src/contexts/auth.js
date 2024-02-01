import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    const userToken = localStorage.getItem("user_token");

    if (userToken) {
      loadUser(userToken);
    }
  }, []);

  const loadUser = async (token) => {
    try {
      const { data } = await axios.get(`http://localhost:8800/byToken/${token}`);
      
      if (data) {
        setUser(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const signin = async (email, password) => {
    try {
      const { data } = await axios.get(`http://localhost:8800/byEmail/${email}`, { params: { password } });
      
      if (data.length > 0) {
        // Simplificado para fins educativos - considere usar bibliotecas como bcrypt no servidor
        if (password === data[0].password) {
          localStorage.setItem("user_token", email);
          loadUser(email);
        } else {
          return "E-mail ou senha incorretos";
        }
      } else {
        return "Usuário não cadastrado";
      }
    } catch (error) {
      console.error(error);
      return "Erro ao fazer login";
    }
  };

  const signup = async (email, password) => {
    try {
      const { data } = await axios.get(`http://localhost:8800/users?email=${email}`);
      
      if (data.length > 0) {
        return "Já tem uma conta com esse E-mail";
      }

      // Simplificado para fins educativos - considere usar bibliotecas como bcrypt no servidor
      localStorage.setItem("user_token", email);
      loadUser(email);

      await axios.post("http://localhost:8800/users", { email, password });

      return;
    } catch (error) {
      console.error(error);
      return "Erro ao cadastrar usuário";
    }
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem("user_token");
  };

  return (
    <AuthContext.Provider
      value={{ user, signed: !!user, signin, signup, signout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
