import Counter from '@/components/Counter';

export default function General({ tables, history }) {
  return (
    <Counter title='Eau | Compteur General' routeName='/eau' type='divisional' tables={tables} history={history} />
  );
}
