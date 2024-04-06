import {
  Box, Center, HStack,
  Text, VStack,
} from "@chakra-ui/react";

export default function Rank3({name, streak, last_daily, dailyNum}) {
  const config = localStorage.getItem("config") ? JSON.parse(localStorage.getItem("config")) : {};
  return (
    <Box>
      <Box borderWidth={3} py={4} borderRadius={10} width={'300px'} height={'150px'}
           borderColor={config["subtleText"]}>
        <VStack>
          <Text color={config["mainText"]} as={'a'} href={`/profile/${name}`} fontSize={'24px'}
                className={'mainFont underline'}>3. {name}
          </Text>
          <HStack pr={4}>
            {last_daily === dailyNum ? (
              <Box pt={4} color={config["logoColor"]} fontSize={'40px'}>
                <ion-icon name="flame"></ion-icon>
              </Box>
            ) : (
              <Box pt={4} color={config["subtleText"]} fontSize={'40px'}>
                <ion-icon name="flame-outline"></ion-icon>
              </Box>
            )}

            <Text color={config["mainText"]} fontSize={'50px'}
                  className={'mainFont'}>
              {' '}
              {streak}
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
}