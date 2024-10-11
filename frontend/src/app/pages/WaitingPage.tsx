import React from 'react';
import Page from '../../ToBeMoved/Pages/Page';
import BusyEvent from '../../ToBeMoved/CommonComponents/BusyEvent';

type Props = {
  label?: string;
};

const WaitingPage = (props: Props) => {
  const { isBusy } = BusyEvent();
  return (
    <Page className={`waiting-page`}>
      <div className={'waiting-page-content'}>
        <div className={'h1'}>{isBusy ?? props.label}</div>
        <div className={'waiting-page-load-spinner'}></div>
      </div>
    </Page>
  );
};
export default WaitingPage;
