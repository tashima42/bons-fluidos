"use client";
import {
  Flex,
  Box,
  Text,
  Button,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  useToast
} from "@chakra-ui/react";
import React from "react";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { signUp, confirmedVolunteers } from "../../services/index.js";

export default function SignUp() {
  const [show, setShow] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState("");
  const [username, setUsername] = React.useState("");
  const toast = useToast();

  const handleClick = () => setShow(!show);

  const handleSignUp = async () => {
    if (!email || !username || !role || !password) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha todos os campos antes de enviar o formulário.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const volunteers = await confirmedVolunteers();
      

      const emailExists = volunteers.some(volunteer => volunteer.email === email);
      
      if (emailExists) {
        toast({
          title: 'Erro',
          description: 'E-mail já cadastrado.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const response = await signUp(email, username, role, password);

      if (response.success === true) {
        toast({
          title: 'Conta criada',
          description: "Envie os dados para o usuário!",
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        setTimeout(() => {
          window.location.href = "/";
        }, 5000);
      } else {
        toast({
          title: 'Erro',
          description: 'Não foi possível criar a conta. Verifique os dados e tente novamente.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }

    } catch (error) {
      console.error("Erro durante o sign-up:", error);
      toast({
        title: 'Não foi possível criar a conta.',
        description: error.message || 'Erro desconhecido.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex flexDirection="column">
      <Flex align="flex-end" justify="flex-end" m={5}>
        <Link href="/" passHref>
          <Button
            backgroundColor="transparent"
            _hover={{ backgroundColor: "transparent" }}
          >
            <FaHome size={30} />
          </Button>
        </Link>
      </Flex>

      <Flex alignItems="center" justifyContent="center" height="80vh">
        <Box
          backgroundColor="#F2B7C5"
          width="30%"
          height="90%"
          borderRadius="25px"
        >
          <Flex
            overflowY="auto"
            flexDirection="column"
            align="center"
            height="100%"
          >
            <Image
              src="/img/logo.png"
              pt="15%"
              maxWidth="50%"
              alt="Bons Fluídos"
              pb="10%"
            />

            <Box width="100%">
              <Flex
                flexDirection="column"
                align="center"
                justify="space-between"
              >
                <Input
                  mb={3}
                  placeholder="Nome"
                  onChange={(e) => setUsername(e.target.value)}
                  backgroundColor="#fff"
                  _hover={{ borderColor: "#E11F4C", borderWidth: 1.5 }}
                  width="70%"
                  _focus={{
                    borderColor: "#E11F4C",
                    boxShadow: `0 0 0 1px #E11F4C`,
                  }}
                />
                <Input
                  mb={3}
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  backgroundColor="#fff"
                  _hover={{ borderColor: "#E11F4C", borderWidth: 1.5 }}
                  width="70%"
                  _focus={{
                    borderColor: "#E11F4C",
                    boxShadow: `0 0 0 1px #E11F4C`,
                  }}
                />
                <Select
                  backgroundColor={"white"}
                  mb={3}
                  placeholder="Selecionar tipo"
                  width="70%"
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="volunteer">Voluntário</option>
                  <option value="speaker">Palestrante</option>
                  <option value="admin">Administrador</option>
                </Select>

                <InputGroup width="70%">
                  <Input
                    mb={3}
                    placeholder="Senha"
                    backgroundColor="#fff"
                    onChange={(e) => setPassword(e.target.value)}
                    _hover={{ borderColor: "#E11F4C", borderWidth: 1.5 }}
                    type={show ? "text" : "password"}
                    _focus={{
                      borderColor: "#E11F4C",
                      boxShadow: `0 0 0 1px #E11F4C`,
                    }}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>

                <Button
                  mt="5%"
                  backgroundColor="#E11F4C"
                  color="#FFF"
                  fontWeight={600}
                  fontSize={["md", "lg"]}
                  size={["md", "lg"]}
                  _hover={{ backgroundColor: "#CC1C45" }}
                  onClick={handleSignUp}
                >
                  Criar Conta
                </Button>
                <Text mt="5%" fontWeight={600} textAlign="center" width="70%">
                  Não esqueça de{" "}
                  <span style={{ color: "#D92353", fontWeight: "bold" }}>
                    fornecer os dados
                  </span>{" "}
                  cadastrados para o novo usuário!
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}
