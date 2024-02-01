import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import useAuth from "../../hooks/useAuth";
import GlobalStyle from "../../styles/global";
import styled from "styled-components";
import Form from "../../components/Form";
import Grid from "../../components/Grid";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Home = () => {
  const { signout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [onEdit, setOnEdit] = useState(null);

  const getUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8800");
      setUsers(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Container>
      <Title>Home</Title>
      <Form onEdit={onEdit} setOnEdit={setOnEdit} getUsers={getUsers} />
      <Grid setOnEdit={setOnEdit} users={users} setUsers={setUsers} />
      <ToastContainer autoClose={3000} position="bottom-left" />
      <GlobalStyle />
      <Button Text="Sair" onClick={() => [signout(), navigate("/")]} />
    </Container>
  );
};

const Title = styled.h2``;

export default Home;
