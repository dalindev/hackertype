import React from "react";
import { Text, Box, Center, Button, HStack, VStack, Input } from "@chakra-ui/react";
export default function Settings() {
  return (
    <Center>
      <Box width="70%" className=" mainFont font500">
        <Center>
          <Box width="100%" paddingTop="50px" className="whiteText">
            <Text color="gray" fontSize="66px">
              settings (wip)
            </Text>
            <Box>
              <Box>
                <Text color="gray" fontSize="45px">
                  typing
                </Text>
                <Box paddingLeft="5rem">
                  <Box paddingBottom="3rem" display="flex" justifyContent={"space-between"}>
                    <Text fontSize="18px" className="grayText font600">
                      <Text color="white" fontSize="40px">
                        font size
                      </Text>
                      character size for the word set
                    </Text>

                    <Box width="10%" fontSize="30px">
                      <Input type="text"></Input>
                    </Box>
                  </Box>
                  <Box paddingBottom="3rem" display="flex" justifyContent={"space-between"}>
                    <Text fontSize="18px" className="grayText font600">
                      <Text color="white" fontSize="40px">
                        tab size
                      </Text>
                      number of spaces for each indent in the word set
                    </Text>
                    <Box width="10%" fontSize="30px">
                      <Input type="text"></Input>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Text color="gray" fontSize="45px">
                themes
              </Text>
              <Box paddingLeft="5rem">
                <Box paddingBottom="3rem" display="flex" justifyContent={"space-between"}>
                  wip
                </Box>
              </Box>
            </Box>

            <Text fontSize="22px" className="grayText font400"></Text>
          </Box>
        </Center>
      </Box>
    </Center>
  );
}
