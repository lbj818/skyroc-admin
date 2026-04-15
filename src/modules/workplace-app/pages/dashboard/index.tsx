import { useRoute } from '@/features/router/useRoute'

const Dashboard = () => {
  const routes = useRoute()
  console.log('routes', routes)
  return (
    <div className="p-24px">
      <h1>我的工作台</h1>
      <p>这是工作台页面，待开发...</p>
    </div>
  )
}

export default Dashboard
