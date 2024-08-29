"use client";
import Sidebar from "@/components/sidebar";
import { Flex, Box, Text, Button } from "@chakra-ui/react";
import { FaUserAlt, FaCheckCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
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
import { events } from "../../services/index.js";

export default function Calendario() {
  const [value, onChange] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [highlightedDates, setHighlightedDates] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await events();
        if (Array.isArray(response)) {
          const eventDates = response
            ? response.map((event) => new Date(event.startDate))
            : [];
          setHighlightedDates(eventDates);
          setEventsList(response || []);
          setFilteredEvents(response);
        } else {
          setHighlightedDates([]);
          setEventsList([]);
        }
      } catch (err) {
        console.error("Error fetching events:", err.message);
        setHighlightedDates([]);
        setEventsList([]);
      }
    };

    fetchEventDetails();
  }, []);

  function formateHour(datetime) {
    const date = new Date(datetime);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }

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
  const isHighlighted = (date) => {
    return highlightedDates.some(
      (d) =>
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear(),
    );
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
                tileClassName={({ date, view }) => {
                  if (view === "month" && isHighlighted(date)) {
                    return "highlight";
                  }
                  return null;
                }}
                locale={"pt-BR"}
                onClickDay={(date) => {
                  setSelectedDate(date);
                  setIsOpen(true);
                }}
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

      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent width={"70%"} backgroundColor={"#FFE8EF"}>
          <ModalHeader textAlign={"center"} color={"#E11F4C"}>
            Palestras
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box width={"100%"}>
              <Flex flexDirection={"column"} justifyContent={"center"}>
                <Text textAlign={"center"} mb={"3%"}>
                  Você selecionou a data:{" "}
                  <b>{selectedDate?.toLocaleDateString("pt-BR")}</b>
                </Text>
                <Flex
                  flexDirection={"column"}
                  overflow={"auto"}
                  mb={5}
                  height={filteredEvents.length > 0 ? "200px" : "auto"}
                >
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <Box
                        key={event.id}
                        backgroundColor={"white"}
                        borderRadius={15}
                        padding={15}
                        margin={"2%"}
                      >
                        <Text>
                          <b>Título:</b> {event.name}
                        </Text>
                        <Text>
                          <b>Palestrante:</b> {event.speaker.name}
                        </Text>
                        <Text>
                          <b>Descrição:</b> {event.description}
                        </Text>
                        <Text>
                          <b>Horário:</b> {formateHour(event.startDate)} -{" "}
                          {formateHour(event.endDate)}
                        </Text>
                        <Text>
                          <b>Local:</b> {event.location}
                        </Text>
                      </Box>
                    ))
                  ) : (
                    <Text textAlign={"center"} fontWeight={"light"}>
                      Nenhum evento encontrado para esta data.
                    </Text>
                  )}
                </Flex>
              </Flex>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
