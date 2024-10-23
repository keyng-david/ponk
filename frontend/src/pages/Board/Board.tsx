import React, { useEffect } from 'react';
import { LoaderTemplate } from '@/shared/ui/LoaderTemplate';
import { leadersModel } from '@/entities/leaders/model';
import { LeaderData } from '@/entities/leaders/model/types';
import { reflect } from '@effector/reflect';
import { toFormattedNumber } from '@/shared/lib/number';

import coinImage from '@/shared/assets/images/main/coin.svg';
import firstMedal from '@/shared/assets/images/leaders/1st.svg';
import secondMedal from '@/shared/assets/images/leaders/2nd.svg';
import thirdMedal from '@/shared/assets/images/leaders/3rd.svg';

export const Board = () => {
  useEffect(() => {
    leadersModel.leadersRequested();
  }, []);

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background:
          'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)',
      }}
    >
      <Title />
      <MainReflect />
    </div>
  );
};

const Title = () => (
  <h2
    className="text-4xl text-center mt-4 text-transparent bg-clip-text"
    style={{ background: 'linear-gradient(115deg, #62cff4, #2c67f2)' }}
  >
    LEADERS
  </h2>
);

const MainReflect = reflect({
  view: Main,
  bind: {
    list: leadersModel.$list,
    isLoading: leadersModel.$isLoading,
    userData: leadersModel.$userLeaderData,
  },
});

function Main({
  isLoading,
  list,
  userData,
}: {
  isLoading: boolean;
  list: LeaderData[];
  userData: LeaderData;
}) {
  return (
    <LoaderTemplate isLoading={isLoading} className="">
      <Header />
      {userData.position !== -1 && <UserScore {...userData} />}
      <div className="space-y-4 px-4">
        {list.map((leader) => {
          if (leader.position <= 3) {
            return <TopPlayer key={leader.position} {...leader} />;
          } else {
            return <PlayerItem key={leader.position} {...leader} />;
          }
        })}
      </div>
    </LoaderTemplate>
  );
}

const Header = () => (
  <div className="flex justify-between items-center py-4 px-6 text-gray-400 text-sm">
    <span>Top Players</span>
    <span>Total points earned</span>
  </div>
);

function UserScore({ position, name, score }: LeaderData) {
  return (
    <div className="flex justify-between items-center bg-yellow-600 px-6 py-3 rounded-lg mx-4 mb-4">
      <div className="text-sm font-bold text-black">
        {position}+ {name}
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-lg font-bold text-white">
          {toFormattedNumber(score)}
        </span>
        <img src={coinImage} alt="coin" className="w-6 h-6" />
      </div>
    </div>
  );
}

function TopPlayer({ position, name, score }: LeaderData) {
  const medalImages: { [key: string]: string } = {
    '1': firstMedal,
    '2': secondMedal,
    '3': thirdMedal,
  };

  return (
    <div className="flex justify-between items-center bg-gray-900 px-6 py-3 rounded-lg">
      <div className="flex items-center space-x-4">
        <img
          src={medalImages[position.toString()]}
          alt={`position-${position}-medal`}
          className="w-6 h-6"
        />
        <span>{name}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span>{toFormattedNumber(score)}</span>
        <img src={coinImage} alt="coin" className="w-6 h-6" />
      </div>
    </div>
  );
}

function PlayerItem({ position, name, score }: LeaderData) {
  return (
    <div className="flex justify-between items-center bg-gray-900 px-6 py-3 rounded-lg">
      <div className="flex items-center space-x-4">
        <span>{position}</span>
        <span>{name}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span>{toFormattedNumber(score)}</span>
        <img src={coinImage} alt="coin" className="w-6 h-6" />
      </div>
    </div>
  );
}