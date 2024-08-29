"use client";
import Sidebar from "@/components/sidebar";
import { Flex, Text, Button } from "@chakra-ui/react";
import { FaUserAlt, FaCheckCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Input,
  ModalCloseButton,
  Select,
} from "@chakra-ui/react";
import { createVolunteer } from "../../services/index.js";

export default function Formulario() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("vol");
  const [minDate, setMinDate] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventName, setEventName] = useState("");

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (obj) => {
    try {
      await createVolunteer(obj);
      handleOpenModal;
    } catch (error) {
      console.error("Error creating volunteer:", error);
    }
  };

  useEffect(() => {
    const now = new Date();
    now.setDate(now.getDate() + 14);
    const minDateString = now.toISOString().slice(0, 16);
    setMinDate(minDateString);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(false);
        window.location.href = "/";
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString();
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
            Formulário de{" "}
            <span style={{ color: "#D92353", fontWeight: "bold" }}>
              inscrição
            </span>
          </Text>
          <Flex
            flexDirection={"column"}
            justifyContent={"center"}
            width={"40%"}
          >
            <Text mb="8px" textAlign={"left"} pt={"3%"}>
              Nome completo*
            </Text>
            <Input
              mb={3}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nome completo"
              backgroundColor={"#fff"}
              _hover={{ borderColor: "#E11F4C", borderWidth: 1.5 }}
              width={"100%"}
              _focus={{
                borderColor: "#E11F4C",
                boxShadow: `0 0 0 1px #E11F4C`,
              }}
            />

            <Text mb="8px" textAlign={"left"}>
              Telefone*
            </Text>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              mb={3}
              placeholder="Telefone"
              backgroundColor={"#fff"}
              type="number"
              _hover={{ borderColor: "#E11F4C", borderWidth: 1.5 }}
              width={"100%"}
              _focus={{
                borderColor: "#E11F4C",
                boxShadow: `0 0 0 1px #E11F4C`,
              }}
            />

            <Text mb="8px" textAlign={"left"}>
              E-mail*
            </Text>
            <Input
              mb={3}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              backgroundColor={"#fff"}
              _hover={{ borderColor: "#E11F4C", borderWidth: 1.5 }}
              width={"100%"}
              _focus={{
                borderColor: "#E11F4C",
                boxShadow: `0 0 0 1px #E11F4C`,
              }}
            />
            <Text mb="8px" textAlign={"left"}>
              Você quer se inscrever para ser um:
            </Text>
            <Select mb={3} onChange={handleSelectChange} value={selectedOption}>
              <option value="vol">Voluntário</option>
              <option value="pal">Palestrante</option>
            </Select>

            {selectedOption === "vol" ? (
              <>
                <Button
                  backgroundColor={"#E11F4C"}
                  color={"#FFF"}
                  fontWeight={600}
                  fontSize={["md", "lg"]}
                  size={["md", "lg"]}
                  _hover={{ backgroundColor: "#CC1C45" }}
                  onClick={() => {
                    const obj = {
                      name: username,
                      email: email,
                      phone: phone,
                      type: "volunteer",
                    };
                    handleSubmit(obj);
                  }}
                >
                  Enviar inscrição
                </Button>
              </>
            ) : (
              <>
                <Text mb="8px" textAlign={"left"}>
                  Título da Palestra*
                </Text>
                <Input
                  mb={3}
                  placeholder="Título da Palestra"
                  backgroundColor={"#fff"}
                  _hover={{ borderColor: "#E11F4C", borderWidth: 1.5 }}
                  width={"100%"}
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  _focus={{
                    borderColor: "#E11F4C",
                    boxShadow: `0 0 0 1px #E11F4C`,
                  }}
                />
                <Text mb="8px" textAlign={"left"}>
                  Data desejada*
                </Text>
                <Input
                  mb={3}
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  placeholder="Selecione a data e o horário"
                  size="md"
                  type="datetime-local"
                  min={minDate}
                />
                <Button
                  backgroundColor={"#E11F4C"}
                  color={"#FFF"}
                  fontWeight={600}
                  fontSize={["md", "lg"]}
                  size={["md", "lg"]}
                  _hover={{ backgroundColor: "#CC1C45" }}
                  onClick={() => {
                    const obj = {
                      name: username,
                      email: email,
                      phone: phone,
                      type: "speaker",
                      eventName: eventName,
                      eventDate: formatDate(eventDate),
                    };
                    handleSubmit(obj);
                  }}
                >
                  Enviar inscrição
                </Button>
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        size={["sm"]}
        isCentered
      >
        <ModalOverlay />
        <ModalContent width={"70%"}>
          <ModalHeader>
            <Flex direction={"row"} alignItems={"center"}>
              <FaCheckCircle color="#00BA01" />{" "}
              <Text ml={3}>Enviado com sucesso.</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Em breve entraremos em contato com você!</Text>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
