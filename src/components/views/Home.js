import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { raindropGroup } from "../../utils/constants";
import { useOrbis } from "../../utils/context/orbis";
import CreatePost from "../layout/CreatePost";
import PostPreview from "../layout/PostPreview";

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
                w='55%'
                alignItems='center'
                flexDirection='column'
                border='1px solid'
                borderColor='brand.500'
                position='relative'
            >
                <CreatePost />
                {posts.length > 0 && posts.map((post, i) => <PostPreview key={i} post={post}/>)}
            </Flex>

        </Flex>
    )
}

export default Home;


/*const test = async () => { //Used to create Raindrop group
    console.log('Creating group')
    const res = await orbis.createGroup({
        name: 'Raindrop',
        description: 'Raindrop is a decentralized creators platform',
        pfp: 'bafkreihb2byalwwpa2lj7l7skz4klovxvciro56qht25bxij75zgmn7klu'
    })

    console.log('Group res', res);
}*/