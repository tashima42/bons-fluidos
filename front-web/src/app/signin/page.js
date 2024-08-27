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
import { signIn, myInfo } from "../../services/index.js"

export default function Login() {
  const [show, setShow] = React.useState(false);
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const handleClick = () => setShow(!show);
  const handleSignin = () => {
    signIn(email, password)
      .then(() => {
        myInfo()
          .then(info => console.log(info))
      })
  }

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
                <Input
                  mb={3}
                  placeholder="E-mail"
                  backgroundColor={"#fff"}
                  _hover={{ borderColor: "#E11F4C", borderWidth: 1.5 }}
                  width={"70%"}
                  _focus={{
                    borderColor: "#E11F4C",
                    boxShadow: `0 0 0 1px #E11F4C`,
                  }}
                  onChange={e => setEmail(e.target.value)}
                />
                <InputGroup width={"70%"}>
                  <Input
                    mb={3}
                    placeholder="Senha"
                    backgroundColor={"#fff"}
                    _hover={{ borderColor: "#E11F4C", borderWidth: 1.5 }}
                    type={show ? "text" : "password"}
                    _focus={{
                      borderColor: "#E11F4C",
                      boxShadow: `0 0 0 1px #E11F4C`,
                    }}
                    onChange={e => setPassword(e.target.value)}
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
                  onClick={handleSignin}
                >
                  Entrar
                </Button>
                <Text
                  mt={"5%"}
                  fontWeight={600}
                  textAlign={"center"}
                  width={"70%"}
                >
                  Não possui uma conta?{" "}
                  <span style={{ color: "#D92353", fontWeight: "bold" }}>
                    Entre em contato
                  </span>
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}
