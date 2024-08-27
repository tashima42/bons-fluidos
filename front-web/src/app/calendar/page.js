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
  Center,
  ModalCloseButton,
} from "@chakra-ui/react";
import "./style.css";

export default function Calendario() {
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
          direction={"row"}
          justifyContent={"center"}
          alignItems={"center"}
          height={"70vh"}
        >
          <Flex
            textAlign={"center"}
            flexDirection={"column"}
            fontWeight={500}
            width={"100%"}
            height={"100%"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Text mb={4} fontSize={"25px"}>
              Acompanhe nossas próximas palestras!
            </Text>
            <Box
              backgroundColor={"#FBE8ED"}
              borderRadius={"15px"}
              width={"550px"}
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
          <Flex direction={"column"} w={"70%"} m={"5%"} align={"center"}>
            <Text mb={4} fontSize={["md", "lg", "xl"]}>
              Já participou de algum evento da{" "}
              <span style={{ color: "#D92353", fontWeight: "bold" }}>
                Bons Fluídos
              </span>
              ?
            </Text>
            <Text mb={4} fontSize={["md", "lg"]} fontWeight={600}>
              Busque seus certificados!
            </Text>
            <Flex dir="row">
              <Input
                placeholder="Insira seu R.A."
                backgroundColor={"#F2F2F2"}
              />
              <Button
                backgroundColor={"#E11F4C"}
                ml={3}
                color={"#FFF"}
                borderRadius={15}
                fontWeight={600}
                _hover={{ backgroundColor: "#CC1C45" }}
              >
                Buscar
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      <Modal isOpen={isOpen} onClose={handleCloseModal} isCentered size={"sm"}>
        <ModalOverlay />
        <ModalContent width={"70%"} backgroundColor={"#FFFFF"}>
          <ModalHeader textAlign={"center"} color={"#E11F4C"}>
            INFORMAÇÕES
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>

          <ModalFooter></ModalFooter>
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
