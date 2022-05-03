
import Layout from '@/layout'

const salaryRouter = {
  path: '/salarys',
  component: Layout,
  name: 'salarys',
  children: [
    {
      path: '',
      component: () => import('@/views/salarys'),
      name: 'salarys',
      meta: {
        title: '工资',
        icon: 'money'
      }
    }
  ]
}
export default salaryRouter
