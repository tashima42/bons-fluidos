"use client";
import Sidebar from "@/components/sidebar";
import {
  Flex,
  Box,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { FaUserAlt } from "react-icons/fa";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import { myInfo, signOut } from "../../services/index.js";
import { ChevronDownIcon } from "@chakra-ui/icons";

export default function Inscricao() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const user = await myInfo();
        if (user) setIsLogged(true);
      } catch {
        setIsLogged(false);
      }
    };
    fetchInfo();
  }, []);

  const handleSignOut = async (obj) => {
    try {
      await signOut();
      window.location.reload();
    } catch (error) {
      console.error("Error sign out:", error);
    }
  };
  return (
    <Flex flexDirection={"row"} width={"100%"}>
      <Sidebar />
      <Flex flexDirection={"column"} width={"100%"}>
        <Flex align="flex-end" justify="flex-end" m={5}>
          {isLogged == true ? (
            <Menu>
              <MenuButton
                as={Button}
                backgroundColor={"transparent"}
                rightIcon={<ChevronDownIcon />}
              >
                <FaUserAlt size={30} />
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={() => (window.location.href = "/change-password")}
                >
                  Trocar senha
                </MenuItem>
                <MenuItem onClick={() => handleSignOut()}>Sair</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Link href="/signin" passHref>
              <Button backgroundColor={"transparent"}>
                <FaUserAlt size={30} />
              </Button>
            </Link>
          )}
        </Flex>
        <Box textAlign={"center"} padding={"7%"} fontWeight={500}>
          <Text
            mb={"40px"}
            fontSize={"35px"}
            mt={"15px"}
            wordBreak="break-word"
            fontWeight={600}
          >
            Quer ajudar a nossa comunidade e se tornar um{" "}
            <span style={{ color: "#D92353", fontWeight: "bold" }}>
              Palestrante
            </span>{" "}
            ou{" "}
            <span style={{ color: "#D92353", fontWeight: "bold" }}>
              Voluntário
            </span>
            ?
          </Text>
          <Text mb={4} fontSize={["xs", "md", "lg", "xl"]} mt={"5%"}>
            Se a sua resposta for{" "}
            <span style={{ color: "#D92353", fontWeight: "bold" }}>SIM</span>,
            precisaremos coletar algumas informações sobre você.
          </Text>
          <Link href="/formulario" passHref>
            <Button
              backgroundColor={"#E11F4C"}
              color={"#FFF"}
              fontWeight={600}
              fontSize={["md", "lg"]}
              size={["md", "lg"]}
              _hover={{ backgroundColor: "#CC1C45" }}
              mt={"5%"}
            >
              <Flex direction={"row"}>
                <Text mr={3}>Continuar</Text>
                <FaArrowRight />
              </Flex>
            </Button>
          </Link>
          <Text
            mb={4}
            fontSize={["xs", "sm", "md", "lg"]}
            mt={"5%"}
            fontWeight={"light"}
          >
            Ao clicar no botão, você será direcionado para o{" "}
            <span style={{ color: "#D92353", fontWeight: "bold" }}>
              formulário de inscrição.
            </span>
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
}
