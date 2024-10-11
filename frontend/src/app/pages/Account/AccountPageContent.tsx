import React from 'react';
import { ChangePasswordColumn, CredentialsColumn } from '@app/pages';

export const Content = () => (
    <div className="account-page-data-row mh-100">
        <CredentialsColumn />
        <ChangePasswordColumn />
    </div>
);
