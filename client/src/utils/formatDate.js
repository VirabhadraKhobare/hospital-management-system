import { format } from 'date-fns';

const formatDate = (value) => {
  if (!value) return '-';
  return format(new Date(value), 'dd MMM yyyy');
};

export default formatDate;
