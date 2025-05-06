import Counter from '@/components/Counter';

export default function Divisional({ tables, history }) {
  return (
    <Counter
      title='Eau | Compteur Divisionnel'
      routeName='/eau'
      type='divisional'
      tables={tables}
      history={history}
      exclude={['puissance', 'cos']}
    />
  );
}
