import { useEffect } from 'react';

import { authCallback } from 'utils/util';

export function CallbackPage() {
  useEffect(() => {
    authCallback();
  });
}
