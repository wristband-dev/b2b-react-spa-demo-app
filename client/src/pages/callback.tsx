import { useEffect, useRef } from 'react';

import { auth } from 'utils';

export function CallbackPage() {
  const effectRan = useRef(false);

  const handleCallback = async () => {
    try {
      await auth.callback();
    } catch (error) {
      console.log(`Error during auth callback: ${error}`);
    }
  };

  useEffect(() => {
    if (effectRan.current === false) {
      handleCallback();
    }

    //cleanup function
    return () => {
      effectRan.current = true; // this will be set to true on the initial unmount
    };
  }, []);
}
