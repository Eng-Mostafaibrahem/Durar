import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Container } from '../../../components/Container.jsx';
import { paths } from '../../../lib/paths.js';
import { TicketPrint } from '../components/TicketPrint.jsx';

export default function TicketConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const reservation = location.state?.reservation;

  if (!reservation) return <Navigate to={paths.tickets} replace />;

  return (
    <Container className="flex justify-center py-10 font-sans sm:py-16">
      <div className="w-full" role="status" aria-live="polite">
        <TicketPrint
          reservation={reservation}
          onBookAnother={() => navigate(paths.tickets, { replace: true })}
        />
      </div>
    </Container>
  );
}
