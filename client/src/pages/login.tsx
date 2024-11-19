import { useEffect, useRef } from 'react';

import { auth } from 'utils';

export function LoginPage() {
  // Ref is to work around React 18+ strict mode in development
  const effectRan = useRef(false);

  const redirectToLogin = async () => {
    try {
      await auth.login();
    } catch (error) {
      console.log(`Error during login: ${error}`);
    }
  };

  useEffect(() => {
    if (effectRan.current === false) {
      redirectToLogin();
    }

    return () => {
      effectRan.current = true;
    };
  }, []);
}
