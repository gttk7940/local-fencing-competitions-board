import { Box, Button, Flex, Heading } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

export const Header = () => {
  return (
    <Box backgroundColor="orange">
      <Flex direction="column" align="center" gap="10px" padding="10px">
        <Heading size="3xl" color="white">
          フェンシング ローカル大会掲示板
        </Heading>
        <Flex gap="10px">
          <Button asChild>
            <Link to="/">大会を探す</Link>
          </Button>
          <Button asChild>
            <Link to="/new">大会を登録する</Link>
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}
