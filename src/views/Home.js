import { Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { raindropGroup } from "../utils/constants";
import { useOrbis } from "../utils/context/orbis";
import CreatePost from "../components/layout/CreatePost";
import PostPreview from "../components/layout/PostPreview";

const Home = () => {

    const [posts, setPosts] = useState([]);

    const { orbis } = useOrbis();

    const getPosts = async () => {
        console.log('Getting home posts');
        const { data, error } = await orbis.getPosts({
            algorithm: 'all-context-master-posts',
            context: raindropGroup
        })

        console.log('Posts', data);

        setPosts(data)
    }

    useEffect(() => {
        getPosts()
    }, [])

    return (
        <Flex w='100%' h='100%' alignItems='center' flexDirection='column' ml='250px'>
            <Flex
                w='60%'
                minW='450px'
                alignItems='center'
                flexDirection='column'
                border='1px solid'
                borderColor='brand.500'
                position='relative'
            >
                <Flex borderBottom='1px solid' borderColor='brand.500' w='100%'>
                    <Text fontWeight='bold' pl='30px' py='10px' color='brand.500' fontSize='2xl'>HOME</Text>
                </Flex>
                <CreatePost withPicture getPosts={getPosts} />
                {posts.length > 0 && posts.map((post, i) => <PostPreview key={i} post={post} />)}
            </Flex>

        </Flex>
    )
}

export default Home;