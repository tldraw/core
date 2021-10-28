import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
const Editor = dynamic(() => import('../components/editor'), { ssr: false })

const Home: NextPage = () => {
  return (
    <div>
      <Editor />
    </div>
  )
}

export default Home
