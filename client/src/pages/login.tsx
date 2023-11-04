import { useEffect } from 'react';

import {redirectToLogin} from 'utils/util';

export function LoginPage() {
  useEffect(() => {
    redirectToLogin();
  });
}
