import { useState, useEffect } from "react";
import { ChakraProvider, Box, Flex, Heading, Button, Input, Textarea, VStack, Text, HStack, Spacer, useToast } from "@chakra-ui/react";
import { FaHome, FaPlus, FaShoppingCart } from "react-icons/fa";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://your-supabase-url.supabase.co";
const supabaseKey = "your-supabase-key";
const supabase = createClient(supabaseUrl, supabaseKey);

const Index = () => {
  const [page, setPage] = useState("home");
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const toast = useToast();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data } = await supabase.from("items").select("*");
    setItems(data);
  };

  const addItem = async () => {
    if (name && price && description) {
      const { data, error } = await supabase.from("items").insert([{ name, price, description }]);
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Item Added",
          description: "Your item has been added successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setName("");
        setPrice("");
        setDescription("");
        fetchItems();
        setPage("home");
      }
    } else {
      toast({
        title: "Error",
        description: "All fields are required.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <ChakraProvider>
      <Box bg="teal.500" p={4} color="white">
        <Flex>
          <Heading size="lg">E-commerce</Heading>
          <Spacer />
          <HStack spacing={4}>
            <Button leftIcon={<FaHome />} onClick={() => setPage("home")} colorScheme="teal" variant="outline">
              Home
            </Button>
            <Button leftIcon={<FaPlus />} onClick={() => setPage("add")} colorScheme="teal" variant="outline">
              Add Item
            </Button>
          </HStack>
        </Flex>
      </Box>
      <Box p={4}>
        {page === "home" && (
          <VStack spacing={4}>
            {items.map((item) => (
              <Box key={item.id} p={4} borderWidth="1px" borderRadius="lg" w="100%">
                <Heading size="md">{item.name}</Heading>
                <Text>Price: ${item.price}</Text>
                <Text>{item.description}</Text>
                <Button leftIcon={<FaShoppingCart />} colorScheme="teal" variant="solid" mt={2}>
                  Add to Cart
                </Button>
              </Box>
            ))}
          </VStack>
        )}
        {page === "add" && (
          <VStack spacing={4}>
            <Heading size="lg">Add New Item</Heading>
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Button colorScheme="teal" onClick={addItem}>
              Add Item
            </Button>
          </VStack>
        )}
      </Box>
    </ChakraProvider>
  );
};

export default Index;
