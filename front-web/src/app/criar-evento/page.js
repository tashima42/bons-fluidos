"use client";
import Sidebar from "@/components/sidebar";
import { Flex, Box, Text, Button, Input } from "@chakra-ui/react";
import { FaUserAlt, FaCheckCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import Link from "next/link";
import Calendar from "react-calendar";
import { FaUsersGear } from "react-icons/fa6";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Select,
  ModalFooter,
  ModalBody,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  ModalCloseButton,
} from "@chakra-ui/react";
import "./style.css";
import {
  createEvent,
  myInfo,
  events,
  eventVolunteers,
  deleteEvent,
  generalVolunteers,
  addVolunteerToEvent,
} from "../../services/index.js";

export default function CriarEvento() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userDescription, setUserDescription] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [createEventButton, setCreateEventButton] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [value, onChange] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [isVolunteersOpen, setIsVolunteersOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [eventsList, setEventsList] = useState([]);
  const [highlightedDates, setHighlightedDates] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [volunteersList, setVolunteersList] = useState([]);
  const [volunteerId, setVolunteerId] = useState();
  const [eventVolunteersList, setEventVolunteersList] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState();

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const data = await events();
        const eventDates = data.map((event) => new Date(event.startDate));
        setHighlightedDates(eventDates);
        setEventsList(data);
      } catch (err) {
        console.error("Error fetching events:", err.message);
      }
    };

    fetchEventDetails();

    myInfo()
      .then((data) => console.log(data))
      .catch((err) => console.log(err.message));
  }, []);

  const fetchVolunteersList = async (id) => {
    try {
      const data = await eventVolunteers(id);
      const volunteers = data.map((volunteer) => volunteer);
      setEventVolunteersList(volunteers);
    } catch (err) {
      console.error("Error fetching events:", err.message);
    }
  };

  const fetchGeneralVolunteersList = async (id) => {
    try {
      const data = await generalVolunteers();
      const volunteers = data.map((volunteer) => volunteer);
      setVolunteersList(volunteers);
    } catch (err) {
      console.error("Error fetching events:", err.message);
    }
  };

  const handleCreateEvent = async (event) => {
    try {
      await createEvent(event);
      setIsConfirmed(true);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleAddVolunteer = async (eventId, volunteerId) => {
    try {
      await addVolunteerToEvent(eventId, volunteerId);
    } catch (error) {
      console.error("Error adding volunteer:", error);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await deleteEvent(id);
      setEventsList((prevEvents) =>
        prevEvents.filter((event) => event.id !== id),
      );
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  function formateHour(datetime) {
    const date = new Date(datetime);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }

  const isHighlighted = (date) => {
    return highlightedDates.some(
      (d) =>
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear(),
    );
  };

  function onCloseModal() {
    setCreateEventButton(false);
    setIsOpen(false);
  }
  function onCloseVolunteersModal() {
    setIsVolunteersOpen(false);
  }

  useEffect(() => {
    if (selectedDate) {
      const selectedDateStr = selectedDate.toISOString().split("T")[0];
      const newFilteredEvents = eventsList.filter((event) => {
        const eventDateStr = new Date(event.startDate)
          .toISOString()
          .split("T")[0];
        return eventDateStr === selectedDateStr;
      });
      setFilteredEvents(newFilteredEvents);
    } else {
      setFilteredEvents([]);
    }
  }, [eventsList, selectedDate]);

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
            Selecione uma data para criar e/ou editar um{" "}
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
              tileClassName={({ date, view }) => {
                if (view === "month" && isHighlighted(date)) {
                  return "highlight";
                }
                return null;
              }}
              locale={"pt-BR"}
              onClickDay={(date) => {
                setSelectedDate(date);
                console.log(date);
                setIsOpen(true);
              }}
            />
          </Box>
        </Flex>
      </Flex>

      <Modal
        isOpen={isVolunteersOpen}
        onClose={onCloseVolunteersModal}
        size={"lg"}
      >
        <ModalOverlay />
        <ModalContent width={"100%"} backgroundColor={"#FFE8EF"}>
          <ModalHeader textAlign={"center"} color={"#E11F4C"}>
            Participantes/Voluntários
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box width={"100%"}>
              <Flex flexDirection={"column"} justifyContent={"center"}>
                <Text textAlign={"center"} mb={"3%"}>
                  <b>Voluntários/Palestrantes</b>
                </Text>
                <Flex
                  direction={"column"}
                  align={"center"}
                  justifyContent={"space-between"}
                >
                  <Select
                    placeholder="Selecionar"
                    backgroundColor={"white"}
                    value={volunteerId}
                    onChange={(e) => setVolunteerId(e.target.value)}
                  >
                    {volunteersList.map((volunteer) => (
                      <option value={volunteer.id}>{volunteer.name}</option>
                    ))}
                  </Select>
                  <Button
                    mt={3}
                    backgroundColor={"#E11F4C"}
                    color={"#FFF"}
                    fontWeight={600}
                    fontSize={["sm", "md"]}
                    size={["sm", "md"]}
                    _hover={{ backgroundColor: "#CC1C45" }}
                    onClick={() => {
                      handleAddVolunteer(selectedEventId, volunteerId);
                    }}
                    wordBreak="break-word"
                  >
                    Adicionar Voluntário/Palestrante
                  </Button>

                  <TableContainer>
                    <Table size="sm">
                      <Thead>
                        <Tr>
                          <Th>Nome</Th>
                          <Th>Telefone</Th>
                          <Th>Email</Th>
                          <Th>Tipo</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {eventVolunteersList.map((volunteer) => (
                          <Tr>
                            <Td>{volunteer.name}</Td>
                            <Td>{volunteer.phone}</Td>
                            <Td>{volunteer.email}</Td>
                            <Td>{volunteer.role}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Flex>
              </Flex>
            </Box>
          </ModalBody>
          <ModalFooter justifyContent={"center"}>
            <Button
              hidden={!createEventButton}
              backgroundColor={"#E11F4C"}
              color={"#FFF"}
              fontWeight={600}
              fontSize={["md", "lg"]}
              size={["sm", "md"]}
              _hover={{ backgroundColor: "#CC1C45" }}
              onClick={() => {
                const event = {
                  name: title,
                  description,
                  location,
                  startDate: new Date(startDate).toISOString(),
                  endDate: new Date(endDate).toISOString(),
                  speaker: {
                    name,
                    phoneNumber: phone,
                    email,
                    description: userDescription,
                  },
                };
                handleCreateEvent(event);
              }}
            >
              Criar Evento
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isConfirmed}
        onClose={() => {
          window.location.reload();
        }}
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

      <Modal isOpen={isOpen} onClose={onCloseModal}>
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
                  height={filteredEvents.length > 0 ? "300px" : "auto"}
                  hidden={createEventButton ? true : false}
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
                        <Flex
                          flexDirection={"row"}
                          justifyContent={"space-between"}
                        >
                          <Text>
                            <b>Título:</b> {event.name}
                          </Text>
                          <Button
                            variant={"ghost"}
                            height={"15px"}
                            color={"#E11F4C"}
                            _hover={{
                              backgroundColor: "transparent",
                              color: "#B7193E",
                            }}
                            onClick={() => {
                              handleDeleteEvent(event.id);
                            }}
                          >
                            Excluir
                          </Button>
                        </Flex>
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
                        <Button
                          variant={"ghost"}
                          height={"15px"}
                          color={"#E11F4C"}
                          _hover={{
                            backgroundColor: "transparent",
                            color: "#B7193E",
                          }}
                          onClick={() => {
                            fetchGeneralVolunteersList();
                            setSelectedEventId(event.id);
                            fetchVolunteersList(event.id);
                            setIsVolunteersOpen(true);
                          }}
                        >
                          <Flex flexDirection={"row"} align={"center"} mt={3}>
                            <FaUsersGear />
                            <Text ml={2}>Participantes/Voluntários</Text>
                          </Flex>
                        </Button>
                      </Box>
                    ))
                  ) : (
                    <Text textAlign={"center"} fontWeight={"light"}>
                      Nenhum evento encontrado para esta data.
                    </Text>
                  )}
                </Flex>

                <Button
                  backgroundColor={"#E11F4C"}
                  color={"#FFF"}
                  fontWeight={600}
                  fontSize={["md", "lg"]}
                  size={["sm", "md"]}
                  _hover={{ backgroundColor: "#CC1C45" }}
                  hidden={createEventButton ? true : false}
                  onClick={() => {
                    setCreateEventButton(true);
                  }}
                >
                  Criar Evento
                </Button>
                {createEventButton ? (
                  <>
                    <Flex direction={"column"}>
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
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
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
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                      <Flex direction={"row"} gap={2}>
                        <Flex direction={"column"} maxWidth={"50%"}>
                          <Text mb="8px" textAlign={"left"}>
                            Início*
                          </Text>
                          <Input
                            mb={3}
                            backgroundColor={"white"}
                            placeholder="Selecione a data e o horário"
                            size="md"
                            type="datetime-local"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                        </Flex>
                        <Flex direction={"column"} maxWidth={"50%"}>
                          <Text mb="8px" textAlign={"left"}>
                            Fim*
                          </Text>
                          <Input
                            mb={3}
                            backgroundColor={"white"}
                            placeholder="Selecione a data e o horário"
                            size="md"
                            type="datetime-local"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
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
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                      <Text textAlign={"center"} mt={"3%"} mb={"6%"}>
                        <b>Informações Palestrante</b>
                      </Text>
                      <Text mb="8px" textAlign={"left"}>
                        Nome completo*
                      </Text>
                      <Input
                        mb={3}
                        placeholder="Nome completo"
                        backgroundColor={"#fff"}
                        _hover={{ borderColor: "#E11F4C", borderWidth: 1.5 }}
                        width={"100%"}
                        _focus={{
                          borderColor: "#E11F4C",
                          boxShadow: `0 0 0 1px #E11F4C`,
                        }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <Text mb="8px" textAlign={"left"}>
                        Telefone*
                      </Text>
                      <Input
                        mb={3}
                        placeholder="Telefone"
                        backgroundColor={"#fff"}
                        _hover={{ borderColor: "#E11F4C", borderWidth: 1.5 }}
                        width={"100%"}
                        _focus={{
                          borderColor: "#E11F4C",
                          boxShadow: `0 0 0 1px #E11F4C`,
                        }}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      <Text mb="8px" textAlign={"left"}>
                        Email*
                      </Text>
                      <Input
                        mb={3}
                        placeholder="Email"
                        backgroundColor={"#fff"}
                        _hover={{ borderColor: "#E11F4C", borderWidth: 1.5 }}
                        width={"100%"}
                        _focus={{
                          borderColor: "#E11F4C",
                          boxShadow: `0 0 0 1px #E11F4C`,
                        }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Text mb="8px" textAlign={"left"}>
                        Descrição
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
                        value={userDescription}
                        onChange={(e) => setUserDescription(e.target.value)}
                      />
                    </Flex>
                  </>
                ) : null}
              </Flex>
            </Box>
          </ModalBody>
          <ModalFooter justifyContent={"center"}>
            <Button
              hidden={!createEventButton}
              backgroundColor={"#E11F4C"}
              color={"#FFF"}
              fontWeight={600}
              fontSize={["md", "lg"]}
              size={["sm", "md"]}
              _hover={{ backgroundColor: "#CC1C45" }}
              onClick={() => {
                const event = {
                  name: title,
                  description,
                  location,
                  startDate: new Date(startDate).toISOString(),
                  endDate: new Date(endDate).toISOString(),
                  speaker: {
                    name,
                    phoneNumber: phone,
                    email,
                    description: userDescription,
                  },
                };
                handleCreateEvent(event);
              }}
            >
              Criar Evento
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
