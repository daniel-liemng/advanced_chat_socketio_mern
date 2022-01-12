import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [show, setShow] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [pic, setPic] = useState('');
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const handleShowPassword = () => {
    setShow((prevState) => !prevState);
  };

  const postPicture = async (pic) => {
    setLoading(true);
    if (pic === undefined) {
      toast({
        title: 'Please select an Image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    if (pic.type === 'image/jpeg' || pic.type === 'image/png') {
      const picData = new FormData();
      picData.append('file', pic);
      picData.append('upload_preset', 'advanced_chat_2022');
      picData.append('cloud_name', 'danhln');

      try {
        const { data } = await axios.post(
          `https://api.cloudinary.com/v1_1/danhln/image/upload`,
          picData,
        );
        setPic(data.url.toString());
        setLoading(false);
      } catch (err) {
        console.log(err.message);
        setLoading(false);
      }
    } else {
      toast({
        title: 'Please select an Image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setLoading(false);
      return;
    }
  };

  const submitHandler = (e) => {};

  console.log('DDD', pic);

  return (
    <VStack spacing={'5px'}>
      <FormControl id='name' isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder='Enter Your Name'
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type={'email'}
          placeholder='Email Address'
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width={'4.5rem'}>
            <Button h={'1.75rem'} size={'sm'} onClick={handleShowPassword}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id='confirmpassword' isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            placeholder='Confirm Password'
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width={'4.5rem'}>
            <Button h={'1.75rem'} size={'sm'} onClick={handleShowPassword}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id='pic'>
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type={'file'}
          p={'1.5'}
          accept='image/*'
          onChange={(e) => postPicture(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorScheme={'blue'}
        width={'100%'}
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>

      <Button
        variant={'solid'}
        colorScheme={'red'}
        width={'100%'}
        onClick={() => {
          setEmail('guest@example.com');
          setPassword('123456');
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Signup;
