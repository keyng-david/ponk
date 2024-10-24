import React, { useState } from 'react';
import { useStore } from 'effector-react';
import { friendsModel } from '@/entities/friends/model';
import { toFormattedNumber } from '@/shared/lib/number';
import { IonIcon } from '@ionic/react';
import { copyOutline } from 'ionicons/icons';
import { useTelegram } from '@/shared/lib/hooks/useTelegram';
import styles from './Friends.module.scss';

export const Friends = () => {
  const { isLoading } = friendsModel.useFetchGate();
  const data = useStore(friendsModel.$data);
  const { friends: count, points, tg, premium, link } = data;

  return (
    <div
      className={styles.root}
      style={{
        background:
          'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)',
      }}
    >
      <Title />
      <Main
        isLoading={isLoading}
        count={count}
        points={points}
        tg={tg}
        premium={premium}
        link={link}
      />
    </div>
  );
};

const Title = () => (
  <h2
    className="text-4xl text-center mt-4"
    style={{
      background: 'linear-gradient(115deg, #62cff4, #2c67f2)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
    }}
  >
    FRIENDS
  </h2>
);

const Main = React.memo<{
  isLoading: boolean;
  count: number;
  points: number;
  tg: number;
  premium: number;
  link: string;
}>(({ isLoading, count, points, tg, premium, link }) => {
  const [copied, setCopied] = useState(false);
  const { sendInviteLink } = useTelegram();

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
      });
  };

  return (
    <div className={`${styles.main} flex flex-col items-center px-6`}>
      {/* Tailwind Title */}
      <h2 className="text-3xl font-bold mb-6 text-center">
        Invite frens. Earn points
      </h2>

      {/* Grid Boxes */}
      <div className="grid grid-cols-2 gap-4 mb-6 w-full">
        {/* Frens Box */}
        <div className={`${styles.boxGradient} p-3 rounded-lg text-center`}>
          <p className={`${styles.gradientText} text-lg font-semibold`}>
            Frens
          </p>
          <p className="text-base text-white">{count}</p>
        </div>

        {/* Earned Box */}
        <div className={`${styles.boxGradient} p-3 rounded-lg text-center`}>
          <p className={`${styles.gradientText} text-lg font-semibold`}>
            Earned
          </p>
          <p className="text-base text-white">+{points}</p>
        </div>
      </div>

      {/* How it works section */}
      <div className="w-full">
        <h3 className="text-lg font-semibold mb-6">How it works</h3>

        {/* Steps */}
        <div className="space-y-8">
          {/* Step 1 */}
          <div className="flex items-start space-x-4">
            <div className="bg-white w-3 h-3 rounded-full mt-1"></div>
            <div>
              <p className="text-base font-semibold">
                Share your invitation link
              </p>
              <p className={`${styles.gradientText} text-sm`}>
                Click the invite frens button to invite friends
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start space-x-4">
            <div className="bg-white w-3 h-3 rounded-full mt-1"></div>
            <div>
              <p className="text-base font-semibold">Your friends join</p>
              <p className={`${styles.gradientText} text-sm`}>
                Earn extra +{toFormattedNumber(tg)} coins for each friend
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start space-x-4">
            <div className="bg-white w-3 h-3 rounded-full mt-1"></div>
            <div>
              <p className="text-base font-semibold">
                Earn {toFormattedNumber(premium)}% Referral Bonus from Friends
                Invites
              </p>
              <p className={`${styles.gradientText} text-sm`}>
                Earn extra points from your friends' referrals
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Button with Copy functionality */}
      <div className="flex items-center justify-center space-x-2 px-4 mb-8">
        <button
          className="flex-grow bg-white text-black py-3 rounded-full font-bold text-lg"
          onClick={() => sendInviteLink(link)}
        >
          Invite a fren
        </button>
        <button
          className="bg-white text-black p-3 rounded-full font-bold flex items-center justify-center"
          onClick={copyToClipboard}
        >
          <IonIcon icon={copyOutline} />
        </button>
      </div>

      {/* Copied notification */}
      {copied && (
        <div className="text-center text-green-500 font-semibold">
          Copied!
        </div>
      )}
    </div>
  );
});