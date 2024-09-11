import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useErrorHandler } from "@/shared/lib/hooks/useErrorHandler";
import { useAuth } from "@/features/auth/useAuth";
import { useTelegram } from "@/shared/lib/hooks/useTelegram";
import ponkeImage from '@/shared/assets/images/auth/ponke.png';
import styles from './Auth.module.scss';

const ANIMATION_TIME = 500;
const REDIRECT_DELAY = ANIMATION_TIME * 7;

export const Auth = () => {
  const [isAnimationEnd, setIsAnimationEnd] = useState(false);
  const { isValidPlaform } = useTelegram();
  const authModel = useAuth();
  const { errorMessage, setError } = useErrorHandler();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsAnimationEnd(true);
      clearTimeout(timeout);
    }, REDIRECT_DELAY);
  }, []);

  useEffect(() => {
    if (isAnimationEnd && isValidPlaform) {
      authModel.initialize().catch(err => setError(`Authentication failed: ${err.message}`));
    }
  }, [isAnimationEnd]);

  return (
    <div className={styles.root}>
      {isValidPlaform && (
        <div className={styles.container}>
          <Ponke />
          <Ton />
          <img
            className={styles['ponke_img']}
            src={ponkeImage}
            alt={'ponke'}
          />
          {errorMessage && (
            <div className={styles['error-message']}>
              <h2>{errorMessage}</h2>
            </div>
          )}
        </div>
      )}
      {!isValidPlaform && (
        <div className={styles['invalid-platform']}>
          <h1>USE MOBILE DEVICE</h1>
          <h1>USE MOBILE DEVICE</h1>
        </div>
      )}
    </div>
  );
};

// Ponke and Ton components remain the same

const Ponke = () => {
    const images = {
        p: require('@/shared/assets/images/auth/p.png'),
        o: require('@/shared/assets/images/auth/o.png'),
        n: require('@/shared/assets/images/auth/n.png'),
        k: require('@/shared/assets/images/auth/k.png'),
        e: require('@/shared/assets/images/auth/e.png'),
    }

    const letters = ['p', 'o', 'n', 'k', 'e'] as const

    return <div className={styles['ponke-wrapper']}>
        {letters.map(letter => (
            <img
                src={images[letter]}
                key={`ponke-${letter}`}
                className={`${styles['ponke_letter']} ${styles[`ponke_letter-${letter}`]}`}
                alt={'letter'}
            />
        ))}
    </div>
}

const Ton = () => {
    const images = {
        t: require('@/shared/assets/images/auth/T.png'),
        o: require('@/shared/assets/images/auth/o_t.png'),
        n: require('@/shared/assets/images/auth/n_t.png'),
    }

    const letters = ['t', 'o', 'n'] as const

    return <div>
        {letters.map(letter => (
            <img
                src={images[letter]}
                key={`ton-${letter}`}
                className={`${styles['ton_letter']} ${styles[`ton_letter-${letter}`]}`}
                alt={'letter'}
            />
        ))}
    </div>
}