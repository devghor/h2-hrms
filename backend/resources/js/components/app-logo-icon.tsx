import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg className="mx-auto h-24 w-24 opacity-90" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V6C15 7.66 13.66 9 12 9S9 7.66 9 6V5.5L3 7V9L9 10.5V22H15V10.5L21 9Z" />
        </svg>
    );
}
