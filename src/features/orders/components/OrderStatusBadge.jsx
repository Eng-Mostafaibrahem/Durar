import { useTranslation } from 'react-i18next';
import { Badge } from '../../../components/ui/Badge.jsx';
import { statusBadgeVariant } from '../lib/orderHelpers.js';

export function OrderStatusBadge({ order }) {
  const { t } = useTranslation();

  return (
    <Badge variant={statusBadgeVariant(order?.status)} size="sm">
      {t(`account:orderStatus.${order?.status ?? 'pending'}`)}
    </Badge>
  );
}
