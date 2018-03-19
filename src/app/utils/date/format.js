import { format } from 'date-fns'
import ptLocale from 'date-fns/locale/pt'

export default (date, f = 'DD/MM/YYYY HH:mm:ss') => format(date, f, { locale: ptLocale })
