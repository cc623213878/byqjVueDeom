import layoutHeaderAside from '@/layout/header-aside'

export default {
  layoutHeaderAside: layoutHeaderAside,
  score: () => import(/* webpackChunkName: "score" */ '@/pages/score'),
  'college-department': () =>
    import(/* webpackChunkName: "college-department" */ '@/pages/data/college-department'),
  'maintenance-dictionary': () =>
    import(/* webpackChunkName: "maintenance-dictionary" */ '@/pages/data/maintenance-dictionary'),
  'class-management': () =>
    import(/* webpackChunkName: "class-management" */ '@/pages/data/class-management'),
  'job-management': () =>
    import(/* webpackChunkName: "job-management" */ '@/pages/data/job-management'),
  'student-management': () =>
    import(/* webpackChunkName: "student-management" */ '@/pages/data/student-management')
}
