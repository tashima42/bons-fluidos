"use client";
import Sidebar from "@/components/sidebar";
import { Flex, Box, Text, Button } from "@chakra-ui/react";
import { FaUserAlt, FaCheckCircle } from "react-icons/fa";
import { useState } from "react";
import Link from "next/link";
import Calendar from "react-calendar";
import { FaPlus } from "react-icons/fa6";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Input,
  InputGroup,
  ModalCloseButton,
} from "@chakra-ui/react";
import "./style.css";

export default function CriarEvento() {
  const [value, onChange] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsOpen(true);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
  };
  const handleCloseConfirmModal = () => {
    setIsOpen(false);
    setIsConfirmed(false);
  };
  const handleOpenConfirmModal = () => {
    setIsConfirmed(true);
  };

  return (
    <Flex flexDirection={"row"}>
      <Sidebar selectedPage={2} />
      <Flex flexDirection={"column"} width={"100%"}>
        <Flex align="flex-end" justify="flex-end" m={5}>
          <Link href="/signin" passHref>
            <Button
              backgroundColor={"transparent"}
              _hover={{ backgroundColor: "transparent" }}
            >
              <FaUserAlt size={30} />
            </Button>
          </Link>
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
            Selecione uma data para criar o{" "}
            <span style={{ color: "#D92353", fontWeight: "bold" }}>
              evento!
            </span>
          </Text>
          <Box
            backgroundColor={"#FBE8ED"}
            borderRadius={"15px"}
            width={"608px"}
            p={"30px"}
          >
            <Calendar
              onChange={onChange}
              value={value}
              locale={"pt-BR"}
              onClickDay={handleDateClick}
            />
          </Box>
        </Flex>
      </Flex>

      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent width={"70%"} backgroundColor={"#FFE8EF"}>
          <ModalHeader textAlign={"center"} color={"#E11F4C"}>
            Cadastrar Palestras
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box width={"100%"}>
              <Flex flexDirection={"column"} justifyContent={"center"}>
                <Text textAlign={"center"}>
                  Você selecionou a data:{" "}
                  <b>{selectedDate?.toLocaleDateString("pt-BR")}</b>
                </Text>
                <Text mb="8px" textAlign={"left"} pt={"3%"}>
                  Título*
                </Text>
                <Input
                  mb={3}
                  placeholder="Título"
                  backgroundColor={"#fff"}
                  _hover={{ borderColor: "#E11F4C", borderWidth: 1.5 }}
                  width={"100%"}
                  _focus={{
                    borderColor: "#E11F4C",
                    boxShadow: `0 0 0 1px #E11F4C`,
                  }}
                />

                <Text mb="8px" textAlign={"left"}>
                  Palestrante*
                </Text>
                <Input
                  mb={3}
                  placeholder="Palestrante"
                  backgroundColor={"#fff"}
                  _hover={{ borderColor: "#E11F4C", borderWidth: 1.5 }}
                  width={"100%"}
                  _focus={{
                    borderColor: "#E11F4C",
                    boxShadow: `0 0 0 1px #E11F4C`,
                  }}
                />

                <Text mb="8px" textAlign={"left"}>
                  Descrição*
                </Text>
                <Input
                  mb={3}
                  placeholder="Descrição"
                  backgroundColor={"#fff"}
                  _hover={{ borderColor: "#E11F4C", borderWidth: 1.5 }}
                  width={"100%"}
                  _focus={{
                    borderColor: "#E11F4C",
                    boxShadow: `0 0 0 1px #E11F4C`,
                  }}
                />
                <Flex direction={"row"} gap={2}>
                  <Flex direction={"column"}>
                    <Text mb="8px" textAlign={"left"}>
                      Horário*
                    </Text>
                    <Input
                      mb={3}
                      placeholder="Horário"
                      backgroundColor={"#fff"}
                      _hover={{ borderColor: "#E11F4C", borderWidth: 1.5 }}
                      _focus={{
                        borderColor: "#E11F4C",
                        boxShadow: `0 0 0 1px #E11F4C`,
                      }}
                    />
                  </Flex>
                  <Flex direction={"column"}>
                    <Text mb="8px" textAlign={"left"}>
                      Duração*
                    </Text>
                    <Input
                      mb={3}
                      placeholder="Duração"
                      backgroundColor={"#fff"}
                      _hover={{ borderColor: "#E11F4C", borderWidth: 1.5 }}
                      _focus={{
                        borderColor: "#E11F4C",
                        boxShadow: `0 0 0 1px #E11F4C`,
                      }}
                    />
                  </Flex>
                </Flex>
                <Text mb="8px" textAlign={"left"}>
                  Local*
                </Text>
                <Input
                  mb={3}
                  placeholder="Local"
                  backgroundColor={"#fff"}
                  _hover={{ borderColor: "#E11F4C", borderWidth: 1.5 }}
                  width={"100%"}
                  _focus={{
                    borderColor: "#E11F4C",
                    boxShadow: `0 0 0 1px #E11F4C`,
                  }}
                />
                <Text mb="8px" textAlign={"left"}>
                  Ajudantes
                </Text>

                <Flex direction={"row"} gap={2}>
                  <Input
                    mb={3}
                    placeholder="Nome do ajudante"
                    backgroundColor={"#fff"}
                    _hover={{ borderColor: "#E11F4C", borderWidth: 1.5 }}
                    width={"100%"}
                    _focus={{
                      borderColor: "#E11F4C",
                      boxShadow: `0 0 0 1px #E11F4C`,
                    }}
                  />

                  <Button
                    backgroundColor={"#E11F4C"}
                    color={"#FFF"}
                    fontWeight={600}
                    fontSize={["md", "lg"]}
                    _hover={{ backgroundColor: "#CC1C45" }}
                  >
                    <FaPlus />
                  </Button>
                </Flex>
                <Flex
                  direction={"row"}
                  gap={2}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  m={2}
                >
                  <Text textAlign={"left"}>Ajudante n1</Text>
                  <Button
                    backgroundColor={"transparent"}
                    fontSize={"14px"}
                    padding={5}
                    margin={0}
                    _hover={{ borderColor: "#FFCBDB" }}
                  >
                    Remover
                  </Button>
                </Flex>
              </Flex>
            </Box>
          </ModalBody>

          <ModalFooter justifyContent={"center"}>
            <Button
              backgroundColor={"#E11F4C"}
              color={"#FFF"}
              fontWeight={600}
              fontSize={["md", "lg"]}
              size={["md", "lg"]}
              _hover={{ backgroundColor: "#CC1C45" }}
              onClick={handleOpenConfirmModal}
            >
              Criar Evento
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isConfirmed}
        onClose={handleCloseConfirmModal}
        size={["sm"]}
        isCentered
      >
        <ModalOverlay />
        <ModalContent width={"70%"}>
          <ModalHeader>
            <Flex direction={"row"} alignItems={"center"}>
              <FaCheckCircle color="#00BA01" />{" "}
              <Text ml={3}>Evento criado com sucesso.</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
