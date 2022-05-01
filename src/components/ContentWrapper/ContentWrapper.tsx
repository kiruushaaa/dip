import { ReactNode } from 'react';
import cn from 'classnames';

import style from './ContentWrapper.module.css';

export interface Wrapper {
    isCentered?: Boolean
    children: ReactNode
}

export const ContentWrapper = ({
    isCentered = false,
    children
}: Wrapper) => (
    <div className={ cn(style.container, { [style.isCentered]: isCentered }) }>
        { children }
    </div>
);