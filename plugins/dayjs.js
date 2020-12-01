import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'

export default ({ app }, inject) => {
  app.$dayjs = dayjs
  app.$dayjs.extend(isToday)
  inject('dayjs', app.$dayjs)
}
