import Header from '../components/Header';
import Test from '../components/Test';
import Test2 from '../components/Test2';
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi';

const App = () => {

    const account = useAccount();
    const [tab, setTab] = useState(0);

    useEffect(() => {
        console.log(account)
    },[account])

    return (
        <div>
            <Header />
            {account.address ?
                <div>
                    <Test />
                    <Test2 />
                </div>
                :
                tab != 2 &&
                <div>
                    Tab2
                </div>
            }
        </div>
    )
}

export default App;