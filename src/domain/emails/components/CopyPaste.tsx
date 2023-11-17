import { Link, Text } from '@react-email/components';
import { linkClassName } from '../constants';

export const CopyPaste = ({
  link,
  text = 'or copy and paste this URL into your browser:',
}: {
  link: string;
  text?: string;
}) => (
  <Text className="text-black text-md text-center">
    {text}
    <br />
    <Link href={link} target="_blank" rel="noreferrer noopener" className={linkClassName}>
      {link}
    </Link>
  </Text>
);
