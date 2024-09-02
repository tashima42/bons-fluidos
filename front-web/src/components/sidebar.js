"use client";
import { Flex, Box, Button, Image } from "@chakra-ui/react";
import { FaInstagram } from "react-icons/fa";
import Link from "next/link";
import { myInfo } from "../services/index.js";
import { useEffect, useState } from "react";

export default function Sidebar({ selectedPage }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVolunteer, setIsVolunteer] = useState(false);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const user = await myInfo();
        setIsAdmin(user.role === "admin");
        setIsVolunteer(user.role === "volunteer" ? true : false);
      } catch {
        setIsAdmin(false);
        setIsVolunteer(false);
      }
    };
    fetchInfo();
  }, []);

  return (
    <Box
      maxWidth="345.59px"
      height="100vh"
      backgroundColor="#F2B7C5"
      width="30%"
    >
      <Flex
        flexDirection="column"
        justify="space-between"
        align="center"
        height="100%"
      >
        <Image src="/img/logo.png" maxWidth="80%" alt="Bons Fluídos" pt={6} />
        <Flex flexDirection="column" gap={3}>
          {[
            { href: "/", label: "HOME", index: 0 },
            { href: "/calendar", label: "CALENDÁRIO DE EVENTOS", index: 1 },
            { href: "/inscricao", label: "INSCREVA-SE", index: 2 },
            {
              href: "/resultados-inscricao",
              label: "RESULTADOS DA INSCRIÇÃO",
              index: 3,
              adminOnly: true,
            },
            {
              href: "/signup",
              label: "CRIAR UMA CONTA",
              index: 4,
              adminOnly: true,
            },
            {
              href: "/criar-evento",
              label: "GERENCIAR EVENTOS",
              index: 5,
              adminAndVolunteer: true,
            },
          ].map(({ href, label, index, adminOnly, adminAndVolunteer }) => {
            if (adminOnly && !isAdmin) return null;
            if (adminAndVolunteer && !isVolunteer) {
              if (!isAdmin) return null;
            }
            return (
              <Link href={href} passHref key={index}>
                <Button
                  fontSize={["xs", "md", "xl"]}
                  color={selectedPage === index ? "#D92353" : "black"}
                  backgroundColor="transparent"
                  _hover={{ backgroundColor: "transparent", color: "#D92353" }}
                >
                  {label}
                </Button>
              </Link>
            );
          })}
        </Flex>
        <Image src="/img/sidebar.png" alt="Bons Fluídos" />
        <Button
          pb={6}
          color="black"
          backgroundColor="transparent"
          fontSize={["xs", "xs", "md", "xl"]}
          _hover={{ backgroundColor: "transparent", cursor: "default" }}
          leftIcon={<FaInstagram size={25} />}
        >
          bonsfluidosutfpr
        </Button>
      </Flex>
    </Box>
  );
}
