import { ReactNode } from 'react';
import cn from 'classnames';

import style from './ContentWrapper.module.css';

export interface IWrapper {
    isCentered?: Boolean
    children: ReactNode
}

export const ContentWrapper = ({
    isCentered = false,
    children
}: IWrapper) => (
    <div className={ cn(style.container, { [style.isCentered]: isCentered }) }>
        { children }
    </div>
);