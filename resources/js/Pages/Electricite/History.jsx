import { Button, Modal } from '@/components/ui';
import { useConfirmationModal, useNavigate, useUser } from '@/hooks';
import { formatDate } from '@/utils/helpers';
import { IoTrashOutline } from 'react-icons/io5';

export function History({ history, onClose }) {
  return (
    <Modal
      isOpen={Boolean(history)}
      className='relative overflow-auto md:h-[500px] md:w-[700px] md:border'
      onClose={onClose}
      closeButton={false}
    >
      <div className='grid grid-cols-[1fr,1fr,32px] border-b border-border px-3 sm:px-5'>
        <span className='mr-2 border-r-2 border-border py-3 font-medium text-text-tertiary'>Date</span>
        <span className='py-3 font-medium text-text-tertiary'>Index</span>
        <span></span>
      </div>
      <div className='overflow-y-auto border-b border-border'>
        {history && history.map((h, i) => <HistoryItem key={i} {...h} />)}
      </div>
    </Modal>
  );
}
function HistoryItem({ index, date, id }) {
  const { navigate } = useNavigate();
  const { openModal } = useConfirmationModal();
  const { user } = useUser();

  return (
    <div className='grid grid-cols-[1fr,1fr,32px] items-center px-5 even:bg-background-secondary'>
      <span className='mr-2 h-full border-r-2 border-border py-3 font-medium capitalize text-text-primary'>
        {formatDate(date, true, 'DATETIME_MED_WITH_WEEKDAY')}
      </span>
      <span className='py-3 font-medium text-text-primary'>{index}</span>
      {user.role === 'superAdmin' && (
        <Button
          shape='icon'
          onClick={() => {
            openModal({
              message: 'You are about to delete a history item. Do you wish to proceed?',
              title: 'Delete History',
              confirmText: 'Delete',
              onConfirm: () =>
                navigate({
                  url: `/row/${id}/history/delete`,
                  method: 'DELETE',
                }),
            });
          }}
        >
          <IoTrashOutline />
        </Button>
      )}
    </div>
  );
}
