"use client";
import Sidebar from "@/components/sidebar";
import { Flex, Text, Button } from "@chakra-ui/react";
import { FaUserAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Table,
  Menu,
  MenuButton,
  MenuList,
  MenuItem, 
  Thead,
  Tbody,
  Tr,
  Td,
  Box,
  Th,
  TableContainer,
} from "@chakra-ui/react";
import { formsVolunteers, myInfo, signOut  } from "../../services/index.js";
import { ChevronDownIcon } from "@chakra-ui/icons"; 


export default function ResultadosInscricao() {
  const [isOpen, setIsOpen] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const [user, setUser] = useState({});
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const user = await myInfo();
        if(user)
          setIsLogged(true);
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

  const handleOpenModal = (user) => {
    setUser(user)
    setIsOpen(true);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const volunteersArray = await formsVolunteers();
        setVolunteers(volunteersArray);
      } catch {
        setVolunteers([]);
      }
    };
    fetchVolunteers();
  }, []); 
  
  const formatDateTable = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <Flex flexDirection={"row"}>
      <Sidebar selectedPage={3} />
      <Flex flexDirection={"column"} width={"100%"}>
      <Flex align="flex-end" justify="flex-end" m={5}>
        {isLogged == true ?
        (
          <Menu>
  <MenuButton as={Button} backgroundColor={"transparent"} rightIcon={<ChevronDownIcon />}>
  <FaUserAlt size={30} />
  </MenuButton>
  <MenuList>
    <MenuItem onClick={() =>  window.location.href = "/change-password"}>Trocar senha</MenuItem>
    <MenuItem onClick={() => handleSignOut()}>Sair</MenuItem>
  </MenuList>
</Menu>
        ): (
          <Link href="/signin" passHref>
            <Button backgroundColor={"transparent"}>
  <FaUserAlt size={30} />
            </Button>
          </Link>
        )}

        </Flex>

        <Flex
          textAlign={"center"}
          flexDirection={"column"}
          fontWeight={500}
          width={"100%"}
          height={"70%"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Text mb={4} fontSize={"25px"}>
            Resultados do formulário de{" "}
            <span style={{ color: "#D92353", fontWeight: "bold" }}>
              inscrição
            </span>
          </Text>
          <Flex
            flexDirection={"column"}
            justifyContent={"center"}
            width={"70%"}
          >
            <TableContainer>
            <Table variant="simple">
  <Thead backgroundColor={"#D92353"}>
    <Tr>
      <Th color={"white"}>nome</Th>
      <Th color={"white"}>telefone</Th>
      <Th color={"white"}>email</Th>
      <Th color={"white"}>tipo</Th>
      <Th color={"white"}>título</Th>
      <Th color={"white"}>data</Th>
    </Tr>
  </Thead>
  <Tbody overflow={"auto"}>
  {volunteers.map((volunteer, index) => (
  <Tr
    key={volunteer.id}
    fontFamily="Arial"
    color="black"
    fontWeight="light"
    bg={index % 2 === 0 ? '#FFE8EF' : 'white'} onClick={() => handleOpenModal(volunteer)}
    _hover={{ cursor: 'pointer' }}
                      
  >
    <Td>{volunteer.name}</Td>
    <Td>{volunteer.phone}</Td>
    <Td>{volunteer.email}</Td>
    <Td>{volunteer.type}</Td>
    <Td>{volunteer.eventName}</Td>
    <Td>{volunteer.eventDate ? formatDateTable(volunteer.eventDate) : ""}</Td>
  </Tr>
))}

  </Tbody>
</Table>

</TableContainer>
            </Flex>
         </Flex>
      </Flex>
      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent width={"70%"} backgroundColor={"#FFE8EF"}>
          <ModalHeader textAlign={"center"} color={"#E11F4C"}>
            INFORMAÇÕES COMPLETAS
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box width={"100%"}>
              <Flex flexDirection={"column"} justifyContent={"center"}>
                <Flex
                  flexDirection={"column"}
                  overflow={"auto"}
                  mb={5}
                  height={"auto"}
                >
                      <Box
                        backgroundColor={"white"}
                        borderRadius={15}
                        padding={15}
                        margin={"2%"}
                      >
                        <Text>
                          <b>Nome Completo:</b> {user.name ? user.name : ""}
                        </Text>
                        <Text>
                          <b>Telefone:</b> {user.phone ? user.phone : ""}
                        </Text>
                        <Text>
                          <b>Email:</b> {user.email ? user.email : ""}
                        </Text>
                        <Text>
                          <b>Tipo:</b> {user.type ? user.type : ""}
                        </Text>
                        <Text>
                          <b>Título da Palestra:</b> {user.eventName ? user.eventName : ""}
                        </Text>
                        <Text>
                          <b>Data desejada:</b>  {user.eventDate ? formatDateTable(user.eventDate) : ""}
                        </Text>
                      </Box>
                </Flex>
              </Flex>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
