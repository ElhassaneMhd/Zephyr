import Counter from '@/components/Counter';

export default function General({ tables, history }) {
  return (
    <Counter
      title='Eau | Compteur General'
      routeName='/eau'
      type='general'
      tables={tables}
      history={history}
      exclude={['puissance', 'cos']}
    />
  );
}
