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
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { FaHome } from "react-icons/fa";
import { changePassword } from "../../services/index.js";

export default function ChangePassword() {
  const [show, setShow] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const handleClick = () => setShow(!show);
  const handleConfirm = async () => {
    try {
      const obj = {
        password: password,
        newPassword: newPassword,
      };
      await changePassword(obj);
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  return (
    <Flex flexDirection={"column"}>
      <Flex align="flex-end" justify="flex-end" m={5}>
        <Link href="/" passHref>
          <Button
            backgroundColor={"transparent"}
            _hover={{ backgroundColor: "transparent" }}
          >
            <FaHome size={30} />
          </Button>
        </Link>
      </Flex>

      <Flex alignItems={"center"} justifyContent={"center"} height={"80vh"}>
        <Box
          backgroundColor={"#F2B7C5"}
          width={"30%"}
          height={"70%"}
          borderRadius={"25px"}
        >
          <Flex
            overflowY={"auto"}
            flexDirection={"column"}
            align="center"
            height="100%"
          >
            <Image
              src="/img/logo.png"
              pt={"15%"}
              maxWidth={"50%"}
              alt="Bons Fluídos"
              pb={"10%"}
              justifySelf={"center"}
            ></Image>

            <Box width={"100%"}>
              <Flex
                flexDirection={"column"}
                align="center"
                justify="space-between"
              >
                <InputGroup width={"70%"}>
                  <Input
                    mb={3}
                    placeholder="Senha atual"
                    backgroundColor={"#fff"}
                    _hover={{ borderColor: "#E11F4C", borderWidth: 1.5 }}
                    type={show ? "text" : "password"}
                    _focus={{
                      borderColor: "#E11F4C",
                      boxShadow: `0 0 0 1px #E11F4C`,
                    }}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <InputGroup width={"70%"}>
                  <Input
                    mb={3}
                    placeholder="Nova senha"
                    backgroundColor={"#fff"}
                    _hover={{ borderColor: "#E11F4C", borderWidth: 1.5 }}
                    type={show ? "text" : "password"}
                    _focus={{
                      borderColor: "#E11F4C",
                      boxShadow: `0 0 0 1px #E11F4C`,
                    }}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <Button
                  mt={"5%"}
                  backgroundColor={"#E11F4C"}
                  color={"#FFF"}
                  fontWeight={600}
                  fontSize={["md", "lg"]}
                  size={["md", "lg"]}
                  _hover={{ backgroundColor: "#CC1C45" }}
                  onClick={handleConfirm}
                >
                  Entrar
                </Button>
              </Flex>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}
