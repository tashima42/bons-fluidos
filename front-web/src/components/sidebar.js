import { Flex, Box, Button, Image } from "@chakra-ui/react";
import { FaInstagram } from "react-icons/fa";

export default function Sidebar() {
  return (
    <Box
      maxWidth={"400px"}
      height={"100vh"}
      backgroundColor={"#F2B7C5"}
      width={"30%"}
    >
      <Flex
        flexDirection={"column"}
        justify="space-between"
        align="center"
        height="100%"
      >
        <Image
          src="/img/logo.png"
          maxWidth={"80%"}
          alt="Bons Fluídos"
          pt={6}
          justifySelf={"center"}
        ></Image>
        <Flex flexDirection={"column"} gap={3}>
          <Button
            color={"#D92353"}
            fontSize={["xs", "md", "xl"]}
            backgroundColor={"transparent"}
            _hover={{ backgroundColor: "transparent", color: "#D92353" }}
          >
            HOME
          </Button>
          <Button
            backgroundColor={"transparent"}
            fontSize={["xs", "xs", "md", "xl"]}
            _hover={{ backgroundColor: "transparent", color: "#D92353" }}
          >
            PALESTRAS
          </Button>
          <Button
            backgroundColor={"transparent"}
            fontSize={["xs", "xs", "md", "xl"]}
            _hover={{ backgroundColor: "transparent", color: "#D92353" }}
          >
            INSCRIÇÃO
          </Button>
        </Flex>
        <Image
          src="/img/sidebar.png"
          alt="Bons Fluídos"
          justifySelf={"center"}
        ></Image>
        <Button
          pb={6}
          color={"black"}
          backgroundColor={"transparent"}
          fontSize={["xs", "xs", "md", "xl"]}
          _hover={{ backgroundColor: "transparent", cursor: "default" }}
        >
          <FaInstagram size={25} />
          bonsfluidosutfpr
        </Button>
      </Flex>
    </Box>
  );
}
