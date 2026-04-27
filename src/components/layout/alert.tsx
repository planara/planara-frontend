// Core
import { type JSX, useEffect, useMemo, useState } from 'react';
// Components
import { CheckmarkCircleRegular, DismissCircleRegular, InfoRegular } from '@fluentui/react-icons';
// Types
import { AlertPosition } from '@/types/layout/alert/alert-position';
import { AlertStatus } from '@/types/layout/alert/alert-status';

type AlertProps = {
  message: string;
  status: AlertStatus;
  position: AlertPosition;
  onClose: () => void;
};

const Alert = ({ message, status, position, onClose }: AlertProps): JSX.Element => {
  const [visible, setVisible] = useState(false);

  const Icon = useMemo(() => {
    if (status === AlertStatus.Success) {
      return CheckmarkCircleRegular;
    }

    if (status === AlertStatus.Error) {
      return DismissCircleRegular;
    }

    return InfoRegular;
  }, [status]);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setVisible(true);
    }, 10);

    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 2600);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    if (visible) {
      return;
    }

    const removeTimer = setTimeout(() => {
      onClose();
    }, 260);

    return () => {
      clearTimeout(removeTimer);
    };
  }, [visible, onClose]);

  return (
    <div className={['alert', visible ? 'alert--show' : 'alert--hide', position, status].join(' ')}>
      <span className="alert__icon">
        <Icon />
      </span>

      <span className="alert__message">{message}</span>
    </div>
  );
};

export default Alert;
