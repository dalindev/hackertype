import React, { useState, useEffect } from "react";
import {
  Text,
  Box,
  Divider,
  Center,
  ModalFooter,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  FormControl,
  Input,
  FormHelperText,
  FormLabel,
  Button,
  useDisclosure,
  HStack,
  Link,
} from "@chakra-ui/react";

import { query, collection, getDocs } from "firebase/firestore";
import { db } from "./components/firebase";
import Submission from "./components/Submission";

export default function SeachModal({ isSearchOpen, onSearchClose }) {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [solutionList, setSolutionList] = useState([]);

  useEffect(() => {
    setLoading(true);
    setUserList([]);
    async function getUserList() {
      const tempArr = [];
      const q = query(collection(db, "users"));

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        if (tempArr.length > 5) return;
        const displayName = doc.data().displayName.toLowerCase();
        const userInputLower = userInput.toLowerCase();
        if (userInput === "") tempArr.push(doc.data());
        else if (displayName.includes(userInputLower)) tempArr.push(doc.data());
      });
      setUserList(tempArr);
    }

    async function getSolutionList() {
      const tempArr = [];
      const q = query(collection(db, "submissions"));

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        if (tempArr.length > 5) return;
        const displayName = doc.data().solution_id.toLowerCase();
        const userInputLower = userInput.toLowerCase();
        if (userInput === "") tempArr.push(doc);
        else if (displayName.includes(userInputLower)) tempArr.push(doc);
        console.log(doc.id);
      });
      setSolutionList(tempArr);
    }

    getSolutionList();
    getUserList().then(() => setLoading(false));
  }, [userInput, isSearchOpen]);

  return (
    <Center>
      <Modal
        isOpen={isSearchOpen}
        onClose={closeModal}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        size="6xl">
        <ModalOverlay />
        <ModalContent backgroundColor="#0e0e10" minHeight={"500px"}>
          <ModalHeader>
            <Box className="searchModal">
              <Text className="whiteText mainFont" fontSize="32px">
                search
              </Text>
              <ModalCloseButton />
            </Box>
          </ModalHeader>

          <ModalBody>
            <Box paddingBottom="25px">
              <FormControl className="whiteText mainFont">
                <Input
                  _selected={{ outline: "none" }}
                  _focus={{ outline: "none" }}
                  ref={initialRef}
                  placeholder={`search a solution/username`}
                  type="text"
                  onChange={(e) => setUserInput(e.target.value)}
                />
              </FormControl>
            </Box>
            <Box className="whiteText mainFont">
              <HStack className="whiteText mainFont"></HStack>
              <Box display="flex">
                <Box width="100%">
                  <Box paddingTop="15px">
                    <Box width="50%">
                      <Text fontSize="32px">users</Text>
                    </Box>
                    {userList.map((user) => (
                      <Box paddingTop="10px">
                        <Link textDecoration={"underline"} href={`/profile/${user.displayName}`}>
                          {user.displayName}
                        </Link>
                      </Box>
                    ))}
                    <Box paddingTop="20px" width="50%">
                      <Text fontSize="32px">solutions</Text>
                    </Box>
                    {loading && <Text>loading...</Text>}
                    {solutionList.map((sol) => (
                      <Text>{sol.data().solution_id}</Text>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );

  function closeModal() {
    onSearchClose();
    setUserInput("");
    setUserList([]);
  }
}
