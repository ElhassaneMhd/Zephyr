import Counter from '@/components/Counter';

export default function Divisional({ tables, history }) {
  return (
    <Counter
      title='Electricite | Compteur Divisionnel'
      routeName='/electricite'
      type='divisional'
      tables={tables}
      history={history}
      exclude={['puissance', 'cos']} 
    />
  );
}
