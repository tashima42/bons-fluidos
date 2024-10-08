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
import Link from "next/link";
import { FaUserAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { myInfo, signOut } from "../services/index.js";
import { ChevronDownIcon } from "@chakra-ui/icons";

export default function Home() {
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
    <Flex flexDirection={"row"}>
      <Sidebar selectedPage={0} />
      <Flex
        flexDirection={"column"}
        backgroundImage={"/img/backg.png"}
        maxWidth={"80%"}
      >
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
            color={"#D92353"}
            fontWeight={600}
          >
            Bem-vinda ao nosso site!
          </Text>
          <Text mb={4} fontSize={["xs", "md", "lg", "xl"]}>
            Em um mundo onde a{" "}
            <span style={{ color: "#D92353", fontWeight: "bold" }}>
              pobreza menstrual
            </span>{" "}
            é uma realidade enfrentada por muitas pessoas, estamos aqui para
            oferecer uma voz, recursos e apoio. Reconhecemos que a menstruação
            não é apenas um fenômeno biológico, mas também um problema social
            que afeta a{" "}
            <span style={{ color: "#D92353", fontWeight: "bold" }}>
              dignidade
            </span>{" "}
            e a{" "}
            <span style={{ color: "#D92353", fontWeight: "bold" }}>
              autonomia
            </span>{" "}
            das pessoas que menstruam, especialmente aquelas em{" "}
            <span style={{ color: "#D92353", fontWeight: "bold" }}>
              {" "}
              situação de vulnerabilidade econômica.
            </span>
          </Text>
          <Text mb={4} fontSize={["xs", "md", "lg", "xl"]}>
            Junte-se a nós nesta missão de{" "}
            <span style={{ color: "#D92353", fontWeight: "bold" }}>
              combater a pobreza menstrual e garantir que todas as pessoas
              tenham acesso digno e igualitário a cuidados menstruais
            </span>
            . Juntos, podemos fazer a diferença e promover uma sociedade mais
            justa e inclusiva para todos. Seja bem-vinda à nossa comunidade
            comprometida em{" "}
            <span style={{ color: "#D92353", fontWeight: "bold" }}>
              criar mudanças positivas e duradouras
            </span>
            .
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
}
