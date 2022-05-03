
import Layout from '@/layout'

export default {
  path: '/social_securitys',
  component: Layout,
  name: 'social_securitys',
  children: [
    {
      path: '',
      component: () => import('@/views/social'),
      name: 'social_securitys',
      meta: {
        title: '社保',
        icon: 'table'

      }
    }
  ]
}
