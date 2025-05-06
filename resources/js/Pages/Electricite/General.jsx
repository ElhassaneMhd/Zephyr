import Counter from '@/components/Counter';

export default function General({ tables, history }) {
  return (
    <Counter
      title='Electricite | Compteur General'
      routeName='/electricite'
      type='general'
      tables={tables}
      history={history}
    />
  );
}
